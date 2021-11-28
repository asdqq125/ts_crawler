import { BaseUrlScheduler } from "./type";
/**
 *基于队列的多任务队列实现,内置布隆过滤器
 *
 * @export
 * @interface BaseUrlScheduler
 */
export default class UrlScheduler implements BaseUrlScheduler {
    private queue;
    private boolfilter;
    private index;
    static instance: BaseUrlScheduler;
    constructor(maxKeys?: number, errorRate?: number);
    static getInstance(): BaseUrlScheduler;
    /**
     *进队列
     *
     * @param {...string[]} url
     * @memberof UrlScheduler
     */
    enqueue(...url: string[]): void;
    /**
     *队列长度
     *
     * @returns {*}  {number}
     * @memberof UrlScheduler
     */
    size(): number;
    /**
     *出队列
     *
     * @returns {*}  {*}
     * @memberof UrlScheduler
     */
    dequeue(): any;
    /**
     *判断是否存在值
     *
     * @returns {*}  {boolean}
     * @memberof UrlScheduler
     */
    isEmpty(): boolean;
}
