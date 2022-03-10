/**
 * Índice de rutas a los comandos
 * @author Roi C.
 */
"use strict";

/**
 * índice con las rutas a los comandos
 */
module.exports = {
    nueva_serie: require('./commands/nueva_serie'),
    borrar_serie: require('./commands/borrar_serie'),
    series: require('./commands/series'),
    start: require('./commands/start'),
    detener: require('./commands/detener'),
    proximos_estrenos: require('./commands/proximos_estrenos')
};