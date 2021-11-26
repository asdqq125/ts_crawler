"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor() {
        this.items = {};
        this.count = 0;
        this.index = 0;
    }
    /**
     *添加一个元素到队列
     *
     * @param {T} value
     * @memberof Queue
     */
    enqueue(value) {
        if (this.index === 0) {
            this.items[this.count++] = value;
        }
        else if (this.count - this.index === 0) {
            this.count = 0;
            this.index = 0;
            this.items[this.count++] = value;
        }
        else {
            let list = [];
            for (let i = this.index; i < this.count; i++) {
                list.push(this.items[i]);
            }
            this.count = 0;
            this.index = 0;
            for (let i = 0; i < list.length; i++) {
                this.items[this.count++] = list[i];
            }
            this.items[this.count++] = value;
        }
    }
    /**
     *移除队尾元素，同时返回元素
     *
     * @returns {*}  {T}
     * @memberof Queue
     */
    dequeue() {
        if (this.index > this.count || this.isEmpty())
            new Error("The queue has no elements");
        let result = this.items[this.index];
        delete this.items[this.index];
        this.index++;
        return result;
    }
    /**
     *返回队尾元素，不做操作
     *
     * @returns {*}  {T}
     * @memberof Queue
     */
    head() {
        return this.items[this.index];
    }
    /**
     *返回队头元素，不做操作
     *
     * @returns {*}  {T}
     * @memberof Queue
     */
    font() {
        if (this.count === 0)
            new Error("The queue has no elements");
        return this.items[this.count - 1];
    }
    /**
     *判断队列是否有值，没有值返回TRUE，有返回FALSE
     *
     * @returns {*}  {boolean}
     * @memberof Queue
     */
    isEmpty() {
        return this.count - this.index === 0;
    }
    /**
     *返回队内元素个数
     *
     * @returns {*}  {number}
     * @memberof Queue
     */
    size() {
        return this.count - this.index;
    }
    toString() {
        if (this.isEmpty())
            return "";
        let objString = `${this.items[0]}`;
        for (let i = 1; i < this.count; i++) {
            objString += ` ${this.items[i]}`;
        }
        return objString;
    }
    /**
     *置空
     *
     * @memberof Queue
     */
    clear() {
        this.items = {};
        this.count = 0;
        this.index = 0;
    }
}
exports.default = Queue;
