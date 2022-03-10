/**
 * Peticiones a TMDb
 * @author Roi C.
 */
"use strict";
const axios = require('axios');

const config = require('../config.json');

/**
 * busca una serie en TMDB
 * @param {string} name nombre de la serie
 * @returns 
 */
async function findShows(name) {
    name = removeAccents(name);
    const url = config.tmdb.url + "/search/tv?api_key=" + config.tmdb.api + "&language=es-ES&page=1&query=" + name;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(new Date(), "Error haciendo la petición \"" + name + "\":", err);
    }
}
exports.findShows = findShows;

/**
 * busca una serie en TMDB por su id
 * @param {number} id id de la serie en TMDB
 * @returns 
 */
async function getShowById(id) {
    const url = config.tmdb.url + "/tv/" + id + "?api_key=" + config.tmdb.api + "&language=es-ES";
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(new Date(), "Error haciendo la petición\"" + id + "\":", err);
    }
}
exports.getShowById = getShowById;

/**
 * retira las tildes y las ñ de una string y los sustituye por su equivalente sin tildes y ñ
 * @param {string} str 
 * @returns 
 */
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 