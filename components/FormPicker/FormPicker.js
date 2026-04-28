import properties from '../FormItem/properties';

Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/picker
   */
  properties: {
    // 标题文字
    popupTitle: {
      type: String,
      value: '请选择'
    },
    // 列表数据源
    options: {
      type: Array,
      value: [],
      observer: 'observer'
    },
    // 选中值显示picker的列表
    value: {
      type: Array,
      observer: 'observer'
    },
    // value / label 在 options 中对应的字段别名
    props: {
      type: Object,
      value: {
        label: 'label',
        value: 'value'
      }
    },
    // 是否显示搜索框
    showSearch: {
      type: Boolean,
      value: false
    },
    // 格式化标签。(option: PickerItemOption, columnIndex: number) => PickerItemOption
    formatter: {
      type: Function
    },
    searchPlaceholder: {
      type: String,
      value: '输入关键字'
    },
    ...properties
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    keyWord: '',
    selected: {},
    noteText: '',
    PickerRef: null
  },
  lifetimes: {
    attached() {
      this.setData({
        PickerRef: this.selectComponent('#t-picker')
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openPicker() {
      this.setData({ visible: true });
    },
    handleClose() {
      this.setData({ visible: false });
      this.triggerEvent('close');
    },
    handleConfirm() {
      const columnIndexes = this.data.PickerRef.getColumnIndexes();
      const { index } = columnIndexes?.[0] || [];
      const options = this.data.options;
      const selected = options[index];
      const { label } = this.data.props;
      const note = selected[label];
      this.setData({
        visible: false,
        selected: options[index],
        noteText: note
      });
      this.triggerEvent('confirm', selected);
    },
    handleSearch(e) {
      const value = e.detail.value;
      this.setData({ keyWord: value });
      this.triggerEvent('search', value);
    },
    observer() {
      const values = this.data.value;
      if (!Array.isArray(values)) {
        console.warn('value 必须为数组');
        return;
      }
      const { label, value } = this.data.props;
      const selected = this.data.options.find((item) => item[value] === values[0]) || {};
      const noteText = selected?.[label] || '请选择';
      this.setData({ selected, noteText });
    }
  }
});
