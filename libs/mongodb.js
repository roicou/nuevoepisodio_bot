"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var options_1 = require("../config.json");
var DB;
var clientDB;
/**
 * Connects to the database, must be called to do any db operation
 * @param {any} conf
 */
function Connect(conf) {
    if (conf === void 0) { conf = options_1.mongodb; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (DB)
                return [2 /*return*/];
            conf = conf;
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    mongodb_1.MongoClient.connect(conf.uri, conf.options, (function (err, client) {
                        if (err)
                            return reject(err);
                        clientDB = client;
                        DB = client.db(conf.db);
                        return resolve(true);
                    }));
                })];
        });
    });
}
exports.Connect = Connect;
/**
 * Closes the connection to the database
 */
function Close() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!clientDB) {
                        return [2 /*return*/, Promise.reject("Not connected")];
                    }
                    return [4 /*yield*/, clientDB.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.Close = Close;
/**
 * Accesses the collection given
 * @param {string} collectionName The collection to access
 */
function Collection(collectionName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!DB) {
                return [2 /*return*/, Promise.reject("Not connected")];
            }
            return [2 /*return*/, DB.collection(collectionName)];
        });
    });
}
exports.Collection = Collection;
/**
 * Gives result documents for a query
 * @param {string} collectionName The collection to access
 * @param {FilterQuery<any>} query Mongo query, to select the document(s) that you want to find
 * @param {Object} projection Specifies the wanted fields for the query
 * @param {string|object} sort Specifies the order that the data should has
 * @param {boolean|number} limit specifies the number of documents to retrieve, true means 1
 */
function Find(collectionName, query, projection, sort, limit, skip) {
    if (projection === void 0) { projection = {}; }
    if (sort === void 0) { sort = {}; }
    if (limit === void 0) { limit = false; }
    if (skip === void 0) { skip = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var cursor, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, FindCursor(collectionName, query, projection || {}, sort, limit, skip)];
                case 1:
                    cursor = _a.sent();
                    return [4 /*yield*/, cursor.toArray()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, limit === true ? result[0] : result];
            }
        });
    });
}
exports.Find = Find;
/**
 * Gives distinct values for a field
 * @param {string} collectionName The collection to access
 * @param {string} field The field for which to return distinct values.
 * @param {FilterQuery<any>} query Mongo query, to select the document(s) that you want to find
 * @param {Object} options
 */
function Distinct(collectionName, field, query, options) {
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.distinct(field, query, options)];
            }
        });
    });
}
exports.Distinct = Distinct;
/**
 * Creates a cursor for a query that can be used to iterate over results from MongoDB
 * @param {string} collectionName The collection to access
 * @param {FilterQuery<any>} query Mongo query, to select the document(s) that you want to find
 * @param {Object} projection Specifies the wanted fields for the query
 * @param {string|object} sort Specifies the order that the data should has
 * @param {boolean|number} limit specifies the number of documents to retrieve, true means 1
 */
function FindCursor(collectionName, query, projection, sort, limit, skip) {
    if (projection === void 0) { projection = {}; }
    if (sort === void 0) { sort = {}; }
    if (limit === void 0) { limit = false; }
    if (skip === void 0) { skip = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var collection, cursor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    cursor = collection.find(query, { projection: projection });
                    if (projection)
                        cursor.project(projection);
                    if (sort)
                        cursor.sort(sort);
                    if (limit)
                        cursor.limit((limit == true) ? 1 : limit);
                    if (skip)
                        cursor.skip(skip);
                    return [2 /*return*/, cursor];
            }
        });
    });
}
exports.FindCursor = FindCursor;
/**
 * Check if a collection name exists on the database
 * @param {string} collectionName - Collection name to check
 */
function CollectionExist(collectionName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, DB.listCollections({ name: collectionName }).hasNext()];
        });
    });
}
exports.CollectionExist = CollectionExist;
/**
 * Inserts a single document into MongoDB. If document passed in does not contain the _id field,
 * one will be added, mutating the document.
 * @param {string} collectionName The collection to access
 * @param {any} document The object to insert
 * @param {CollectionInsertOneOptions} [options] Options for the insert
 */
