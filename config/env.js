/**
 * 根据不同的的环境获取请求前缀
 */
export function getBaseUrlPrefix() {
  const envMode = wx.getStorageSync('envVersion');
  const mapUrl = {
    develop: 'https://68ac2b087a0bbe92cbb97fa3.mockapi.io',
    trial: 'https://trial/api',
    release: 'https://release/ap'
  };
  return mapUrl[envMode];
}
