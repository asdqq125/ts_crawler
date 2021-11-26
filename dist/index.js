"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashMap = exports.createCrawler = exports.Crawler = void 0;
const Crawler_1 = require("./src/Crawler");
Object.defineProperty(exports, "Crawler", { enumerable: true, get: function () { return Crawler_1.Crawler; } });
Object.defineProperty(exports, "createCrawler", { enumerable: true, get: function () { return Crawler_1.createCrawler; } });
const hashmap_1 = __importDefault(require("./src/DataStructure/hashmap"));
exports.HashMap = hashmap_1.default;
