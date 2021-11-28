export default class Queue<T> {
    private items;
    private count;
    private index;
    constructor();
    /**
     *添加一个元素到队列
     *
     * @param {T} value
     * @memberof Queue
     */
    enqueue(value: T): void;
    /**
     *移除队尾元素，同时返回元素
     *
     * @returns {*}  {T}
     * @memberof Queue
     */
    dequeue(): T;
    /**
     *返回队尾元素，不做操作
     *
     * @returns {*}  {T}
     * @memberof Queue
     */
    head(): T;
    /**
     *返回队头元素，不做操作
     *
     * @returns {*}  {T}
     * @memberof Queue
     */
    font(): T;
    /**
     *判断队列是否有值，没有值返回TRUE，有返回FALSE
     *
     * @returns {*}  {boolean}
     * @memberof Queue
     */
    isEmpty(): boolean;
    /**
     *返回队内元素个数
     *
     * @returns {*}  {number}
     * @memberof Queue
     */
    size(): number;
    toString(): string;
    /**
     *置空
     *
     * @memberof Queue
     */
    clear(): void;
}
