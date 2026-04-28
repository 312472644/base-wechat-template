import { interceptRouter } from './utils/intercept-navigate';

App({
  onLaunch() {
    this.init();
    this.checkVersion();
  },
  globalData: {
    // 自定义头部导航栏高度
    customNavbarHeight: 0
  },
  init() {
    interceptRouter();
    // 获取开发环境
    const info = wx.getAccountInfoSync();
    const windowInfo = wx.getWindowInfo();
    wx.setStorageSync('envVersion', info.miniProgram.envVersion);
    wx.setStorageSync('SAFE_TOP', windowInfo.screenTop || 47);
  },
  /**
   * 检查是否新版本
   */
  checkVersion() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      // 监听是否有新版本
      updateManager.onCheckForUpdate();

      // 如果有新版本，下载完成后提示用户
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(function () {
        wx.showModal({
          title: '更新失败',
          content: '请删除当前小程序，重新搜索打开以获取最新版本。'
        });
      });
    } else {
      // 基础库过低，不支持
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级微信以使用新版本功能。'
      });
    }
  }
});
