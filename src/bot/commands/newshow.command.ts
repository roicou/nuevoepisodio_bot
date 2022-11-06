import config from "@/config";
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";

export default async (ctx: CustomContext) => {
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