/*
 * @Author: beilunyang
 * @Date: 2017-11-15 11:53:47
 * @Last Modified by: beilunyang
 * @Last Modified time: 2018-01-25 11:41:20
 */
import { formatTime } from './utils';

/**
 * 路由类，用于创建路由对象，管理路由相关内容
 *
 * @export
 * @class Router
 */
export default class Router {
  /**
   * Creates an instance of Router.
   * @memberof Router
   */
  constructor() {
    this.routes = [];
  }

  /**
   * 记录进入路由时信息
   *
   * @private
   * @param {string} url
   * @memberof Router
   */
  _enter(url) {
    this.routes.push({
      [url]: [{
        time: formatTime('yyyy-MM-dd hh:mm:ss'),
        type: '进入',
      }],
    });
  }

  /**
   * 记录离开路由时的信息
   *
   * @private
   * @param {string} url
   * @memberof Router
   */
  _leave(url) {
    this.routes[this.routes.length - 1][url].push({
      time: formatTime('yyyy-MM-dd hh:mm:ss'),
      type: '离开',
    });
  }

  /**
   * 记录停留在页面时的点击信息
   *
   * @private
   * @param {string} url
   * @param {object} clickInfo
   * @memberof Router
   */
  _active(url, clickInfo) {
    let route = this.routes[this.routes.length - 1][url];
    for (const r of route) {
      if (r.type === '活跃') {
        return r.incidents.push(clickInfo);
      }
    }
    route.push({
      time: formatTime('yyyy-MM-dd hh:mm:ss'),
      type: '活跃',
      incidents: [clickInfo],
    });
  }

  /**
   * 开始记录
   *
   * @private
   * @memberof Router
   */
  _recordInit() {
    this._enter(location.href);
  }

  /**
   * 记录Hash路由的变化
   *
   * @private
   * @memberof Router
   */
  _recordHashChange() {
    window.addEventListener('hashchange', (e) => {
      const { oldURL, newURL } = e;
      this._leave(oldURL);
      this._enter(newURL);
    });
  }

  /**
   * 记录点击相关的信息
   *
   * @private
   * @memberof Router
   */
  _recordClick() {
    document.body.addEventListener('click', (e) => {
      const { screenX, screenY } = e;
      const result = e.target.outerHTML.match(/<.+?>/);
      const url = location.href;
      this._active(url, {
        screenX,
        screenY,
        responder: result && result[0],
        responderSEL: 'click',
        respondTime: formatTime('yyyy-MM-dd hh:mm:ss'),
      });
    });
  }

  /**
   * 记录
   *
   * @public
   * @memberof Router
   */
  record() {
    this._recordInit();
    this._recordHashChange();
    this._recordClick();
  }
};
