// components/BasePopup/BasePopup.js
Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/popup
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
      // observer: 'process'
    },
    placement: {
      type: String,
      value: 'bottom'
    },
    title: {
      type: String,
      value: '请选择'
    },
    height: {
      type: String,
      value: '40vh'
    },
    // 弹框距离视口顶部的距离
    offsetTop: {
      type: String
    },
    showHeader: {
      type: Boolean,
      value: true
    },
    // 遮罩层属性
    overlayProps: {
      type: Object,
      value: {}
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
    handleClose() {
      this.triggerEvent('close');
    },
    handleConfirm() {
      this.triggerEvent('confirm');
    },
    onVisibleChange(e) {
      this.setData({ visible: e.detail.visible });
      this.triggerEvent('close');
    }
  }
});
