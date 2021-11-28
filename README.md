# 注意          
这个包是边学习边写做出来的小功能，建议使用typescript
# 如何使用
### 创建一个crawler

```
import { BaseAnalyzer, BasePersistence, Crawler, Crawlers, HashMap } from "cyc_spider"; 

let crawler = new Crawler("http://www.baidu.com");

class A implements BaseAnalyzer{
    getCourseInfo= (html: string, crawler: Crawlers) => {
        console.log("实现内容分析器！");
        crawler.hashStorage.put("数据1",1)
    };
}

class P implements BasePersistence{
    dataOpi=(hashStorage: HashMap<Object>, crawler: Crawlers) => {
        console.log("实现数据操作");
        hashStorage.getKey().forEach((item:any)=>{
            console.log('data:',hashStorage.get(item));
        })
    };
}

crawler.setAnalyzer(new A())

crawler.setPersistence(new P())

crawler.start()
```

# API
### 设置延迟时间
>crawler.setRequestTime(1000) //延迟1000毫秒
### 多个url请求
>crawler.enqueue(...url) //url为字符串数组
### 启动
>crawler.start() 
### 设置内容分析器
>crawler.setAnalyzer() //实例必须要实现BaseAnalyzer接口
### 设置数据下载器
>crawler.setPersistence() //实例必须要实现BasePersistence接口
### 设置url调度器
>crawler.setScheduler() //实例必须要实现BaseUrlScheduler接口且要实现去重功能，基础url调度器内置布隆过滤


