/*
 * @Author: beilunyang
 * @Date: 2017-11-15 11:15:15
 * @Last Modified by: beilunyang
 * @Last Modified time: 2018-01-25 14:13:47
 */
import { UPLOAD_ENDPOINT } from './config';

/**
 * 格式化当前时间
 *
 * @export
 * @param {string} fmt
 * @returns {string}
 */
export const formatTime = (fmt) => {
  const d = new Date();
  const o = {
    "M+": d.getMonth() + 1, //月份
    "d+": d.getDate(), //日
    "h+": d.getHours(), //小时
    "m+": d.getMinutes(), //分
    "s+": d.getSeconds(), //秒
    "q+": Math.floor((d.getMonth() + 3) / 3), //季度
    "S": d.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

/**
 * 运行环境能力检测
 *
 * @export
 * @returns {boolean}
 */
export const featCheck = () => {
  if (!window) {
    console.warn('不支持此环境,window对象不可用');
    return false;
  }

  if (!('document' in window)) {
    console.warn('不支持此环境,document对象不可用');
    return false;
  }

  if (!('localStorage' in window)) {
    console.warn('不支持此环境,localstorage对象不可用');
    return false;
  }

  if (!('onhashchange' in window)) {
    console.warn('不支持此环境,hashchange事件不可用');
    return false;
  }
  return true;
};

/**
 * 上传到相应的后端接口
 *
 * @export
 * @param {string} log
 * @returns {Promise<string|null>}
 */
export const upload = (log) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOAD_ENDPOINT, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('UPLOAD:', xhr.responseText);
        resolve(log);
      }
    };
    xhr.onerror = (e) => {
      reject(e);
    };
    xhr.send(log);
  });
};
