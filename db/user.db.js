/**
 * Base de datos de usuarios
 * @author Roi C.
 */
"use strict";
const { ObjectId } = require("bson");

const mongodb = require("../libs/mongodb");

/**
 * devuelve uno o varios usuarios de la bbdd
 * @param {object} query mongodb query
 * @param {object} projection mongodb projection
 * @param {boolean} limit true para 1 | false para varios
 * @returns 
 */
async function getUser(query, projection = {}, limit = true) {
    return mongodb.Find("users", query, projection, {}, limit);
}
exports.getUser = getUser;

/**
 * guarda un usuario en la bbdd
 * @param {object} user objeto usuario
 */
async function createUser(user) {
    await mongodb.InsertOne("users", user);
}
exports.createUser = createUser;

/**
 * actualiza un usuario en la bbdd
 * @param {ObjectID} _id 
 * @param {object} update mongodb update object
 */
async function updateUser(_id, update) {
    let query = {
        _id: ObjectId(_id)
    };
    await mongodb.UpdateOne("users", query, update);
}
exports.updateUser = updateUser;