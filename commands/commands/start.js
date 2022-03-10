/**
 * comando /start
 * @author Roi C.
 */
"use strict";
const userService = require('../../services/user.service');

module.exports = async (ctx) => {
    const from = ctx.update.message.from;
    const user = await userService.getUser(from.id);
    if(user) {
        ctx.reply('¡Hola ' + from.first_name + "! Las notificaciones están activadas");
        await userService.activateUser(user);
    } else {
        await userService.createUser(from);
        ctx.reply('¡Hola ' + from.first_name + '! Bienvenido al bot de notificación de nuevos episodios.\n\nPara empezar, prueba a enviar el comando /nueva_serie para añadir una nueva serie a la lista.');
        // ctx.reply("Bot en desarrollo. No se admiten nuevos usuarios por el momento.");
    }
};