/**
 * Servicios de usuario
 * @author Roi C.
 */
"use strict";
const userDb = require("../db/user.db");

/**
 * encuentra un usuario por su id de telegram
 * @param {number} id el ID de Telegram
 * @returns 
 */
async function getUser(id) {
    const user = await userDb.getUser({ id: id });
    return user;
}
exports.getUser = getUser;

/**
 * devuelve los uasuarios activos
 * @returns 
 */
async function getUsersActives() {
    // return await userDb.getUser({id: 1107928, "config.active": true}, {}, false);
    return await userDb.getUser({"config.active": true}, {}, false);
}
exports.getUsersActives = getUsersActives;

/**
 * crea un usuario nuevo
 * @param {{
 *      id: number,
 *      first_name: string,
 *      last_name: string,
 *      username: string | null,
 *      language_code: string,
 *      is_bot: boolean
 * }} user 
 */
async function createUser(user) {
    let new_user = {
        id: user.id,
        shows: [],
        config: {
            active: true,
            language: user.language_code
        }
    };
    await userDb.createUser(new_user);
}
exports.createUser = createUser;

/**
 * añade una serie a un usuario
 * @param {object} user objeto usuario
 * @param {number} show id de la serie en TMDB
 */
async function addShow(user, show) {
    userDb.updateUser(user._id, { $push: { shows: show } });
}
exports.addShow = addShow;

/**
 * retira una serie de un usuario
 * @param {object} user 
 * @param {number} show id de la serie en TMDB
 */
async function deleteShow(user, show) {
    userDb.updateUser(user._id, { $pull: { shows: show } });
}
exports.deleteShow = deleteShow;

/**
 * detiene las notificaciones en un usuario
 * @param {object} user 
 */
async function stopUser(user) {
    userDb.updateUser(user._id, { $set: { "config.active": false } });
}
exports.stopUser = stopUser;

/**
 * activa las notificaciones de un usuario
 * @param {object} user 
 */
async function activateUser(user) {
    userDb.updateUser(user._id, { $set: { "config.active": true } });
}
exports.activateUser = activateUser;