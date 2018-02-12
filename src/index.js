/*
 * @Author: beilunyang
 * @Date: 2018-01-24 13:57:13
 * @Last Modified by: beilunyang
 * @Last Modified time: 2018-01-25 14:12:31
 */
import Interceptor from './interceptor';
import Router from './router';
import ErrorManager from '././errorManager';
import {
  featCheck,
  upload,
} from './utils';

/**
 * 监控类, 创建监控对象. 监控错误信息，用户路由变化，记录点击相关信息
 *
 * @export
 * @class Monitor
 */
export default class Monitor {
  /**
   * Creates an instance of Monitor.
   * @param {object} options 配置参数
   * @memberof Monitor
   */
  constructor(options) {
    /**
     * module: 模块
     * env: 运行环境
     * logHandler: 如何处理日志
     * interceptFilter: 如何拦截ajax
     */
    const {
      module,
      env,
      logHandler,
      interceptFilter,
    } = options;
    const fixedFields = {
      module,
      env,
      userAgent: navigator.userAgent,
    };
    this.interceptFilter = interceptFilter;
    this.router = new Router();
    this.interceptor = new Interceptor(fixedFields, this.router, logHandler);
    this.errorManager = new ErrorManager(fixedFields, this.router, logHandler);
  }

  /**
   * 上传到相应的后端接口
   *
   * @public
   * @static
   * @param {string} log
   * @memberof Monitor
   */
  static upload(log) {
    upload(log);
  }


  /**
   * 上传所有本地日志
   *
   * @private
   * @memberof Monitor
   */
  _recoverUpload() {
    const re = /^log-\d+$/;
    const keys = Object.keys(localStorage).filter(key => re.test(key));
    for (const key of keys) {
      upload(localStorage.getItem(key))
        .then(() => localStorage.removeItem(key))
        .catch(e => console.error(e));
    }
  }

  /**
   * 拦截ajax拦截
   *
   * @public
   * @memberof Monitor
   */
  interceptAjax() {
    this.interceptor.interceptAjax();
  }

  /**
   * 取消ajax拦截
   *
   * @public
   * @memberof Monitor
   */
  unInterceptAjax() {
    this.interceptor.unInterceptAjax();
  }

  /**
   * 运行
   *
   * @public
   * @returns {boolean|void}
   * @memberof Monitor
   */
  run() {
    if (!featCheck()) return false;
    const defaultInterceptFilter = (xhr) => {
      // interceptFilter返回true则记录日志; 返回false则不记录
      if (xhr.responseText.code === 0) {
        return false;
      }
      return true;
    };
    this._recoverUpload();
    this.interceptor.interceptAjax(this.interceptFilter || defaultInterceptFilter);
    this.router.record();
    this.errorManager.record();
  }
};

window.Monitor = Monitor;
