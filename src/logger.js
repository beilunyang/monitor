/*
 * @Author: beilunyang
 * @Date: 2017-11-14 15:23:19
 * @Last Modified by: beilunyang
 * @Last Modified time: 2018-01-25 13:58:05
 */
import { upload } from './utils';

/**
 * 日志类,用于创建日志对象
 *
 * @export
 * @class Logger
 */
export default class Logger {
  /**
   * Creates an instance of Logger.
   * @param {object} initLog 固定的日志字段
   * @param {func} logHandler 日志处理器
   * @memberof Logger
   */
  constructor(initLog, logHandler) {
    this.log = initLog;
    this.logHandler = logHandler;
  }

  /**
   * 同Object.assign
   *
   * @public
   * @param {object} fields
   * @memberof Logger
   */
  concat(fields) {
    Object.assign(this.log, fields);
  }

  /**
   * 默认的日志处理器,默认上传到相应的后端接口
   *
   * @private
   * @param {object|string} log
   * @memberof Logger
   */
  _defaultLogHandler(log) {
    let logStr = '';
    if (log && typeof log === 'object') {
      logStr = JSON.stringify(log);
    }

    if (typeof log === 'string') {
      logStr = log;
    }

    try {
      upload(logStr);
    } catch (e) {
      localStorage.setItem(`log-${Date.now()}`, logStr);
    }
  }

  /**
   * 保存日志
   *
   * @public
   * @returns {void}
   * @memberof Logger
   */
  save() {
    if (this.logHandler) {
      this.logHandler(this.log);
      return;
    }
    this._defaultLogHandler(this.log);
  }

};
