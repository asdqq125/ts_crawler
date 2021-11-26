import fs from "fs";
import path from "path";
import HashMap from "./DataStructure/hashmap";
import { BasePersistence, Crawlers } from "./type";

interface ObjectPersistence {
  [x: string]: any;
}

export default class Persistence implements BasePersistence {
  private filePath: string;
  private storage: Object[];
  static instance: BasePersistence;

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

  private _init() {
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
  private _setPath(paths: string) {
    if(!fs.existsSync(path.join(__dirname, `../data`))){
      fs.mkdirSync(path.join(__dirname,`../data`))
    }
    this.filePath = path.join(__dirname, `../data/${paths}.json`);
  }

  /**
   *判断路径文件是否存在
   *
   * @private
   * @returns {*}
   * @memberof Persistence
   */
  private _isFileExisted() {
    if (fs.existsSync(this.filePath)) return true;
    else return false;
  }

  /**
   *读取文件
   *
   * @private
   * @returns {*}  {*}
   * @memberof Persistence
   */
  private _readSync(): any {
    let rawdata = fs.readFileSync(this.filePath);
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
  private _writeSync(dataSource: any) {
    const content = JSON.stringify(dataSource, null, "\t");
    fs.writeFile(this.filePath, content, (err) => {
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
  private readAndwrite() {
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
  private localsave(dataSource: object, pathStr?: string) {
    if (pathStr === undefined) this._setPath("crawldata");
    else this._setPath(pathStr);
    if (this._isFileExisted()) {
      try {
        this.storage = this._readSync();
      } catch (e) {
        return false;
      }
      this.storage.push(dataSource);
      try {
        this._writeSync(this.storage);
      } catch (e) {
        return false;
      }
      return true;
    } else {
      this.storage.push(dataSource);
      try {
        this._writeSync(this.storage);
      } catch (e) {
        return false;
      }
      return true;
    }
  }

  dataOpi(hashStorage: HashMap<Object>, crawler: Crawlers): void {
    let obj: ObjectPersistence = new Object();
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
    }else{
      throw new Error("The pass value has no elements");
    }
    crawler.hashStorage.removeAll();
    this._init();
  }
}
