import { getBaseUrlPrefix } from '../config/env';
import { getToken } from '../utils/cache';
import { interceptRouter } from '../utils/intercept-navigate';

const BASE_URL_PREFIX = getBaseUrlPrefix();

/**
 * 网络请求方法
 * @param {Object} config wx.request参数配置
 * @param {Boolean} [showLoading=true] 是否显示加载动画
 */
export default function http(config = {}, showLoading = true) {
  const token = getToken();
  if (!token) {
    interceptRouter();
    return;
  }
  if (!Object.keys(config).length) return Promise.reject('参数错误');
  const mergeConfig = Object.assign({ header: {} }, config);
  const method = config?.method?.toLocaleUpperCase() || 'GET';
  if (showLoading) wx.showLoading({ title: method === 'GET' ? '加载中...' : '操作中...', mask: true });

  // 设置token
  mergeConfig.header['authorization'] = token;

  return new Promise((resolve, reject) => {
    wx.request({
      ...mergeConfig,
      url: BASE_URL_PREFIX + config.url,
      data: mergeConfig.data || {},
      timeout: 10 * 1000,
      complete: function () {
        if (showLoading) setTimeout(() => wx.hideLoading(), 500);
      },
      fail: function (error) {
        if (error.errMsg === 'request:fail timeout') {
          wx.showToast({ title: '请求超时', icon: 'none' });
        }
        reject(error);
      },
      success: function (res) {
        const { code, msg } = res.data || {};
        // 未授权或Token过期
        if (code === 401) {
          interceptRouter();
          reject('未授权');
          return;
        }
        // 弹框显示POST请求错误信息
        else if (method === 'POST' && code !== 200) {
          wx.showToast({
            title: msg || '请求失败，请稍后再试',
            icon: 'none'
          });
          reject(res.data);
          return;
        }
        resolve(res.data);
      }
    });
  });
}

/**
 * 预览doc、docx、xls、xlsx、ppt、pptx、pdf等类型文件
 * @param {String} url
 * @param {String} fileType 预览的文件类型
 * @param {Boolean} [isNativeUrl=true] true表示为http://xxx.pdf，false为/api/download/xxx
 */
export function previewDocument(url, fileType, isNativeUrl = true) {
  if (!url || !fileType) {
    return;
  }
  const fileTypeList = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
  if (!fileTypeList.includes(fileType.toLocaleLowerCase())) {
    wx.showToast({
      title: `文件类型只支持${fileTypeList.join('、')}。`,
      icon: 'none'
    });
    return;
  }
  const config = { url };
  wx.showLoading({ title: '加载中...', mask: true });
  if (!isNativeUrl) {
    config.url = BASE_URL_PREFIX + url;
    config.header.authorization = getToken();
  }
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      ...config,
      fail(err) {
        wx.showToast({
          title: '预览附件失败，请稍后再试',
          icon: 'none'
        });
        reject();
      },
      success(res) {
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath,
            fileType,
            fail: function (err) {
              wx.showToast({
                title: '打开文档失败',
                icon: 'none'
              });
              reject();
            },
            success() {
              wx.hideLoading();
              resolve();
            }
          });
        }
      }
    });
  });
}

/**
 * 附件上传
 * @param {object} file file对象
 */
export function uploadFile(file) {
  if (!file) return;
  wx.showLoading({ title: '上传中...', mask: true });
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: BASE_URL_PREFIX + '/oss/file/upload?token=' + getToken(),
      filePath: file.url,
      name: 'file',
      fail(err) {
        wx.showToast({
          title: '上传附件失败，请稍后再试',
          icon: 'none'
        });
        reject(err);
      },
      success(res) {
        try {
          // 这里默认后端返回的是JSON字符串，所以要序列化
          const { code, data } = JSON.parse(res.data) || {};
          if (code == 0) {
            resolve(data);
          }
        } catch {
          reject('上传文件序列化失败');
        }
      },
      complete() {
        wx.hideLoading();
      }
    });
  });
}
