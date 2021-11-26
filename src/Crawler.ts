import superagent from "superagent";
import Analyzer from "./BaseAnalyzer";
import UrlScheduler from "./BaseUrlScheduler";
import Persistence from "./BasePersistence";
import { Logger } from "tslog";
import HashMap from "./DataStructure/hashmap";
import {
  BaseAnalyzer,
  Crawlers,
  BasePersistence,
  BaseUrlScheduler,
} from "./type";
import events from "events";

enum CrawkerStatus {
  STATUS_INIT = 0,
  STATUS_SUCC = 1,
  STATUS_FAIL = -1,
  STATUS_CRAWL_SUCC = 2,
  STATUS_CRAWL_FAIL = -2,
  STATUS_ANALYSIS_SUCC = 3,
  STATUS_ANALYSIS_FAIL = -3,
  STATUS_PERSIST_SUCC = 4,
  STATUS_PERSIST_FAIL = -4,
}

export class Crawler {
  private crawler: Crawlers;
  private urlScheduler: BaseUrlScheduler;
  private analyzer: BaseAnalyzer;
  private persistence: BasePersistence;
  private logger: Logger;
  private works: any[];
  private crawlerEvent: events;

  /**
   * Creates an instance of Crawler.
   * @param {string} [url]
   * @memberof Crawler
   */
  constructor(url?: string) {
    this.logger = new Logger({
      dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
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
      hashStorage: new HashMap(),
    };
    this.crawlerEvent = new events.EventEmitter();
    this.works = [];
    this.analyzer = Analyzer.getInstance();
    this.urlScheduler = UrlScheduler.getInstance();
    this.persistence = Persistence.getInstance();
    if (url != undefined) this.urlScheduler.enqueue(url);
  }

  /**
   *设置延迟时间
   *
   * @param {number} ms
   * @memberof Crawler
   */
  setRequestTime(ms: number): void {
    this.crawler.requestTime = ms;
  }

  /**
   *设置url调度器
   *
   * @param {BaseUrlScheduler} scheduler
   * @memberof Crawler
   */
  setScheduler(scheduler: BaseUrlScheduler): void {
    this.logger.info(`初始化url调度器`);
    this.urlScheduler = scheduler;
  }

  /**
   *设置内容分析器
   *
   * @param {BaseAnalyzer} analyzer
   * @memberof Crawler
   */
  setAnalyzer(analyzer: BaseAnalyzer): void {
    this.logger.info(`初始化内容分析器`);
    this.analyzer = analyzer;
  }

  /**
   *设置下载器
   *
   * @param {BasePersistence} persistence
   * @memberof Crawler
   */
  setPersistence(persistence: BasePersistence): void {
    this.logger.info(`初始化下载器`);
    this.persistence = persistence;
  }

  /**
   *url任务队列
   *
   * @param {...string[]} args
   * @memberof Crawler
   */
  enqueue(...args: string[]): void {
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
  async start(): Promise<void> {
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
  private _crawlerInit(): void {
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
  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   *事件注册
   *
   * @private
   * @memberof Crawler
   */
  private _Events() {
    this.crawlerEvent.on('startActivity',async (data: any)=>{
      this.logger.info(`工作开始，总任务数：${this.crawler.additionNumber}`);
      await this._getRawHtmlTextV2();
    })
    this.crawlerEvent.on('finishActivity',async (data: any)=>{
      this.logger.info(
        `完成任务：${this.crawler.finishWork},失败任务：${
          this.crawler.errorWork
        },当前爬虫状态：${this.crawler.status}`
      );
      this._crawlerInit();
    })
    this.crawlerEvent.on("getData", (data: any) => {
      try {
        this._analysis(data, this.crawler);
        this.crawlerEvent.emit("analysis", this.crawler.hashStorage);
      } catch (e) {
        this.crawlerEvent.emit("error", e);
      }
    });
    this.crawlerEvent.on("analysis", (data: any) => {
      try {
        this._persistence(data, this.crawler);
      } catch (e) {
        this.crawlerEvent.emit("error", e);
      }
    });
    this.crawlerEvent.on("error", (err) => {
      this.logger.error(err);
      this.crawler.errorWork++
      this.crawler.status = CrawkerStatus.STATUS_FAIL;
    });
  }

  private setAttion() {
    if (!this.urlScheduler.isEmpty()) {
      let mun = this.urlScheduler.size();
      for (let i = 0; i < mun; i++) {
        this.works.push(superagent.get(this.urlScheduler.dequeue()));
      }
      this.crawlerEvent.emit('startActivity')
    }
  }

  private _setErrorAttion(data: any[]) {
    let worklist: any[] = [];
    for (let item in data) {
      worklist.push(superagent.get(data[item]));
    }
    return worklist;
  }

  private async _getRawHtmlTextV2() {
    while (this.works.length > 0) {
      let worrk = [];
      for (let item in this.works) {
        try {
          let data = await this.works[item];
          if (data.status === 200) {
            this.crawler.finishWork++;
            this.logger.info(`完成第${this.crawler.finishWork}个网页爬取`);
            this.crawlerEvent.emit("getData", data.text);
          } else {
            let str = `地址：${this.works[item].url}：请求失败,请求状态码：${this.works[item].status}`;
            this.crawlerEvent.emit("error", str);
          }
          await this._sleep(this.crawler.requestTime);
        } catch (e) {
          worrk.push(this.works[item].url);
        }
      }
      this.works = [];
      this.works = this._setErrorAttion(worrk);
    }
    this.crawler.status = CrawkerStatus.STATUS_SUCC;
    this.crawlerEvent.emit('finishActivity')
  }

  /**
   *解析执行
   *
   * @private
   * @memberof Crawler
   */
  private _analysis(data: string, crawler: Crawlers) {
    try {
      let AnalyzerStart = new Date().getTime();
      this.analyzer.getCourseInfo(data, crawler);
      this.logger.info(
        `页面解析耗时：${new Date().getTime() - AnalyzerStart}ms`
      );
      this.crawler.status = CrawkerStatus.STATUS_ANALYSIS_SUCC;
    } catch (e) {
      this.crawlerEvent.emit(
        "error",
        `当前任务数：${this.crawler.currentTask},发生错误，${e}`
      );
      this.crawler.status = CrawkerStatus.STATUS_ANALYSIS_FAIL;
    }
  }

  /**
   *数据持久化
   *
   * @private
   * @memberof Crawler
   */
  private _persistence(Storage: HashMap<Object>, crawler: Crawlers) {
    try {
      let PersistenceStart = new Date().getTime();
      this.persistence.dataOpi(Storage, crawler);
      this.logger.info(
        `数据保存耗时：${new Date().getTime() - PersistenceStart}ms`
      );
      this.crawler.status = CrawkerStatus.STATUS_PERSIST_SUCC;
    } catch (e) {
      this.crawlerEvent.emit(
        "error",
        `当前任务数：${this.crawler.currentTask},发生错误，${e}`
      );
      this.crawler.status = CrawkerStatus.STATUS_PERSIST_FAIL;
    }
  }
}

/**
 *工厂方法
 *
 * @export
 * @param {string} [url]
 * @returns {*}  {Crawler}
 */
export function createCrawler(url?: string): Crawler {
  if (url === null || url === undefined) return new Crawler();
  else return new Crawler(url);
}
