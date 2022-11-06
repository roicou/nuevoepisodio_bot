import config from "@/config";
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";
import showService from "@/services/show.service";

export default async (ctx: CustomContext) => {
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