/**
 * shows command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import CustomContext from "@/interfaces/customcontext.interface";
import ShowInterface from "@/interfaces/show.interface";
import logger from "@/libs/logger";
import showService from "@/services/show.service";
import { Message } from "telegraf/typings/core/types/typegram";

export default async (ctx: CustomContext): Promise<Message.TextMessage> => {
    try {
        const shows: ShowInterface[] = await showService.getShows(ctx.user.shows);
        if (!shows.length) {
            return ctx.reply('No tienes series en tu lista');
        }
        let message: string = '<strong><u>Lista de series</u></strong>:\n\n';
        let i = 0;
        for (const show of shows) {
            message += `- ${show.name}\n`;
            if (++i > 20) {
                await ctx.replyWithHTML(message, {
                    // reply_to_message_id: ctx.message?.message_id,
                });
                message = '';
                i = 0;
            }
        }
        return ctx.replyWithHTML(message, {
            // reply_to_message_id: ctx.message?.message_id,
        });
    } catch (error) {
        logger.error(error);
    }
}