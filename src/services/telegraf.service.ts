import config from '@/config';
import CustomContext from '@/interfaces/customcontext.interface';
import ShowInterface from '@/interfaces/show.interface';
import showService from '@/services/show.service';
import logger from '@/libs/logger';
import { DateTime, Settings } from 'luxon';
import userService from '@/services/user.service';
import { Telegraf } from 'telegraf';
import tmdbService from '@/services/tmdb.service';
import { Message } from 'telegraf/typings/core/types/typegram';
Settings.defaultZone = config.timezone;

class TelegrafService {
    public async deleteUserShow(ctx: CustomContext, id: number) {
        if (!ctx.user.shows.includes(id)) {
            return ctx.reply('No estás siguiendo esta serie');
        }
        await userService.deleteShow(ctx.from.id, id);
        return ctx.reply('Serie eliminada correctamente.');
    }
    public async addNewShow(ctx: CustomContext, id: number) {
        if(ctx.user.shows.includes(id)) {
            return ctx.reply('Ya estás siguiendo esta serie');
        }
        let show = await showService.getShowById(id);
        if (!show) {
            const tmdb_show = await tmdbService.getShowById(id);
            await showService.upsertShows([tmdb_show]);
        }
        show = await showService.getShowById(id);
        await userService.addShow(ctx.from.id, show.id);
        return ctx.reply(`${show.name} agregada correctamente.`);
    }
    public async findShowByName(ctx: CustomContext): Promise<Message.TextMessage> {
        const message = ctx.message as Message.TextMessage;
        const shows = await tmdbService.getShowsByName(message.text);
        logger.debug('shows:');
        logger.debug(shows)
        if (!shows.results.length) {
            return ctx.reply('No se encontraron resultados');
        }
        const buttons = [];
        for (let show of shows.results) {
            const date = DateTime.fromFormat(show.first_air_date || '', 'yyyy-MM-dd');
            buttons.push([{
                text: `${show.name}${date.isValid ? ` (${date.toFormat('yyyy')})` : ''}`,
                callback_data: `newshow:${show.id}`
            }]);
        }
        return ctx.reply('Selecciona una serie:', {
            reply_markup: {
                inline_keyboard: buttons,
            },
        });
    }
    public async sendTodayEpisodes(bot: Telegraf<CustomContext>, hour: number) {
        const users = await userService.getAllUsersWithShows(hour);
        for (const user of users) {
            logger.debug('user:');
            logger.debug(user);
            await bot.telegram.sendMessage(user.id, 'Estrenos hoy:');
            await this.sendNextEpisodes(bot, user.id, user.shows);
        }
    }
    public async sendNextEpisodes(bot: Telegraf<CustomContext>, chat_id: number, shows: ShowInterface[]) {
        let message = '';
        let media_group = [];
        let i = 0;
        for (const show of shows) {
            logger.debug('show:');
            logger.debug(show);

            // telegram crashing when sends some images with valid url. If this happens, we send the 
            // show without image, but first we have to test sending shows by separate to test group 
            // and get the telegram photo id
            if (!show.poster_id) {
                try {
                    const test_sender = await bot.telegram.sendPhoto(config.telegram.test_group_id, `https://image.tmdb.org/t/p/w500${show.poster_url}`);
                    show.poster_id = test_sender?.photo[test_sender.photo.length - 1]?.file_id;
                    if (show.poster_id) {
                        await showService.updatePosterId(show.id, show.poster_id);
                    }
                } catch (error) {
                    error.message += `\n\tPhoto url: https://image.tmdb.org/t/p/w500${show.poster_url}`;
                    logger.error(error);
                }
            }

            message += `<b>${show.name}</b> ${show.episode}\n${DateTime.fromJSDate(show.date).toFormat('dd/MM/yyyy')} (${show.service})`;
            if (!show.poster_id) {
                message += '\n[🤷‍♂ sin póster]\n\n';
                continue;
            }
            message += '\n\n';
            media_group.push({

                type: 'photo',
                media: show.poster_id
            });
            if (++i > 8) {
                await this.sendPhoto(bot, chat_id, media_group, message);
                i = 0;
                message = '';
                media_group = [];
            }
        }
        if (media_group.length) {
            await this.sendPhoto(bot, chat_id, media_group, message);
            message = '';
        }
        if (message.length) {
            await bot.telegram.sendMessage(chat_id, message, {
                parse_mode: 'HTML',
            });
        }
    }

    private async sendPhoto(bot: Telegraf<CustomContext>, chat_id: number, media_group: any[], message: string) {
        media_group[0].caption = message;
        media_group[0].parse_mode = 'HTML';

        const sended = await bot.telegram.sendMediaGroup(chat_id, media_group, {
            // reply_to_message_id: ctx.message?.message_id,
            // allow_sending_without_reply: true
        });
    }
}
export default new TelegrafService();