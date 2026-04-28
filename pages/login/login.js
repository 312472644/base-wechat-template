import { setToken } from '../../utils/cache';
import { Tabbar } from '../../config/tabbar';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    rememberPassword: false,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 如果之前记住了密码，可以从缓存中获取
    const savedUserInfo = wx.getStorageSync('userInfo');
    if (savedUserInfo) {
      this.setData({
        username: savedUserInfo.username || '',
        password: savedUserInfo.password || '',
        rememberPassword: true
      });
    }
    this.setData({ options });
  },

  /**
   * 用户名输入变化事件
   */
  onUsernameChange(e) {
    this.setData({
      username: e.detail.value
    });
  },

  /**
   * 密码输入变化事件
   */
  onPasswordChange(e) {
    this.setData({
      password: e.detail.value
    });
  },

  /**
   * 记住密码选项变化事件
   */
  onRememberChange(e) {
    this.setData({
      rememberPassword: e.detail.value
    });
  },

  /**
   * 登录按钮点击事件
   */
  onLogin() {
    const { username, password, rememberPassword } = this.data;

    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    // 显示加载中
    wx.showLoading({
      title: '登录中...',
      mask: true
    });

    // 模拟登录请求
    setTimeout(() => {
      wx.hideLoading();

      // 如果选择了记住密码，则保存到本地缓存
      if (rememberPassword) {
        wx.setStorageSync('userInfo', { username, password });
      } else {
        wx.removeStorageSync('userInfo');
      }

      const options = this.data.options;
      setToken('token-test');

      // 登录成功后跳转到首页
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            const url = options.refer || '/pages/index/index';
            const isTabbar = Tabbar.some((item) => item.value === url);
            if (isTabbar) {
              wx.switchTab({ url });
            } else {
              wx.redirectTo({
                url,
                fail(err) {
                  console.log('err', err);
                }
              });
            }
          }, 1500);
        }
      });
    }, 1500);
  },

  /**
   * 忘记密码点击事件
   */
  onForgotPassword() {
    wx.showToast({
      title: '忘记密码功能开发中',
      icon: 'none'
    });
  },

  /**
   * 注册点击事件
   */
  onRegister() {
    wx.showToast({
      title: '注册功能开发中',
      icon: 'none'
    });
  }
});
