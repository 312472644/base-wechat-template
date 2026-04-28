import { Tabbar } from '../config/tabbar';

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    active: '',
    list: Tabbar
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const url = e.detail.value;
      this.setData({ active: url });
      wx.switchTab({ url });
    },
    setActive(index) {
      this.setData({ active: this.data.list[index].value });
    },
    onClick() {
      wx.showToast({
        title: '功能开发中...',
        icon: 'none'
      });
    }
  }
});
