import properties from '../FormItem/properties';
import dayjs from 'dayjs';

Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/calendar
   */
  properties: {
    ...properties,
    value: {
      type: [String, Number, Array],
      observer: 'processValue',
      value: ''
    },
    readonly: {
      type: Boolean,
      value: false
    },
    minDate: {
      type: [String, Number],
      observer: 'processMinDate'
    },
    maxDate: {
      type: [String, Number],
      observer: 'processMaxDate'
    },
    format: {
      type: Function
    },
    // none/month/year-month
    switchMode: {
      type: String,
      value: 'none'
    },
    // single/multiple/range
    type: {
      type: String,
      value: 'single'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    calendarValue: '',
    noteText: '',
    calendarMinDate: '',
    calendarMaxDate: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    transformDate(date) {
      return typeof date === 'string' ? +new Date(date) : date;
    },
    getNoteText(date) {
      const type = this.data.type;
      if (!this.isEmpty(date)) return;
      const normalizList = Array.isArray(date) ? date : [date];
      const noteText = (normalizList || [])
        .map((item) => {
          return dayjs(item).format('YYYY-MM-DD');
        })
        .join(type === 'range' ? '至' : '、');
      this.setData({ noteText });
    },
    isEmpty(date) {
      return Array.isArray(date) ? date.length : Boolean(date);
    },
    processMinDate(val) {
      if (!val) return;
      this.setData({ calendarMinDate: this.transformDate(val) });
    },
    processMaxDate(val) {
      if (!val) return;
      this.setData({ calendarMaxDate: this.transformDate(val) });
    },
    processValue(val) {
      if (!this.isEmpty(val)) {
        this.setData({ noteText: '', calendarValue: '' });
        return;
      }
      let date = null;
      if (Array.isArray(val)) {
        date = val.map((item) => this.transformDate(item));
      } else {
        date = this.transformDate(val);
      }
      this.setData({ calendarValue: date }, () => this.getNoteText(date));
    },
    openPicker() {
      this.setData({ visible: true });
    },
    handleConfirm(e) {
      const date = e.detail.value;
      let confirmValue = null;
      if (Array.isArray(date)) {
        confirmValue = date.map((item) => dayjs(item).format('YYYY-MM-DD'));
      } else {
        confirmValue = dayjs(date).format('YYYY-MM-DD');
      }
      this.triggerEvent('confirm', confirmValue);
      this.getNoteText(confirmValue);
    },
    onClose() {}
  }
});
