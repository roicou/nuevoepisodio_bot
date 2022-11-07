/**
 * nextepisodes command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import config from "@/config";
import CustomContext from "@/interfaces/customcontext.interface";
import ShowInterface from "@/interfaces/show.interface";
import logger from "@/libs/logger";
import showService from "@/services/show.service";
import telegrafService from "@/services/telegraf.service";
import { Telegraf } from "telegraf";

export default async (ctx: CustomContext, bot: Telegraf<CustomContext>) => {
    try {
        const shows: ShowInterface[] = await showService.getNextEpisodes(ctx.user.shows);
        if (!shows.length) {
            return ctx.reply('No hay nuevos estrenos a la vista');
        }
        await ctx.reply('Próximos estrenos:');
        await telegrafService.sendNextEpisodes(bot, ctx.from.id, shows);
    } catch (error) {
        logger.error(error);
    }
}
