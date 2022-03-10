/**
 * comando /borrar_serie
 * @author Roi C.
 */
"use strict";
const moment = require('moment');

const tmdb = require('../../libs/tmdb');
const userService = require('../../services/user.service');

/**
 * función principal del comando
 * @param {*} ctx 
 * @param {*} bot 
 * @returns 
 */
async function deleteShow(ctx, bot) {
    let buttons = [];
    if (!ctx.user.shows.length) {
        return ctx.reply("No tienes ninguna serie en tu lista");
    }
    for (let show of ctx.user.shows) {
        const { name, first_air_date } = await tmdb.getShowById(show);
        buttons.push([{ text: name + " (" + moment(first_air_date, "YYYY-MM-DD").format("YYYY") + ")", callback_data: "borrar_serie\\" + show }]);
    }
    await ctx.reply("¿Qué serie quieres borrar?", {
        reply_markup: {
            inline_keyboard: buttons
        }
    });
}
exports.deleteShow = deleteShow;

/**
 * callback de la respuesta a los botones
 * @param {*} show 
 * @param {*} ctx 
 * @returns 
 */
async function callback(show, ctx) {
    await userService.deleteShow(ctx.user, show);
    return ctx.reply("Serie borrada correctamente");
}
exports.callback = callback;