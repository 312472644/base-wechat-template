// components/PullDownRefresh/PullDownRefresh.js
Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/pull-down-refresh?tab=demo
   */
  properties: {
    usingCustomNavbar: {
      type: Boolean,
      value: false
    },
    usingCustomTabbar: {
      type: Boolean,
      value: false
    },
    loadingTexts: {
      type: Array,
      value: ['下拉刷新', '松手刷新', '正在刷新', '刷新完成']
    },
    value: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onRefresh() {
      this.triggerEvent('refresh');
    },
    onScrolltolower() {
      this.triggerEvent('reachBottom');
    }
  }
});
