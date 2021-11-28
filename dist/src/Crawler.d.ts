import { BaseAnalyzer, BasePersistence, BaseUrlScheduler } from "./type";
export declare class Crawler {
    private crawler;
    private urlScheduler;
    private analyzer;
    private persistence;
    private logger;
    private works;
    private crawlerEvent;
    /**
     * Creates an instance of Crawler.
     * @param {string} [url]
     * @memberof Crawler
     */
    constructor(url?: string);
    /**
     *设置延迟时间
     *
     * @param {number} ms
     * @memberof Crawler
     */
    setRequestTime(ms: number): void;
    /**
     *设置url调度器
     *必须实现接口BaseUrlScheduler里方法
     *enqueue:(...url: string[])=>void;
     *size:()=> number;
     *dequeue:()=> any;
     *isEmpty:()=> boolean;
     * @param {BaseUrlScheduler} scheduler
     * @memberof Crawler
     */
    setScheduler(scheduler: BaseUrlScheduler): void;
    /**
     *设置内容分析器
     *必须实现接口BaseAnalyzer里方法
     *Ts:getCourseInfo:(html: string, crawler: Crawlers)=> void;
     *Js:getCourseInfo:(html,crawler)=> void;
     * @param {BaseAnalyzer} analyzer
     * @memberof Crawler
     */
    setAnalyzer(analyzer: BaseAnalyzer): void;
    /**
     *设置下载器
     *必须实现接口BasePersistence里方法
     *Ts:dataOpi:(hashStorage: HashMap<Object>,crawler: Crawlers)=> void;
     *Js:dataOpi:(hashStorage,crawler)=> void;
     * @param {BasePersistence} persistence
     * @memberof Crawler
     */
    setPersistence(persistence: BasePersistence): void;
    /**
     *url任务队列
     *
     * @param {...string[]} args
     * @memberof Crawler
     */
    enqueue(...args: string[]): void;
    /**
     *启动爬虫
     *
     * @memberof Crawler
     */
    start(): Promise<void>;
    /**
     *获取爬虫状态
     *
     * @returns {*}
     * @memberof Crawler
     */
    getStatus(): number;
    /**
     *爬虫对象初始化
     *
     * @private
     * @memberof Crawler
     */
    private _crawlerInit;
    /**
     *睡眠函数
     *
     * @private
     * @param {number} ms
     * @returns {*}
     * @memberof Crawler
     */
    private _sleep;
    /**
     *事件注册
     *
     * @private
     * @memberof Crawler
     */
    private _Events;
    private setAttion;
    private _setErrorAttion;
    private _getRawHtmlTextV2;
    /**
     *解析执行
     *
     * @private
     * @memberof Crawler
     */
    private _analysis;
    /**
     *数据持久化
     *
     * @private
     * @memberof Crawler
     */
    private _persistence;
}
/**
 *工厂方法
 *
 * @export
 * @param {string} [url]
 * @returns {*}  {Crawler}
 */
export declare function createCrawler(url?: string): Crawler;
