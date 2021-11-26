"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Analyzer {
    static getInstance() {
        if (!Analyzer.instance) {
            Analyzer.instance = new Analyzer();
        }
        return Analyzer.instance;
    }
    getCourseInfo(html, crawler) {
        throw new Error("You must implement your own data analyzer based on BaseAnalyzer");
    }
}
exports.default = Analyzer;
