/**
 * Prepara los próximos estrenos de las series
 * @author Roi C.
 */
"use strict";
const moment = require('moment');

const tmdb = require('./tmdb');

/**
 * recibe el id de una serie y la lista de series en forma de objeto y rellena el objeto con los datos de la serie (si no está ya)
 * @param {number} show id de la serie
 * @param {object} shows lista de series en forma de objeto
 * @returns 
 */
async function getEpisodes(show, shows) {
    if (!shows[show]) {
        let show_info = await tmdb.getShowById(show);
        shows[show] = {
            name: show_info.name,
            next_episode: show_info.next_episode_to_air?.air_date || null,
            episode: null,
            poster: null,
            networks: []
        };
        if (shows[show].next_episode) {
            shows[show].episode = show_info.next_episode_to_air.season_number + "x" + ('0' + show_info.next_episode_to_air.episode_number).slice(-2);
            shows[show].poster = show_info.seasons.find((s) => s.season_number === show_info.next_episode_to_air.season_number).poster_path;
            if (!shows[show].poster) {
                shows[show].poster = show_info.poster_path;
            }
        }
        for (let network of show_info.networks) {
            shows[show].networks.push(network.name);
        }
    }
    return shows;
}
exports.getEpisodes = getEpisodes;

/**
 * envía los episodios que van a salir a un usuario
 * @param {*} bot instancia del bot
 * @param {object} user objeto del usuario
 * @param {boolean} cron indica si es de cron o no
 */
async function sendEpisodes(bot, user, cron = false) {
    if (user.next_episodes.length) {
        let inputmediaphotos = [];
        let caption = [];
        let without_poster = [];
        for (let show of user.next_episodes) {
            let text = "*" + show.name + "* (" + show.episode + ")\n📺 " + show.networks.join(", ") + "\n📆 " + moment(show.next_episode, "YYYY-MM-DD").format("DD/MM/YYYY");
            if (show.poster) {
                inputmediaphotos.push({
                    type: 'photo',
                    media: "https://image.tmdb.org/t/p/original" + show.poster
                });
                caption.push(text);
            } else {
                without_poster.push(text);
            }
        }
        if (cron) {
            await bot.telegram.sendMessage(user.id, "Próximos estrenos para mañana:");
        }
        if (inputmediaphotos.length) {
            while (inputmediaphotos.length) {
                let inputmediaphotos_to_send = [];
                let caption_to_send = [];
                let limit = inputmediaphotos.length > 10 ? 10 : inputmediaphotos.length;
                for (let i = 0; i < limit; ijss++) {
                    inputmediaphotos_to_send.push(inputmediaphotos.shift());
                    caption_to_send.push(caption.shift());
                }
                // parse_mode: "Markdown"
                inputmediaphotos_to_send[0].caption = caption_to_send.join("\n\n");
                inputmediaphotos_to_send[0].parse_mode = "markdown";
                await bot.telegram.sendMediaGroup(user.id, inputmediaphotos_to_send);


                // await bot.telegram.sendMediaGroup(user.id, inputmediaphotos_to_send);
            }
        }
        if (without_poster.length) {
            while (without_poster.length) {
                let caption_to_send = [];
                let limit = without_poster.length > 10 ? 10 : without_poster.length;
                for (let i = 0; i < limit; i++) {
                    caption_to_send.push(without_poster.shift());
                }
                await bot.telegram.sendMessage(user.id, caption_to_send.join("\n\n"), {parse_mode: "markdown"});
            }
            // await bot.telegram.sendMessage(user.id, caption);
        }
        // // promises.push(bot.telegram.sendMessage(user.id, "Nuevos episodios se estrenan mañana"));
        // for (let show of user.next_episodes) {
        //     let promise = Promise.resolve();
        //     if (show.poster) {
        //         promise = bot.telegram.sendPhoto(user.id, "https://image.tmdb.org/t/p/original" + show.poster, {
        //             caption: show.name + " (" + show.episode + ")\n📺 " + show.networks.join(", ") + "\n📆 " + moment(show.next_episode, "YYYY-MM-DD").format("DD/MM/YYYY")
        //         });
        //         promises.push(promise);

        //     } else {
        //         promise = bot.telegram.sendMessage(user.id, show.name + " (" + show.episode + ")\n" + show.networks.join(", ") + "\n" + moment(show.next_episode, "YYYY-MM-DD").format("DD/MM/YYYY"));
        //         promises.push(promise);
        //     }
        //     if(sync) {
        //         await promise;
        //     }
        // }
    }
}
exports.sendEpisodes = sendEpisodes;

