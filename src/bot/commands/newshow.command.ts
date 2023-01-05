/**
 * newshow command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";

export default async (ctx: CustomContext): Promise<void> => {
    try {
        ctx.reply("Escribe el nombre de la serie", {
            reply_markup: {
                force_reply: true
            }
        });
    } catch (error) {
        logger.error(error);
    }
}