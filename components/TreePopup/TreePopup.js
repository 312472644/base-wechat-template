import properties from '../FormItem/properties';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ...properties,
    // 节点数据
    nodes: {
      type: Array,
      value: []
    },
    props: {
      type: Object,
      value: {
        label: 'label',
        disabled: null
      }
    },
    // 节点回显列表，存放的节点id列表
    value: {
      type: Array,
      value: []
    },
    // 是否为懒加载
    lazy: {
      type: Boolean
    },
    /**
     * 加载子树数据的方法，仅当 lazy 属性为true 时生效。使用不能直接在data中定义方法，而是要将方法赋值给data中的某个属性。返回的是Promise对象
     * @example 
     * this.setData({
          loadNode: this.loadNodeCall
      });
      loadNodeCall(e) {
        const id = e.id;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { id: id + '-1', label: '子节点1', children: [] },
              { id: id + '-2', label: '子节点2', children: [] }
            ]);
          }, 300);
        });
      },
     */
    load: {
      type: Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    noteText: '',
    visible: false
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
    renderNote(e) {
      this.getNoteText(e.detail);
    },
    getNoteText(list = []) {
      const label = this.data.props?.label || 'label';
      const note = (list || []).map((item) => item[label]).join('、');
      this.setData({ noteText: note });
    },
    handleConfirm() {
      const tree = this.selectComponent('#tree');
      const checkList = tree.data.checkList || [];
      if (!checkList.length) {
        wx.showToast({
          title: '请选择节点',
          icon: 'none'
        });
        return;
      }
      this.getNoteText(checkList);
      this.triggerEvent('confirm', checkList);
      this.setData({ visible: false });
    },
    onCheckedChange(e) {
      this.triggerEvent('check', e.detail);
    }
  }
});
