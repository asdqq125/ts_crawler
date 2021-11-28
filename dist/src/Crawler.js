"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrawler = exports.Crawler = void 0;
const superagent_1 = __importDefault(require("superagent"));
const BaseAnalyzer_1 = __importDefault(require("./BaseAnalyzer"));
const BaseUrlScheduler_1 = __importDefault(require("./BaseUrlScheduler"));
const BasePersistence_1 = __importDefault(require("./BasePersistence"));
const tslog_1 = require("tslog");
const hashmap_1 = __importDefault(require("./DataStructure/hashmap"));
const events_1 = __importDefault(require("events"));
var CrawkerStatus;
(function (CrawkerStatus) {
    CrawkerStatus[CrawkerStatus["STATUS_INIT"] = 0] = "STATUS_INIT";
    CrawkerStatus[CrawkerStatus["STATUS_SUCC"] = 1] = "STATUS_SUCC";
    CrawkerStatus[CrawkerStatus["STATUS_FAIL"] = -1] = "STATUS_FAIL";
    CrawkerStatus[CrawkerStatus["STATUS_CRAWL_SUCC"] = 2] = "STATUS_CRAWL_SUCC";
    CrawkerStatus[CrawkerStatus["STATUS_CRAWL_FAIL"] = -2] = "STATUS_CRAWL_FAIL";
    CrawkerStatus[CrawkerStatus["STATUS_ANALYSIS_SUCC"] = 3] = "STATUS_ANALYSIS_SUCC";
    CrawkerStatus[CrawkerStatus["STATUS_ANALYSIS_FAIL"] = -3] = "STATUS_ANALYSIS_FAIL";
    CrawkerStatus[CrawkerStatus["STATUS_PERSIST_SUCC"] = 4] = "STATUS_PERSIST_SUCC";
    CrawkerStatus[CrawkerStatus["STATUS_PERSIST_FAIL"] = -4] = "STATUS_PERSIST_FAIL";
})(CrawkerStatus || (CrawkerStatus = {}));
class Crawler {
    /**
     * Creates an instance of Crawler.
     * @param {string} [url]
     * @memberof Crawler
     */
    constructor(url) {
        this.logger = new tslog_1.Logger({
            dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        this.logger.info(`初始化爬虫`);
        this.crawler = {
            url: "",
            rawHtml: "",
            requestTime: 500,
            additionNumber: 0,
            currentTask: 0,
            finishWork: 0,
            errorWork: 0,
            status: CrawkerStatus.STATUS_INIT,
            hashStorage: new hashmap_1.default(),
        };
        this.crawlerEvent = new events_1.default.EventEmitter();
        this.works = [];
        this.analyzer = BaseAnalyzer_1.default.getInstance();
        this.urlScheduler = BaseUrlScheduler_1.default.getInstance();
        this.persistence = BasePersistence_1.default.getInstance();
        if (url != undefined)
            this.urlScheduler.enqueue(url);
    }
    /**
     *设置延迟时间
     *
     * @param {number} ms
     * @memberof Crawler
     */
    setRequestTime(ms) {
        this.crawler.requestTime = ms;
    }
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
    setScheduler(scheduler) {
        this.logger.info(`初始化url调度器`);
        this.urlScheduler = scheduler;
    }
    /**
     *设置内容分析器
     *必须实现接口BaseAnalyzer里方法
     *Ts:getCourseInfo:(html: string, crawler: Crawlers)=> void;
     *Js:getCourseInfo:(html,crawler)=> void;
     * @param {BaseAnalyzer} analyzer
     * @memberof Crawler
     */
    setAnalyzer(analyzer) {
        this.logger.info(`初始化内容分析器`);
        this.analyzer = analyzer;
    }
    /**
     *设置下载器
     *必须实现接口BasePersistence里方法
     *Ts:dataOpi:(hashStorage: HashMap<Object>,crawler: Crawlers)=> void;
     *Js:dataOpi:(hashStorage,crawler)=> void;
     * @param {BasePersistence} persistence
     * @memberof Crawler
     */
    setPersistence(persistence) {
        this.logger.info(`初始化下载器`);
        this.persistence = persistence;
    }
    /**
     *url任务队列
     *
     * @param {...string[]} args
     * @memberof Crawler
     */
    enqueue(...args) {
        args.forEach((item) => {
            this.urlScheduler.enqueue(item);
        });
        this.crawler.additionNumber =
            this.crawler.additionNumber + this.urlScheduler.size();
    }
    /**
     *启动爬虫
     *
     * @memberof Crawler
     */
    async start() {
        this._Events();
        this.setAttion();
    }
    /**
     *获取爬虫状态
     *
     * @returns {*}
     * @memberof Crawler
     */
    getStatus() {
        return this.crawler.status;
    }
    /**
     *爬虫对象初始化
     *
     * @private
     * @memberof Crawler
     */
    _crawlerInit() {
        this.crawler.url = "";
        this.crawler.rawHtml = "";
        this.crawler.requestTime = 50;
        this.crawler.additionNumber = 0;
        this.crawler.currentTask = 0;
        this.crawler.finishWork = 0;
        this.crawler.errorWork = 0;
        this.crawler.hashStorage.removeAll();
    }
    /**
     *睡眠函数
     *
     * @private
     * @param {number} ms
     * @returns {*}
     * @memberof Crawler
     */
    _sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     *事件注册
     *
     * @private
     * @memberof Crawler
     */
    _Events() {
        this.crawlerEvent.on("startActivity", async (data) => {
            this.logger.info(`工作开始，总任务数：${this.crawler.additionNumber}`);
            await this._getRawHtmlTextV2();
        });
        this.crawlerEvent.on("finishActivity", async (data) => {
            this.logger.info(`完成任务：${this.crawler.finishWork},失败任务：${this.crawler.errorWork},当前爬虫状态：${this.crawler.status}`);
            this._crawlerInit();
        });
        this.crawlerEvent.on("getData", (data) => {
            try {
                this._analysis(data, this.crawler);
                if (!this.crawler.hashStorage.isEmpty())
                    this.crawlerEvent.emit("analysis", this.crawler.hashStorage);
            }
            catch (e) {
                this.crawlerEvent.emit("error", e);
            }
        });
        this.crawlerEvent.on("analysis", (data) => {
            try {
                this._persistence(data, this.crawler);
            }
            catch (e) {
                this.crawlerEvent.emit("error", e);
            }
        });
        this.crawlerEvent.on("error", (err) => {
            this.logger.error(err);
            this.crawler.errorWork++;
            this.crawler.status = CrawkerStatus.STATUS_FAIL;
        });
    }
    setAttion() {
        if (!this.urlScheduler.isEmpty()) {
            let mun = this.urlScheduler.size();
            for (let i = 0; i < mun; i++) {
                this.works.push(superagent_1.default.get(this.urlScheduler.dequeue()));
            }
            this.crawlerEvent.emit("startActivity");
        }
    }
    _setErrorAttion(data) {
        let worklist = [];
        for (let item in data) {
            worklist.push(superagent_1.default.get(data[item]));
        }
        return worklist;
    }
    async _getRawHtmlTextV2() {
        while (this.works.length > 0) {
            let worrk = [];
            for (let item in this.works) {
                try {
                    let data = await this.works[item];
                    if (data.status === 200) {
                        this.crawler.finishWork++;
                        this.logger.info(`完成第${this.crawler.finishWork}个网页爬取`);
                        this.crawler.url = this.works[item].url;
                        this.crawlerEvent.emit("getData", data.text);
                    }
                    else {
                        let str = `地址：${this.works[item].url}：请求失败,请求状态码：${this.works[item].status}`;
                        this.crawlerEvent.emit("error", str);
                    }
                    await this._sleep(this.crawler.requestTime);
                }
                catch (e) {
                    worrk.push(this.works[item].url);
                }
            }
            this.works = [];
            this.works = this._setErrorAttion(worrk);
        }
        if (this.crawler.status != CrawkerStatus.STATUS_FAIL)
            this.crawler.status = CrawkerStatus.STATUS_SUCC;
        this.crawlerEvent.emit("finishActivity");
    }
    /**
     *解析执行
     *
     * @private
     * @memberof Crawler
     */
    _analysis(data, crawler) {
        try {
            let AnalyzerStart = new Date().getTime();
            this.analyzer.getCourseInfo(data, crawler);
            this.logger.info(`页面解析耗时：${new Date().getTime() - AnalyzerStart}ms`);
            this.crawler.status = CrawkerStatus.STATUS_ANALYSIS_SUCC;
        }
        catch (e) {
            this.crawlerEvent.emit("error", `当前任务数：${this.crawler.currentTask},发生错误，${e}`);
            this.crawler.status = CrawkerStatus.STATUS_ANALYSIS_FAIL;
        }
    }
    /**
     *数据持久化
     *
     * @private
     * @memberof Crawler
     */
    _persistence(Storage, crawler) {
        try {
            let PersistenceStart = new Date().getTime();
            this.persistence.dataOpi(Storage, crawler);
            this.logger.info(`数据保存耗时：${new Date().getTime() - PersistenceStart}ms`);
            this.crawler.status = CrawkerStatus.STATUS_PERSIST_SUCC;
        }
        catch (e) {
            this.crawlerEvent.emit("error", `当前任务数：${this.crawler.currentTask},发生错误，${e}`);
            this.crawler.status = CrawkerStatus.STATUS_PERSIST_FAIL;
        }
    }
}
exports.Crawler = Crawler;
/**
 *工厂方法
 *
 * @export
 * @param {string} [url]
 * @returns {*}  {Crawler}
 */
function createCrawler(url) {
    if (url === null || url === undefined)
        return new Crawler();
    else
        return new Crawler(url);
}
exports.createCrawler = createCrawler;
