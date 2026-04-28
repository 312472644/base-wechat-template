// components/Empty/Empty.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    description: {
      type: String,
      value: '暂无数据'
    },
    image: {
      type: String,
      value: '/assets/images/empty.png'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    image: 'https://tdesign.gtimg.com/mobile/demos/empty1.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {}
});
