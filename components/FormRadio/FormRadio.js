// components/FormRadio/FormRadio.js
import properties from '../FormItem/properties.js';

Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/radio
   */
  properties: {
    ...properties,
    options: {
      type: Array,
      value: []
    },
    props: {
      type: Object,
      value: {
        label: 'label',
        value: 'value',
        content: 'content'
      }
    },
    block: {
      type: Boolean,
      value: true
    },
    borderless: {
      type: Boolean,
      value: false
    },
    // 是否为卡片
    isCard: {
      type: Boolean,
      value: false
    },
    value: {
      type: [String, Number, Boolean]
    },
    readonly: {
      type: Boolean,
      value: false
    },
    // 'circle' | 'line' | 'dot'
    icon: {
      type: String,
      value: 'dot'
    },
    placement: {
      type: String,
      value: 'left'
    },
    allowUncheck: {
      type: Boolean
    },
    title: {
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
    handleChange(e) {
      const value = e.detail.value;
      this.setData({ value });
      this.triggerEvent('change', value);
    }
  }
});