function InsertOne(collectionName, document, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!options) {
                        options = {};
                    }
                    return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.insertOne(document, options)];
            }
        });
    });
}
exports.InsertOne = InsertOne;
/**
 * Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field,
 * one will be added to each of the documents missing it, mutating the document.
 * @param {string} collectionName The collection to access
 * @param {any[]} documents The object to insert
 * @param {CollectionInsertManyOptions} [options] Options for the insert
 */
function InsertMany(collectionName, documents, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.insertMany(documents, options)];
            }
        });
    });
}
exports.InsertMany = InsertMany;
/**
 * Deletes a document in a collection
 * @param {string} collectionName The collection to access
 * @param {FilterQuery<any>} query Mongo query, to select the document that you want to delete
 * @param {CommonOptions} [options] Options for the delete
 */
function DeleteOne(collectionName, query, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.deleteOne(query, options || {})];
            }
        });
    });
}
exports.DeleteOne = DeleteOne;
/**
 * Deletes multiple documents in a collection
 * @param {string} collectionName The collection to access
 * @param {FilterQuery<any>} query Mongo query, to select the document that you want to delete
 * @param {CommonOptions} [options] Options for the delete
 */
function DeleteMany(collectionName, query, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.deleteMany(query, options || {})];
            }
        });
    });
}
exports.DeleteMany = DeleteMany;
/**
 *
 * Updates a document in a collection
 * @param {string} collectionName The collection to access
 * @param {FilterQuery<any>} query Mongo query, to select the document that you want to update
 * @param {UpdateQuery<any> | Partial<any>} update Object that specifies what and how it must be updated
 * @param {UpdateOneOptions} [options] Options for the update
 */
function UpdateOne(collectionName, query, update, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.updateOne(query, update, options || {})];
            }
        });
    });
}
exports.UpdateOne = UpdateOne;
/**
 * Updates multiple documents in a collection
 * @param {string} collectionName The collection to access
 * @param {FilterQuery<any>} query Mongo query, to select the documents that you want to update
 * @param {UpdateQuery<any> | Partial<any>} update Specifies what and how it must be updated
 * @param {UpdateManyOptions} [options] Options for the update
 */
function UpdateMany(collectionName, query, update, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.updateMany(query, update, options || {})];
            }
        });
    });
}
exports.UpdateMany = UpdateMany;
/**
 * Returns a count of a collection
 * @param {string} collectionName The collection to access
 * @param {FilterQuery<any>} query Mongo query, to select the document(s) that you want to count
 * @param {boolean|number} limit specifies the number of documents to retrieve, true means 1
 */
function Count(collectionName, query, limit) {
    if (limit === void 0) { limit = false; }
    return __awaiter(this, void 0, void 0, function () {
        var cursor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, FindCursor(collectionName, query, { _id: 1 }, {}, limit)];
                case 1:
                    cursor = _a.sent();
                    return [2 /*return*/, cursor.count()];
            }
        });
    });
}
exports.Count = Count;
/**
 * Returns an aggregation query
 * @param {string} collectionName The collection to access
 * @param {object[]} query_aggregate Mongo aggregate query, to select the document(s) that you want to count
 * @param {CollectionAggregationOptions} [options] Options for the update
 */
function Aggregate(collectionName, query_aggregate, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.aggregate(query_aggregate, options).toArray()];
            }
        });
    });
}
exports.Aggregate = Aggregate;
/**
 * Returns a cursor of aggregation query
 * @param {string} collectionName The collection to access
 * @param {object[]} query_aggregate Mongo aggregate query, to select the document(s) that you want to count
 * @param {CollectionAggregationOptions} [options] Options for the update
 */
function Aggregate_cursor(collectionName, query_aggregate, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.aggregate(query_aggregate, options)];
            }
        });
    });
}
exports.Aggregate_cursor = Aggregate_cursor;
/**
* Create a index on a collection
* @param {string} collectionName The collection to access
* @param {IndexOptions} indexData Data of index to create
*/
function CreateIndex(collectionName, indexData) {
    if (indexData === void 0) { indexData = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.createIndex(indexData)];
            }
        });
    });
}
exports.CreateIndex = CreateIndex;
/**
* Returns the stats of a collection
* @param {string} collectionName The collection to access
*/
function Stats(collectionName) {
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Collection(collectionName)];
                case 1:
                    collection = _a.sent();
                    return [2 /*return*/, collection.stats()];
            }
        });
    });
}
exports.Stats = Stats;