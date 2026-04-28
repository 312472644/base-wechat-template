import properties from '../FormItem/properties.js';
Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/checkbox?tab=api
   */
  properties: {
    ...properties,
    options: {
      type: Array,
      value: [],
      observer: 'process'
    },
    props: {
      type: Object,
      value: {
        label: 'label',
        value: 'value',
        content: 'content'
      }
    },
    // line | circle | rectangle
    icon: {
      type: String,
      value: 'rectangle'
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
      type: [String, Number, Boolean],
      observer: 'process'
    },
    readonly: {
      type: Boolean,
      value: false
    },
    placement: {
      type: String,
      value: 'left'
    },
    checkAll: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checkAll: false,
    processOptions: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    process() {
      const options = this.data.options || [];
      const checkValueList = this.data.value || [];
      const props = this.data.props;
      const checkAll = this.data.checkAll;
      if (!options.length) return;
      if (checkAll && options?.[0].label !== '全选' && !this.data.isCard) {
        options.unshift({ label: '全选', checkAll: true });
      }
      const newOptions = options.map((item) => {
        return {
          ...item,
          active: checkValueList.includes(item[props.value])
        };
      });
      this.updateCheckAll(checkValueList);
      this.setData({ processOptions: newOptions });
    },
    catchChange(e) {
      const checked = e.detail.checked;
      const options = this.data.options;
      const newOptions = options.map((item) => {
        return {
          ...item,
          active: checked
        };
      });
      const value = newOptions.filter((item) => item.active).map((item) => item[this.data.props.value]);
      this.setData({ processOptions: newOptions, value });
      this.triggerEvent('change', value);
    },
    updateCheckAll(value) {
      const isCard = this.data.isCard;
      if (isCard) {
        const isCheckAll = value.length === this.data.processOptions.length;
        this.setData({ isCheckAll: isCheckAll });
      }
    },
    handleChange(e) {
      const detail = e.detail;
      const value = detail.value;
      this.updateCheckAll(value);
      this.setData({ value });
      this.triggerEvent('change', value);
    }
  }
});
