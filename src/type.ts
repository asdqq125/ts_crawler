import HashMap from "./DataStructure/hashmap"

export interface Crawlers {
  url: string;
  rawHtml: string;
  requestTime:number;
  additionNumber: number;
  currentTask:number;
  status:number;
  finishWork:number;
  errorWork:number;
  hashStorage: HashMap<Object>;
}

export interface HObject {
  [x: string]: any;
}

/**
 *分析器实现接口必须实现
 *
 * @export
 * @interface BaseAnalyzer
 */
export interface BaseAnalyzer {
  getCourseInfo:(html: string, crawler: Crawlers)=> void;
}

/**
 *下载器实现接口，默认使用本地下载
 *
 * @export
 * @interface BasePersistence
 */
export interface BasePersistence {
  /**
   *原始数据操作接口
   *
   * @param {HashMap<Object>} hashStorage
   * @memberof BasePersistence
   */
  dataOpi:(hashStorage: HashMap<Object>,crawler: Crawlers)=> void;
}

/**
 *url调度器实现接口，默认使用基础调度器
 *注：必须实现url去重，建议使用基础调度器，内置布隆过滤器
 *
 * @export
 * @interface BaseUrlScheduler
 */
export interface BaseUrlScheduler {
  enqueue:(...url: string[])=>void;
  size:()=> number;
  dequeue:()=> any;
  isEmpty:()=> boolean;
}
