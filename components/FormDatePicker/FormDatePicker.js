import properties from '../FormItem/properties';
import dayjs from 'dayjs';

const formatMap = {
  year: 'YYYY',
  month: 'YYYY-MM',
  date: 'YYYY-MM-DD',
  hour: 'YYYY-MM-DD HH',
  minute: 'YYYY-MM-DD HH:mm',
  second: 'YYYY-MM-DD HH:mm:ss'
};

Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/date-time-picker
   */
  properties: {
    ...properties,
    value: {
      type: [String, Number],
      observer: 'observer'
    },
    mode: {
      type: String,
      value: 'date'
    },
    format: {
      type: String
    },
    // 选择器的最小可选时间，默认为当前时间-10年
    start: {
      type: [String, Number]
    },
    // 选择器的最大可选时间，默认为当前时间+10年
    end: {
      type: [String, Number]
    },
    // 确定事件可以通过返回false来阻止确认事件
    confirm: {
      type: Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    format: '',
    defaultValue: +new Date(),
    noteText: ''
  },

  lifetimes: {
    attached() {
      this.setData({ format: formatMap[this.data.mode] });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    observer(val) {
      if (!val) {
        this.setData({ noteText: '请选择' });
        return;
      }
      const format = formatMap[this.data.mode];
      const noteText = dayjs(val).format(format);
      this.setData({ noteText });
    },
    openPicker() {
      this.setData({ visible: true });
    },
    handleCancel() {
      this.setData({ visible: false });
    },
    handleConfirm(e) {
      const confirmFn = this.data.confirm;
      const date = e.detail.value;
      const isValid = typeof confirmFn === 'function' ? confirmFn(date) : true;
      const showDate = isValid ? date : '';
      this.setData({
        note: showDate || '请选择',
        visible: false,
        value: showDate
      });
      this.triggerEvent('confirm', showDate);
    }
  }
});
