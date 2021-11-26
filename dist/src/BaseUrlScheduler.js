"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = __importDefault(require("./DataStructure/queue"));
const hashFun_1 = __importDefault(require("./DataStructure/hashFun"));
class BloomFilter {
    constructor(maxKeys, errorRate) {
        // 布隆过滤器位图映射变量
        this.bitMap = [];
        // 布隆过滤器中最多可放的数量
        this.maxKeys = maxKeys;
        // 布隆过滤器错误率
        this.errorRate = errorRate;
        // 位图变量的长度，需要根据maxKeys和errorRate来计算
        this.bitSize = Math.ceil(this.maxKeys * (-Math.log(this.errorRate) / (Math.log(2) * Math.log(2))));
        // 哈希数量
        this.hashCount = Math.ceil(Math.log(2) * (this.bitSize / this.maxKeys));
        // 已加入元素数量
        this.keyCount = 0;
    }
    /**
     *获取哈希数量
     *
     * @returns {*}
     * @memberof BloomFilter
     */
    getKeyCount() {
        return this.keyCount;
    }
    /**
     *设置比特
     *
     * @param {number} bit
     * @memberof BloomFilter
     */
    setBit(bit) {
        let numArr = Math.floor(bit / 31), numBit = Math.floor(bit % 31);
        this.bitMap[numArr] |= 1 << numBit;
    }
    /**
     *获取比特
     *
     * @param {number} bit
     * @returns {*}
     * @memberof BloomFilter
     */
    getBit(bit) {
        let numArr = Math.floor(bit / 31), numBit = Math.floor(bit % 31);
        return (this.bitMap[numArr] &= 1 << numBit);
    }
    /**
     *添加进过滤器
     *
     * @param {string} key
     * @returns {*}
     * @memberof BloomFilter
     */
    add(key) {
        if (this.contain(key)) {
            return -1;
        }
        let hash1 = (0, hashFun_1.default)(key, 0, 0), hash2 = (0, hashFun_1.default)(key, 0, hash1);
        for (let i = 0; i < this.hashCount; i++) {
            this.setBit(Math.abs(Math.floor((hash1 + i * hash2) % this.bitSize)));
        }
        this.keyCount++;
    }
    /**
     *
     * 校验
     *
     * @param {string} key
     * @returns {*}  {boolean}
     * @memberof BloomFilter
     */
    contain(key) {
        let hash1 = (0, hashFun_1.default)(key, 0, 0);
        let hash2 = (0, hashFun_1.default)(key, 0, hash1);
        for (let i = 0; i < this.hashCount; i++) {
            if (!this.getBit(Math.abs(Math.floor((hash1 + i * hash2) % this.bitSize)))) {
                return false;
            }
        }
        return true;
    }
}
/**
 *基于队列的多任务队列实现,内置布隆过滤器
 *
 * @export
 * @interface BaseUrlScheduler
 */
class UrlScheduler {
    constructor(maxKeys, errorRate) {
        this.queue = new queue_1.default();
        this.index = 0;
        if (maxKeys != undefined && errorRate != undefined)
            this.boolfilter = new BloomFilter(maxKeys, errorRate);
        else
            this.boolfilter = new BloomFilter(100000000, 0.01);
    }
    static getInstance() {
        if (!UrlScheduler.instance) {
            UrlScheduler.instance = new UrlScheduler();
        }
        return UrlScheduler.instance;
    }
    /**
     *进队列
     *
     * @param {...string[]} url
     * @memberof UrlScheduler
     */
    enqueue(...url) {
        url.forEach((element) => {
            if (!this.boolfilter.contain(element)) {
                this.boolfilter.add(element);
                this.queue.enqueue(element);
                this.index++;
            }
        });
    }
    /**
     *队列长度
     *
     * @returns {*}  {number}
     * @memberof UrlScheduler
     */
    size() {
        return this.index;
    }
    /**
     *出队列
     *
     * @returns {*}  {*}
     * @memberof UrlScheduler
     */
    dequeue() {
        return this.queue.dequeue();
    }
    /**
     *判断是否存在值
     *
     * @returns {*}  {boolean}
     * @memberof UrlScheduler
     */
    isEmpty() {
        return this.queue.isEmpty();
    }
}
exports.default = UrlScheduler;
