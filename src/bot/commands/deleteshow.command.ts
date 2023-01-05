/**
 * deleteshow command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";
import showService from "@/services/show.service";
import { Message } from "telegraf/typings/core/types/typegram";

export default async (ctx: CustomContext): Promise<Message.TextMessage> => {
    try {
        const shows = await showService.getShows(ctx.user.shows);
        if (!shows.length) {
            return ctx.reply('No tienes series en tu lista. Usa /nueva_serie para añadir una.');
        }
        const buttons = [];
        for (const show of shows) {
            buttons.push([{
                text: show.name,
                callback_data: `deleteshow:${show.id}`
            }]);
        }
        return ctx.reply('Selecciona la serie que quieres eliminar:', {
            reply_markup: {
                inline_keyboard: buttons
            }
        });
    } catch (error) {
        logger.error(error);
    }
}