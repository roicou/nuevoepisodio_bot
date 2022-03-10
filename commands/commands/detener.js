/**
 * comando /stop
 * @author Roi C.
 */
"use strict";
const userService = require('../../services/user.service');

/**
 * función principal del comando
 * @param {*} ctx 
 */
async function stop(ctx) {
    const from = ctx.update.message.from;
    // const user = await userService.stopUser(from.id);
    if (ctx.user && ctx.user.config.active) {
        ctx.reply('¡Hola ' + from.first_name + '! ¿Deseas cancelar las notificaciones del bot?', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Sí', callback_data: 'detener\\yes' }, { text: 'No', callback_data: 'detener\\no' }]
                ]
            }
        });
    } else if(!ctx.user.config.active) {
        ctx.reply("No tienes las notifiaciones activadas.");
    }
}
exports.stop = stop;

/**
 * callback de la respuesta a los botones
 * @param {*} data 
 * @param {*} ctx 
 * @returns 
 */
async function callback(data, ctx) {
    if (data === 'yes') {
        await userService.stopUser(ctx.user);
        return ctx.reply("Notificaciones desactivadas. Escribe /start cuando quieras volver a recibirlas");
    }
    if (data === 'no') {
        return ctx.reply("Continuamos con las notificaciones");
    }
}
exports.callback = callback;