const TOKEN_KEY = 'TOKEN';

export function getToken() {
  return wx.getStorageSync(TOKEN_KEY);
}

export function setToken(val) {
  wx.setStorageSync(TOKEN_KEY, val);
}

export function removeToken() {
  wx.removeStorageSync(TOKEN_KEY);
}

/**
 * 通过key获取本地缓存数据
 * @param {string}} key
 */
export function getStorageSyncByKey(key) {
  if (!key) return null;
  const data = wx.getStorageSync(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.log('🚀 ~ 获取缓存数据失败：' + key + ' ~ e:', e);
    return null;
  }
}
