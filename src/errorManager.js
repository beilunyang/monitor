/*
 * @Author: beilunyang
 * @Date: 2017-11-16 14:45:48
 * @Last Modified by: beilunyang
 * @Last Modified time: 2018-01-10 10:49:47
 */
import Logger from './logger';

/**
 * 错误管理类，用于管理错误相关的内容
 *
 * @export
 * @class ErrorManager
 */
export default class ErrorManager {
  /**
   * Creates an instance of ErrorManager.
   * @param {object} fixedFields 固定日志字段
   * @param {object} router 路由对象
   * @param {func} logHandler 日志处理器
   * @memberof ErrorManager
   */
  constructor(fixedFields, router, logHandler) {
    this.fixedFields = fixedFields;
    this.router = router;
    this.logHandler = logHandler;
  }

  /**
   * 记录未捕获错误
   *
   * @private
   * @memberof ErrorManager
   */
  _recordUncaughtError() {
    window.addEventListener('error', (e) => {
      const logger = new Logger(this.fixedFields, this.logHandler);
      const logInfo = {
        url: location.href,
        errorMessage: e.message,
        errorStack: e,
      };
      logger.concat({
        routes: this.router.routes,
        logInfo,
      });
      logger.save();
    });
  }

  /**
   * 记录
   *
   * @public
   * @memberof ErrorManager
   */
  record() {
    this._recordUncaughtError();
  }
};
