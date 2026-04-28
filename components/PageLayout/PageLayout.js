Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示自定义底部导航栏
    showCustomTabbar: {
      type: Boolean,
      value: false
    },
    // 是否显示自定义头部导航栏
    showCustomNavbar: {
      type: Boolean,
      value: false
    },
    // 导航栏标题
    navbarTitle: {
      type: String,
      value: ''
    },
    // 是否展示左侧箭头
    leftArrow: {
      type: Boolean,
      value: true
    },
    // 返回上一级页面地址
    navigateUrl: {
      type: String,
      value: ''
    },
    // 返回上一级页面的方式【navigateTo|redirectTo|switchTab|reLaunch】
    navigateType: {
      type: String,
      value: 'navigateTo'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navbarHeight: 0
  },
  lifetimes: {
    attached() {
      const app = getApp();
      const showCustomNavbar = this.data.showCustomNavbar;
      if (!showCustomNavbar) {
        this.setData({ navbarHeight: 0 });
        app.globalData.customNavbarHeight = 0;
        return;
      }
      this.createSelectorQuery()
        .select('#navbar')
        .boundingClientRect((res) => {
          const navbarHeight = res?.height;
          this.setData({ navbarHeight: navbarHeight });
          app.globalData.customNavbarHeight = navbarHeight;
        })
        .exec();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      const navigateUrl = this.data.navigateUrl;
      const navigateType = this.data.navigateType;
      if (!navigateUrl) return;
      wx[navigateType]({ url: navigateUrl });
    }
  }
});
