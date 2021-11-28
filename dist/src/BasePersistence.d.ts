import HashMap from "./DataStructure/hashmap";
import { BasePersistence, Crawlers } from "./type";
export default class Persistence implements BasePersistence {
    private filePath;
    private storage;
    static instance: BasePersistence;
    constructor();
    static getInstance(): BasePersistence;
    private _init;
    /**
     *设置路径
     *
     * @private
     * @param {string} paths
     * @memberof Persistence
     */
    private _setPath;
    /**
     *判断路径文件是否存在
     *
     * @private
     * @returns {*}
     * @memberof Persistence
     */
    private _isFileExisted;
    /**
     *读取文件
     *
     * @private
     * @returns {*}  {*}
     * @memberof Persistence
     */
    private _readSync;
    /**
     *写文件
     *
     * @private
     * @param {*} dataSource
     * @memberof Persistence
     */
    private _writeSync;
    /**
     *同步读写
     *
     * @private
     * @memberof Persistence
     */
    private readAndwrite;
    /**
     *本地下载
     *
     * @private
     * @param {object} dataSource
     * @param {string} [pathStr]
     * @memberof Persistence
     */
    private localsave;
    dataOpi(hashStorage: HashMap<Object>, crawler: Crawlers): void;
}
