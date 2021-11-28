/**
 *哈希表
 *
 * @export
 * @class HashMap
 * @template T
 */
export default class HashMap<T> {
    private storage;
    private count;
    private limit;
    private keylist;
    constructor();
    private hashFunc;
    /**
     *删除所有数据
     *
     * @memberof HashMap
     */
    removeAll(): void;
    /**
     *放入或修改元素
     *
     * @param {string} key
     * @param {T} value
     * @memberof HashMap
     */
    put(key: string, value: T): void;
    get(key: string): T;
    remove(key: string): boolean;
    getKey(): string[];
    /**
     *判断是否有值，没有返回true，反之false
     *
     * @returns {*}  {boolean}
     * @memberof HashMap
     */
    isEmpty(): boolean;
    size(): number;
    /**
     *哈希扩容
     *
     * @param {number} newLimit
     * @memberof HashMap
     */
    private resize;
    print(): void;
}
