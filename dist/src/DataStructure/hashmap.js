"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAX_FACTOR = 0.75;
const MIN_FACTOR = 0.25;
function isPrime(num) {
    let temp = Math.ceil(Math.sqrt(num));
    for (let i = 2; i <= temp; i++) {
        if (num % i == 0) {
            return false;
        }
    }
    return true;
}
function getPrime(num) {
    while (!isPrime(num)) {
        num++;
    }
    return num;
}
/**
 *哈希表
 *
 * @export
 * @class HashMap
 * @template T
 */
class HashMap {
    constructor() {
        this.storage = []; //数组存储元素
        this.count = 0; //当前存放元素
        this.limit = 7; //总数
        this.keylist = []; //存放键的数组
    }
    hashFunc(str, max) {
        let hashCode = 0;
        for (let i = 0; i < str.length; i++) {
            hashCode = 31 * hashCode + str.charCodeAt(i);
        }
        hashCode = hashCode % max;
        return hashCode;
    }
    /**
     *删除所有数据
     *
     * @memberof HashMap
     */
    removeAll() {
        this.storage = []; //数组存储元素
        this.count = 0; //当前存放元素
        this.limit = 7; //总数
        this.keylist = []; //存放键的数组
    }
    /**
     *放入或修改元素
     *
     * @param {string} key
     * @param {T} value
     * @memberof HashMap
     */
    put(key, value) {
        const index = this.hashFunc(key, this.limit);
        const data = {
            key: key,
            value: value,
        };
        let bucket = this.storage[index];
        if (bucket === undefined) {
            bucket = [];
            this.storage[index] = bucket;
        }
        let override = false;
        for (let i = 0; i < bucket.length; i++) {
            let tuple = bucket[i];
            if (tuple.key === key) {
                tuple.value = value;
                override = true;
            }
        }
        if (!override) {
            bucket.push(data);
            this.keylist.push(key);
            this.count++;
        }
        if (this.count > this.limit * MAX_FACTOR) {
            this.resize(getPrime(this.limit * 2));
        }
    }
    get(key) {
        const index = this.hashFunc(key, this.limit);
        const bucket = this.storage[index];
        if (bucket === undefined) {
            new Error("this storage is null");
        }
        for (let i = 0; i < bucket.length; i++) {
            let tuple = bucket[i];
            if (tuple.key === key) {
                return tuple.value;
            }
        }
        return bucket[0].value;
    }
    remove(key) {
        const index = this.hashFunc(key, this.limit);
        const bucket = this.storage[index];
        if (bucket === undefined) {
            return false;
        }
        for (let i = 0; i < bucket.length; i++) {
            let tuple = bucket[i];
            if (tuple.key === key) {
                bucket.splice(i, 1);
                for (let i = 0; i < this.keylist.length; i++) {
                    if (this.keylist[i] === key) {
                        this.keylist.splice(i, 1);
                    }
                }
                this.count--;
                if (this.limit > 8 && this.count < this.limit * MIN_FACTOR) {
                    this.resize(getPrime(Math.floor(this.limit / 2)));
                }
                return true;
            }
        }
        return false;
    }
    getKey() {
        return this.keylist;
    }
    /**
     *判断是否有值，没有返回true，反之false
     *
     * @returns {*}  {boolean}
     * @memberof HashMap
     */
    isEmpty() {
        return this.count === 0;
    }
    size() {
        return this.count;
    }
    /**
     *哈希扩容
     *
     * @param {number} newLimit
     * @memberof HashMap
     */
    resize(newLimit) {
        let oldStorage = this.storage;
        this.limit = newLimit;
        this.storage = [];
        this.count = 0;
        oldStorage.forEach((bucket) => {
            if (bucket === undefined)
                return;
            for (let i = 0; i < bucket.length; i++) {
                let tuple = bucket[i];
                this.put(tuple.key, tuple.value);
            }
        });
        oldStorage = [];
    }
    print() {
        console.log("map :>> ", this.storage);
    }
}
exports.default = HashMap;
