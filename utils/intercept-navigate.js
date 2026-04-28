import { getToken } from './cache';

// 拦截页面白名单
const WhiteList = ['/login'];

/**
 * 重写页面跳转方法，主要是新增一些自定义的拦截功能
 */
const originNavigateTo = cloneFunc(wx.navigateTo);
const originRedirectTo = cloneFunc(wx.redirectTo);
const originSwitchTab = cloneFunc(wx.switchTab);
const originReLaunch = cloneFunc(wx.reLaunch);

/**
 * 重写navigateTo方法
 * @param {Object} config
 */
wx.navigateTo = (config) => {
  interceptRouter(config).then(() => {
    originNavigateTo(config);
  });
};

/**
 * 重写redirectTo方法
 * @param {Object} config
 */
wx.redirectTo = (config) => {
  interceptRouter(config).then(() => {
    originRedirectTo(config);
  });
};

/**
 * 重写switchTab方法
 * @param {Object} config
 */
wx.switchTab = (config) => {
  interceptRouter(config).then(() => {
    originSwitchTab(config);
  });
};

/**
 * 重写reLaunch方法
 * @param {Object} config
 */
wx.reLaunch = (config) => {
  interceptRouter(config).then(() => {
    originReLaunch(config);
  });
};

/**
 * 拦截页面跳转
 * @param {*} config
 */
export function interceptRouter(config) {
  const token = getToken();
  return new Promise((resolve, reject) => {
    const url = config?.url || '';
    console.log('url', url);
    if (!token && !WhiteList.includes(url)) {
      // 跳转登录页
      originRedirectTo({ url: `/pages/login/login?refer=${url}` });
      reject('未登录');
      return;
    }
    resolve();
  });
}

/**
 * 函数复制
 * @param {Function} fn
 * @returns {Function}
 */
function cloneFunc(fn) {
  function newFn(...args) {
    return fn.apply(this, args);
  }
  Object.setPrototypeOf(newFn, Object.create(Object.getPrototypeOf(fn)));
  Object.assign(newFn, fn);
  return newFn;
}
