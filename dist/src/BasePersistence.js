"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Persistence {
    constructor() {
        this.filePath = "";
        this.storage = [];
    }
    static getInstance() {
        if (!Persistence.instance) {
            Persistence.instance = new Persistence();
        }
        return Persistence.instance;
    }
    _init() {
        this.filePath = "";
        this.storage = [];
    }
    /**
     *设置路径
     *
     * @private
     * @param {string} paths
     * @memberof Persistence
     */
    _setPath(paths) {
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, `../data`))) {
            fs_1.default.mkdirSync(path_1.default.join(__dirname, `../data`));
        }
        this.filePath = path_1.default.join(__dirname, `../data/${paths}.json`);
    }
    /**
     *判断路径文件是否存在
     *
     * @private
     * @returns {*}
     * @memberof Persistence
     */
    _isFileExisted() {
        if (fs_1.default.existsSync(this.filePath))
            return true;
        else
            return false;
    }
    /**
     *读取文件
     *
     * @private
     * @returns {*}  {*}
     * @memberof Persistence
     */
    _readSync() {
        let rawdata = fs_1.default.readFileSync(this.filePath);
        let personObj = JSON.parse(rawdata.toString());
        return personObj;
    }
    /**
     *写文件
     *
     * @private
     * @param {*} dataSource
     * @memberof Persistence
     */
    _writeSync(dataSource) {
        const content = JSON.stringify(dataSource, null, "\t");
        fs_1.default.writeFile(this.filePath, content, (err) => {
            if (err) {
                new Error(err.toString());
            }
        });
    }
    /**
     *同步读写
     *
     * @private
     * @memberof Persistence
     */
    readAndwrite() {
        throw new Error("No implementation method");
    }
    /**
     *本地下载
     *
     * @private
     * @param {object} dataSource
     * @param {string} [pathStr]
     * @memberof Persistence
     */
    localsave(dataSource, pathStr) {
        if (pathStr === undefined)
            this._setPath("crawldata");
        else
            this._setPath(pathStr);
        if (this._isFileExisted()) {
            try {
                this.storage = this._readSync();
            }
            catch (e) {
                return false;
            }
            this.storage.push(dataSource);
            try {
                this._writeSync(this.storage);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        else {
            this.storage.push(dataSource);
            try {
                this._writeSync(this.storage);
            }
            catch (e) {
                return false;
            }
            return true;
        }
    }
    dataOpi(hashStorage, crawler) {
        let obj = new Object();
        let isObj = false;
        hashStorage.getKey().forEach((item) => {
            obj[item] = hashStorage.get(item);
            isObj = true;
        });
        if (isObj) {
            obj["time"] = new Date().getTime();
            if (!this.localsave(obj, new Date().getTime() + "")) {
                new Error("Storage failure");
            }
        }
        else {
            throw new Error("The pass value has no elements");
        }
        crawler.hashStorage.removeAll();
        this._init();
    }
}
exports.default = Persistence;
