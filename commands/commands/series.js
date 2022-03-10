/**
 * commando /series
 * @author Roi C.
 */
"use strict";
const moment = require('moment');

const userService = require('../../services/user.service');
const tmdb = require('../../libs/tmdb');

module.exports = async (ctx) => {
    const user = ctx.user;
    if(!user.shows.length) {
        return ctx.reply("No tienes ninguna serie en tu lista");
    }
    let message = "Lista de series: \n\n";
    for(let show of user.shows) {
        let {name, first_air_date} = await tmdb.getShowById(show);
        message += name + " (" + moment(first_air_date, "YYYY-MM-DD").format("YYYY") + ")\n";
    }
    return ctx.reply(message);
};