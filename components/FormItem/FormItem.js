import properties from './properties.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ...properties,
    arrow: {
      type: Boolean,
      value: true
    },
    note: {
      type: String,
      value: ''
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
    handleClick() {
      this.triggerEvent('click');
    }
  }
});
