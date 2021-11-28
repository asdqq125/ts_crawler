import { BaseAnalyzer, Crawlers,createCrawler } from "../index";


let cc = createCrawler("http://wwww.baidu.com")

class A implements BaseAnalyzer{
    getCourseInfo(data:string,crawler:Crawlers){
        console.log('data :>> ', crawler.url);
    }
}
cc.setAnalyzer(new A())

cc.start()