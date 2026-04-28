Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    },
    sticky: {
      type: Boolean,
      value: true
    },
    // 查询表单名称，主要用来重置表单数据
    formName: {
      type: String,
      value: 'form'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    offsetTop: 0,
    popupOffsetTop: 0,
    visible: false,
    keyWord: '',
    currPageInstance: null,
    overlayProps: {}
  },
  lifetimes: {
    attached() {
      // 获取当前查询组件页面Page对象实例
      const parent = this.selectOwnerComponent();
      if (parent) {
        this.setData({ currPageInstance: parent });
      }
    },
    ready() {
      if (!this.data.sticky) return;
      const app = getApp();
      setTimeout(() => {
        const offsetTop = app.globalData.customNavbarHeight;
        const popupOffsetTop = offsetTop + 'px';
        const overlayProps = { style: `top:${popupOffsetTop}` };
        this.setData({ offsetTop, popupOffsetTop, overlayProps });
      }, 100);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleIconTap() {
      const visible = this.data.visible;
      this.setData({ visible: !visible });
    },
    // 用户未点击查询按钮时，关闭弹框时，应该清除显示的值
    clearFormValue() {
      const currPageInstance = this.data.currPageInstance;
      if (currPageInstance) {
        const formName = this.data.formName;
        const formData = currPageInstance.data[formName];
        this.data.currPageInstance.setData({ [formName]: { ...formData } });
      }
    },
    handleInputChange(e) {
      const detail = e.detail;
      this.setData({ keyWord: detail.value });
    },
    handleClose() {
      // this.clearFormValue();
      this.setData({ visible: false });
    },
    handleReset() {
      this.setData({ visible: false, keyWord: '' });
      this.triggerEvent('reset');
    },
    handleClear() {
      this.triggerEvent('search', '');
    },
    handleEnter() {
      const keyWord = this.data.keyWord;
      if (!keyWord) return;
      this.triggerEvent('search', keyWord);
    },
    handleQuery() {
      this.setData({ visible: false });
      this.triggerEvent('search', this.data.keyWord);
    }
  }
});
