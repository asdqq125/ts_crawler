import { BaseAnalyzer, Crawlers } from "./type";


export default class Analyzer implements BaseAnalyzer {
    static instance: BaseAnalyzer;
    static getInstance(){
        if(!Analyzer.instance){
 
            Analyzer.instance =  new Analyzer();
        }
 
        return Analyzer.instance;
    }
    getCourseInfo(html: string, crawler:Crawlers): void {
        throw new Error("You must implement your own data analyzer based on BaseAnalyzer")
    }
    
}