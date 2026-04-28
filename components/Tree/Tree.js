Component({
  properties: {
    // 展示数据
    nodes: {
      type: Array,
      value: [],
      observer: function (newVal) {
        if (!this._hasObservedMyProp && newVal.length > 0) {
          this._hasObservedMyProp = true;
          this.getNodes(newVal);
        }
      }
    },
    props: {
      type: Object,
      value: {
        label: 'label'
      }
    },
    value: {
      type: Array,
      value: [],
      observer: 'processValue'
    },
    // 是否为懒加载
    lazy: {
      type: Boolean
    },
    // 加载子树数据的方法，仅当 lazy 属性为true 时生效
    load: {
      type: Function
    },
    level: {
      type: Number,
      value: 0
    },
    checkedMap: {
      type: Object,
      value: {}
    }
  },
  data: {
    checkList: [],
    treeData: []
  },
  lifetimes: {
    attached() {
      this._hasObservedMyProp = false;
    }
  },
  methods: {
    getNodes(list = []) {
      if (!list?.length) return;
      this.setData({ treeData: this.initNodes(list) });
    },
    initNodes(list) {
      const disabledFn = this.data.props?.disabled;
      const isLazy = this.data.lazy;
      function _processNode(nodes) {
        nodes.forEach((t) => {
          t.disabled = typeof disabledFn === 'function' ? t.disabled || disabledFn(t) : false;
          t.showExpand = isLazy ? (t.hasChildren === false ? false : true) : t.children?.length > 0;
          if (t.children) {
            _processNode(t.children);
          }
        });
      }
      _processNode(list);
      return [...list];
    },
    // 已勾选的数据进行回显
    processValue(list = []) {
      const nodes = this.data.nodes;
      if (!nodes || !list.length) return;
      const checkedMap = {};
      list.forEach((id) => {
        const node = this._findNodeById(nodes, id);
        if (node) {
          checkedMap[id] = { checked: true, data: node };
        }
      });
      const checkList = this.getCheckList(checkedMap) || [];
      this.setData({ checkedMap, checkList });
      this.triggerEvent('render', checkList);
    },
    updateNodes() {
      const newTreeNodes = this.initNodes(this.data.treeData);
      this.setData({ treeData: newTreeNodes });
    },
    toggleNode(e) {
      const nodeId = e.currentTarget.dataset.id;
      const node = this._findNodeById(this.data.treeData, nodeId);
      const lazy = this.data.lazy;

      if (node) {
        // 不需要懒加载
        if (!lazy) {
          node.expanded = !node.expanded;
          this.updateNodes();
          return;
        }
        if (!node.loaded) {
          // 懒加载逻辑
          this._lazyLoad(node);
        } else {
          node.expanded = !node.expanded;
          this.updateNodes();
        }
      }
    },

    _lazyLoad(node) {
      const loadNodeFn = this.data.load;
      if (loadNodeFn) {
        if (typeof loadNodeFn !== 'function') {
          console.warn('loadNode必须为函数');
          return;
        }
        loadNodeFn(node).then((children) => {
          node.children = children;
          node.loaded = true;
          // 点击节点懒加载后，无数据，则不显示节点图标
          node.hasChildren = children.length > 0;
          node.expanded = true;
          this.updateNodes();
          // 懒加载回显已经勾选的节点
          this.processValue(this.data.value || []);
        });
      }
    },

    onCheckChange(e) {
      const checked = e.detail;
      const item = e.currentTarget.dataset.item;
      const id = item.id;
      const allNodes = this._findChildrenById(this.data.treeData, id);

      const checkedMap = this.data.checkedMap;
      allNodes.forEach((item) => {
        const data = { ...item };
        delete data.children;
        checkedMap[item.id] = { checked, data };
      });

      const map = this._filterCheckMap(checkedMap);
      const checkList = this.getCheckList(map);
      this.setData({ checkedMap: map, checkList }, () => {
        this.triggerEvent('change', { checkedMap: map });
        this.triggerEvent('check', checkList);
      });
    },

    getCheckList(checkedMap) {
      const list = [];
      for (const [_, item] of Object.entries(checkedMap)) {
        list.push(item.data);
      }
      return list;
    },

    _filterCheckMap(checkedMap) {
      const map = {};
      for (const [key, item] of Object.entries(checkedMap)) {
        if (item.checked) {
          const data = { ...item.data };
          delete data.children;
          map[key] = { checked: true, data };
        }
      }
      return map;
    },

    _findChildrenById(nodes, id) {
      const result = [];
      const find = (node) => {
        if (node.id === id) {
          result.push(node);
          node.children?.forEach(collect);
          return true;
        }
        return node.children?.some(find) || false;
      };
      const collect = (node) => {
        result.push(node);
        node.children?.forEach(collect);
      };
      nodes.some(find);
      return result;
    },

    _findNodeById(nodes, id) {
      for (const node of nodes) {
        if (node.id === id) return node;

        if (node.children) {
          const found = this._findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },

    onTreeCheckChange(e) {
      const detail = e.detail.checkedMap;
      const checkList = this.getCheckList(detail);
      this.setData({ checkedMap: detail, checkList }, () => {
        this.triggerEvent('change', { checkedMap: detail });
        this.triggerEvent('check', checkList);
      });
    }
  }
});
