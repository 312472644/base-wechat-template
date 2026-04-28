// components/FormMultiplePicker/FormMultiplePicker.js
import properties from '../FormItem/properties';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ...properties,
    options: {
      type: Array,
      value: [],
      observer: 'process'
    },
    value: {
      type: Array,
      value: [],
      observer: 'process'
    },
    props: {
      type: Object,
      value: {
        label: 'label',
        value: 'value'
      },
      required: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    noteText: '',
    processOptions: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    process() {
      const props = this.data.props;
      const selectList = this.data.value;
      const options = this.data.options;
      const newOptions = (options || []).map((item) => {
        const itemValue = item[props.value];
        const itemLabel = item[props.label];
        const active = selectList.includes(itemValue) || false;
        return { ...item, label: itemLabel, value: itemValue, active };
      });
      this.setData({ processOptions: newOptions });
      this.getNoteText();
    },
    getNoteText(list = []) {
      const selectList = list.length > 0 ? list : this.data.processOptions.filter((item) => item.active) || [];
      const props = this.data.props;
      const text = selectList.map((item) => item[props.label]).join('、');
      this.setData({ noteText: text });
    },
    handleConfirm() {
      const selectList = this.data.processOptions.filter((item) => item.active) || [];
      this.getNoteText(selectList);
      this.setData({ visible: false });
      this.triggerEvent('confirm', selectList);
    },
    handleClick(e) {
      const row = e.currentTarget.dataset.item;
      const item = this.data.processOptions.find((t) => row.value === t.value);
      item.active = !item.active;
      this.setData({ processOptions: [...this.data.processOptions] });
    },
    handleClose() {
      this.setData({ visible: false });
    },
    openPicker() {
      this.setData({ visible: !this.data.visible });
    }
  }
});
