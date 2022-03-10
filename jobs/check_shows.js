/**
 * busca episodios nuevos
 * @author Roi C.
 */
"use strict";
const moment = require('moment');
const userService = require('../services/user.service');
const prepareShows = require('../libs/prepare_shows');

/**
 * Busca los episodios que se estrenan mañana y los envía al usuario
 * @param {*} bot instancia del bot
 */
module.exports = async (bot) => {
    const users = await userService.getUsersActives();
    let shows = {};
    for (let user of users) {
        user.next_episodes = [];
        for (let show of user.shows) {
            shows = await prepareShows.getEpisodes(show, shows);
            if (shows[show].next_episode) {
                if (moment(shows[show].next_episode, "YYYY-MM-DD").isSame(moment().add(1, 'day'), 'day')) { // mañana
                    // if (moment(shows[show].next_episode, "YYYY-MM-DD").isSame(moment().add(2, 'day'), 'day')) { // hoy
                    user.next_episodes.push(shows[show]);
                }
            }
        }
        await prepareShows.sendEpisodes(bot, user, true);
    }
    // for (let i in shows) {
    //     if(shows[i].next_episode) {
    //         let text = ;
    //     }
    // }
    // bot.sendChatAction(bot.chatId, 'typing');
};