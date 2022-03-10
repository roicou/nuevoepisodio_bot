/**
 * comando /proximos_estrenos
 * @author Roi C.
 */
"use strict";
const moment = require('moment');
const prepareShows = require('../../libs/prepare_shows');

module.exports = async (ctx, bot) => {
    let shows = {};
    ctx.user.next_episodes = [];
    for (let show of ctx.user.shows) {
        shows = await prepareShows.getEpisodes(show, shows);
        if (shows[show].next_episode) {
            ctx.user.next_episodes.push(shows[show]);
        }
    }
    const sorted = ctx.user.next_episodes.sort((a, b) => {
        if (moment(a.next_episode, "YYYY-MM-DD").isBefore(moment(b.next_episode, "YYYY-MM-DD"))) {
            return -1;
        }
        if (moment(a.next_episode, "YYYY-MM-DD").isAfter(moment(b.next_episode, "YYYY-MM-DD"))) {
            return 1;
        }
        return 0;
    });
    ctx.user.next_episodes = sorted;
    await prepareShows.sendEpisodes(bot, ctx.user);
};