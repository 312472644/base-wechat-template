import properties from '../FormItem/properties.js';

Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/date-time-picker
   */
  properties: {
    ...properties,
    startTitle: {
      type: String,
      value: '开始时间'
    },
    endTitle: {
      type: String,
      value: '结束时间'
    },
    // 开始时间回显
    startValue: {
      type: [String, Number],
      value: ''
    },
    // 结束时间回显
    endValue: {
      type: [String, Number],
      value: ''
    },
    mode: {
      type: String,
      value: 'date'
    },
    start: {
      type: [String, Number]
    },
    end: {
      type: [String, Number]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    minStartDate: '',
    minEndDate: '',
    maxStartDate: '',
    maxEndDate: '',
    defaultValue: +new Date()
  },
  lifetimes: {
    attached() {
      this.setData({
        minStartDate: this.data.start,
        maxEndDate: this.data.end
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    triggerConfirm() {
      const startDate = this.data.startValue;
      const endDate = this.data.endValue;
      this.triggerEvent('confirm', { startDate, endDate });
    },
    handleStartConfirm(e) {
      const startValue = e.detail;
      this.setData({ startValue, minEndDate: startValue });
      this.triggerConfirm();
    },
    handleEndConfirm(e) {
      const endValue = e.detail;
      this.setData({ endValue, maxStartDate: endValue });
      this.triggerConfirm();
    }
  }
});
