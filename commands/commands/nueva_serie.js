/**
 * comando /nueva_serie
 * @author Roi C.
 */
"use strict";
const moment = require('moment');

const config = require('../../config.json');
const tmdb = require('../../libs/tmdb');
const userService = require('../../services/user.service');

/**
 * función principal del comando
 * @param {*} ctx 
 * @param {*} bot 
 */
async function newShow(ctx, bot) {
    ctx.reply('Escribe el nombre de la serie que quieres añadir', {
        reply_markup: {
            force_reply: true
        }
    });
}
exports.newShow = newShow;

/**
 * callback de la respuesta a la pregunta de nombre de serie
 * @param {*} text 
 * @param {*} ctx 
 * @returns 
 */
async function reply(text, ctx) {
    const shows = await tmdb.findShows(text);
    if (shows?.total_results) {
        let buttons = [];
        for (let show of shows.results) {
            buttons.push([{ text: show.name + ((show.first_air_date) ? " (" + moment(show.first_air_date).format("YYYY") + ")" : ""), callback_data: "nueva_serie\\" + show.id }]);
        }
        await ctx.reply("Selecciona la serie:\n ", {
            reply_markup: {
                inline_keyboard: buttons
            }
        });
    } else {
        return ctx.reply("No he encontrado esa serie");
    }
}
exports.reply = reply;

/**
 * callback de los botones
 * @param {*} show 
 * @param {*} ctx 
 * @returns 
 */
async function callback(show, ctx) {
    if (ctx.user.shows.includes(show)) {
        return ctx.reply('Ya tienes esta serie en tu lista de series');
    }
    await userService.addShow(ctx.user, show);
    return ctx.reply("Serie añadida correctamente");
}
exports.callback = callback;
