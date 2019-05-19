"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Metadata_1 = require("../../types/Metadata");
var fs_1 = require("fs");
var path_1 = require("path");
var klaw_sync_1 = __importDefault(require("klaw-sync"));
var OMDBService_1 = require("./OMDBService");
var sha1_1 = __importDefault(require("sha1"));
var getAllFilesOfTypeFromDirectory = function (directory, fileTypes) {
    return klaw_sync_1.default(directory, {
        nodir: true,
    })
        .map(function (item) { return item.path; })
        .filter(function (filePath) { return fileTypes.indexOf(path_1.extname(filePath)) > -1; });
};
var getEpisodeNumber = function (fileName) {
    var result = /S([0-9]{2})E([0-9]{2})/.exec(fileName);
    if (result) {
        var seriesNo = parseInt(result[1]);
        var episodeNo = parseInt(result[2]);
        if (typeof seriesNo === 'number' && typeof episodeNo === 'number') {
            return [seriesNo, episodeNo];
        }
        else {
            return false;
        }
    }
    return false;
};
var sortSeries = function (a, b) {
    if (a.episodeNumber == null || b.episodeNumber == null) {
        return 0;
    }
    return a.episodeNumber[1] - b.episodeNumber[1];
};
var organiseEpisodes = function (files, index) {
    var sources = {
        series: [],
        unclassifiedEpisodes: []
    };
    for (var i = 0; i < files.length; i++) {
        var fileName = files[i];
        var episodeNumber = getEpisodeNumber(fileName);
        if (episodeNumber) {
            var series = episodeNumber[0];
            if (!sources.series[series]) {
                sources.series[series] = [];
            }
            sources.series[series].push({
                sourceFileId: exports.createSourceIdAndStoreInIndex(fileName, index),
                episodeNumber: episodeNumber,
            });
        }
        else {
            sources.unclassifiedEpisodes.push({
                sourceFileId: exports.createSourceIdAndStoreInIndex(fileName, index),
            });
        }
    }
    sources.series = sources.series.map(function (singleSeries) { return singleSeries.sort(sortSeries); }).filter(function (singleSeries) { return singleSeries; });
    return sources;
};
exports.createSourceIdAndStoreInIndex = function (filePath, index) {
    var hashed = sha1_1.default(filePath).toString();
    index[hashed] = filePath;
    return hashed;
};
exports.createMediaIndex = function (rootFolders, fileTypes) { return __awaiter(_this, void 0, void 0, function () {
    var mediaIndex, _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mediaIndex = {
                    series: [],
                    movies: [],
                    fileIndex: {}
                };
                _loop_1 = function (i) {
                    var root, directoryContent, childDirectories, j, directory, fullDirectoryPath, metadata, metaPath, fileData, videoFiles, OMDBData, _a, movie, series;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                root = rootFolders[i];
                                console.log('looking into root', root);
                                directoryContent = fs_1.readdirSync(root);
                                childDirectories = directoryContent.filter(function (f) { return fs_1.statSync(path_1.join(root, f)).isDirectory(); });
                                j = 0;
                                _b.label = 1;
                            case 1:
                                if (!(j < childDirectories.length)) return [3 /*break*/, 7];
                                directory = childDirectories[j];
                                fullDirectoryPath = path_1.join(root, directory);
                                console.log('checking sub directory', directory);
                                if (directory === '.' || directory === '..') {
                                    return [3 /*break*/, 6];
                                }
                                metadata = null;
                                metaPath = path_1.join(fullDirectoryPath, 'metadata.json');
                                console.log('fetching metadata', metaPath);
                                try {
                                    fileData = fs_1.readFileSync(metaPath);
                                    metadata = JSON.parse(fileData.toString());
                                    console.log('got metadata for show');
                                }
                                catch (_c) {
                                    // otherwise look at other directories
                                    console.log('could not find meta located at', metaPath);
                                    return [3 /*break*/, 6];
                                }
                                if (!metadata) {
                                    return [3 /*break*/, 6];
                                }
                                videoFiles = getAllFilesOfTypeFromDirectory(fullDirectoryPath, fileTypes);
                                console.log("found " + videoFiles.length + " video files");
                                OMDBData = void 0;
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, 4, , 5]);
                                console.log('trying to fetch OMDB data...');
                                return [4 /*yield*/, OMDBService_1.getOMDBDataForShow(metadata.imdb_id)];
                            case 3:
                                OMDBData = _b.sent();
                                console.log("success fetching OMDB data for show " + OMDBData.title);
                                return [3 /*break*/, 5];
                            case 4:
                                _a = _b.sent();
                                console.log('failed fetching OMDB data, skipping...');
                                return [3 /*break*/, 6];
                            case 5:
                                // now create a media type object based on the type of show we are dealing with
                                switch (metadata.type) {
                                    case Metadata_1.MediaType.MOVIE:
                                        if (videoFiles.length > 1) {
                                            console.log("Movie " + OMDBData.title + " in directory " + directory + " was found to have more than one movie source, taking first source");
                                        }
                                        movie = __assign({}, OMDBData, { type: Metadata_1.MediaType.MOVIE, sourceId: exports.createSourceIdAndStoreInIndex(videoFiles[0], mediaIndex.fileIndex) });
                                        mediaIndex.movies.push(movie);
                                        break;
                                    case Metadata_1.MediaType.SERIES:
                                        series = __assign({}, OMDBData, { type: Metadata_1.MediaType.SERIES, source: organiseEpisodes(videoFiles, mediaIndex.fileIndex) });
                                        mediaIndex.series.push(series);
                                        break;
                                }
                                _b.label = 6;
                            case 6:
                                j++;
                                return [3 /*break*/, 1];
                            case 7: return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < rootFolders.length)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(i)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, mediaIndex];
        }
    });
}); };
