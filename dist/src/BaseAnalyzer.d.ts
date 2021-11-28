import { BaseAnalyzer, Crawlers } from "./type";
export default class Analyzer implements BaseAnalyzer {
    static instance: BaseAnalyzer;
    static getInstance(): BaseAnalyzer;
    getCourseInfo(html: string, crawler: Crawlers): void;
}
