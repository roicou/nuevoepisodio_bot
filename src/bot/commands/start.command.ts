/**
 * start command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";


export default async (ctx: CustomContext): Promise<void> => {
    try {
        ctx.reply(`¡Hola ${ctx.from.first_name}! Bienvenido al bot de notificación de nuevos episodios.\n\nPara empezar, prueba a enviar el comando /nueva_serie para añadir una nueva serie a la lista.\n\nTambién puedes usar el comando /ajustes para establecer la hora de las notificaciones.`);
    } catch (error) {
        logger.error(error);
    }
}