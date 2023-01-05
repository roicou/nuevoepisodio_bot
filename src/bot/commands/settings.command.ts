/**
 * settings command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";


export default async (ctx: CustomContext): Promise<void> => {
    try {
        ctx.reply('Selecciona el día de la notificación:', {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'El día antes del estreno',
                        callback_data: 'settings:notification:1',
                    },
                    {
                        text: 'El mismo día del estreno',
                        callback_data: 'settings:notification:0',
                    }
                ]]
            }
        });
    } catch (error) {
        logger.error(error);
    }
}