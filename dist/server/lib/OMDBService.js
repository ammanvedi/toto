"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var OMDBCache = {};
var objectKeysToLowerCase = function (obj) {
    return Object.keys(obj).reduce(function (newObj, key) {
        newObj[key.toLowerCase()] = obj[key];
        return newObj;
    }, {});
};
exports.getOMDBDataForShow = function (showId) {
    if (OMDBCache[showId]) {
        return Promise.resolve(OMDBCache[showId]);
    }
    return new Promise(function (resolve, reject) {
        request_1.default("http://www.omdbapi.com/?i=" + showId + "&apikey=" + process.env.OMDB_API_KEY, function (error, response, body) {
            if (error) {
                return reject();
            }
            try {
                var jsonResponse = JSON.parse(body);
                var meta = objectKeysToLowerCase(jsonResponse);
                OMDBCache[showId] = meta;
                resolve(meta);
            }
            catch (_a) {
                reject();
            }
        });
    });
};
