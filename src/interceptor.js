/*
 * @Author: beilunyang
 * @Date: 2017-11-14 15:36:56
 * @Last Modified by: beilunyang
 * @Last Modified time: 2018-01-25 14:00:11
 */
import ah from 'ajax-hook';
import Logger from './logger';
import { formatTime } from './utils';
import { WHITE_LIST } from "./config";

/**
 * 拦截器类,用来拦截请求响应
 *
 * @export
 * @class Interceptor
 */
export default class Interceptor {
  /**
   * Creates an instance of Interceptor.
   * @param {object} fixedFields 固定的日志字段
   * @param {object} router 路由对象
   * @param {func} logHandler 日志处理器
   * @memberof Interceptor
   */
  constructor(fixedFields, router, logHandler) {
    this.fixedFields = fixedFields;
    this.router = router;
    this.logHandler = logHandler;
  }

  /**
   * 拦截ajax请求
   *
   * @public
   * @param {func} interceptFilter
   * @returns
   * @memberof Interceptor
   */
  interceptAjax(interceptFilter) {
    const fixedFields = this.fixedFields;
    const router = this.router;
    const logHandler = this.logHandler;
    ah.hookAjax({
      open(arg, xhr) {
        const url = arg[1];
        const logInfo = {};
        const requestMethod = arg[0];
        logInfo.url = url;
        logInfo.requestMethod = requestMethod;
        xhr.logInfo = logInfo;
      },
      onreadystatechange(xhr) {
        if (xhr.readyState === 4) {
          const logInfo = xhr.xhr.logInfo || {};
          if (WHITE_LIST.includes(logInfo.url)) return;
          if (typeof interceptFilter === 'function') {
            const result = interceptFilter(xhr);
            if (!result) return;
          }
          const logger = new Logger(fixedFields, logHandler);
          const displayTime = formatTime('yyyy-MM-dd hh:mm:ss');
          logInfo.code = xhr.status;
          logInfo.response = xhr.reponseText;
          logger.concat({
            displayTime,
            routes: router.routes,
            logInfo,
          });
          logger.save();
        }
      },
    });
  }

  /**
   * 取消ajax拦截
   *
   * @public
   * @memberof Interceptor
   */
  unInterceptAjax() {
    ah.unHookAjax();
  }
};
