/**
 * settings command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import config from "@/config";
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";


export default async (ctx: CustomContext): Promise<void> => {
    try {
        const clocks = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"];
        // create buttons with hours. 4 at row
        const buttons = [];
        for (let i = 0; i < 24; i++) {
            buttons.push({
                text: `${clocks[i]} ${(i < 10) ? "0" + i : i}:00`,
                callback_data: `settings:${i}`
            });
        }
        const keyboard = [];
        while (buttons.length) {
            keyboard.push(buttons.splice(0, 3));
        }
        // keyboard.push("🛑 Detener notificaciones");
        // send message with buttons
        await ctx.reply("Selecciona la hora de la notificación:", {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

    } catch (error) {
        logger.error(error);
    }
}