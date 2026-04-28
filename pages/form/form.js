// pages/form/form.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    originCitys: [],
    citys: [],
    form: {
      city: [140000],
      date: '2025-08-29',
      startValue: '2025-08-01',
      endValue: '2025-08-29',
      radioValue: 'a',
      checkValue: ['a', 'b'],
      multipleValue: [1, 2],
      calendarValue: '2025-08-29'
    },
    radioOptions: [
      { value: 'a', label: '单选', content: '描述信息' },
      { value: 'b', label: '单选' },
      { value: 'c', label: '单选' }
    ],
    checkboxOptions: [
      { value: 'a', label: '多选1', content: '描述信息' },
      { value: 'b', label: '多选2' },
      { value: 'c', label: '多选3' },
      { value: 'd', label: '多选3' },
      { value: 'e', label: '多选4' }
    ],
    mediaUrls: [
      { url: 'https://tdesign.gtimg.com/mobile/demos/image1.jpeg', name: '图片1' },
      { url: 'https://picsum.photos/200/300', name: '图片2', isImage: true },
      { url: 'https://picsum.photos/200/300', name: '图片3', isImage: true },
      { url: 'https://picsum.photos/200/300', name: '图片4', isImage: true },
      { url: 'https://www.runoob.com/try/demo_source/movie.mp4', name: '视频1', isVideo: true }
    ],
    multipleProps: { label: 'name', value: 'key' },
    multipleOptions: new Array(10).fill({}).map((item, index) => ({ key: index + 1, name: '选项' + (index + 1) })),
    files: [
      {
        url: 'https://tdesign.gtimg.com/mobile/demos/example4.png',
        name: 'uploaded1.png'
      },
      {
        url: 'https://tdesign.gtimg.com/mobile/demos/example6.png',
        name: 'uploaded2.png'
      }
    ],
    nodes: [
      {
        id: 1,
        label: 'Level one 1',
        children: []
      },
      {
        id: 2,
        label: 'Level one 2',
        children: [
          {
            id: 5,
            label: 'Level two 2-1'
          },
          {
            id: 6,
            label: 'Level two 2-2'
          }
        ]
      }
    ],
    value: ['1-1-1', '1-1-2'],
    props: {
      disabled(node) {
        return node.id == 1 || node.id == 2 || node.id == 4 || node.id == 10;
      }
    },

    loadNode: {}
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive(1);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      loadNode: this.loadNodeCall
    });
    this.getCityData();
  },
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
  getCityData() {
    wx.request({
      url: 'https://m1.apifoxmock.com/m1/5220488-4887033-default/api/citys',
      success: (res) => {
        const features = res.data.features || [];
        const citys = features.map((item) => {
          return { label: item.properties.name, value: item.properties.adcode };
        });
        this.setData({
          citys,
          originCitys: [...citys]
        });
      }
    });
  },
  handleConfirm(e) {
    console.log('选中事件', e.detail);
  },
  handleSearch(e) {
    const value = e.detail;
    const citys = this.data.citys.filter((item) => item.label.indexOf(value) !== -1);
    this.setData({ citys: value ? citys : this.data.originCitys });
  },
  handleDateConfirm(e) {
    console.log('获取日期', e.detail);
  },
  handleDateRangeConfirm(e) {
    console.log('获取日期范围', e.detail);
  },
  handleRadioChange(e) {
    console.log('单选框', e.detail);
  },
  handleCheckboxChange(e) {
    console.log('复选框', e.detail);
  },
  handleMultipleConfirm(e) {
    console.log('下拉多选', e.detail);
  },
  handleFileChange(e) {
    console.log('文件上传', e.detail);
  },
  handleCalendar(e) {
    console.log('日历选择', e.detail);
  },
  handleReset() {
    const form = {
      city: [],
      date: '',
      startValue: '',
      endValue: '',
      radioValue: '',
      checkValue: [],
      calendarValue: [],
      multipleValue: []
    };
    this.setData({ form });
  },
  onTreeCheckedChange(e) {
    console.log('e', e.detail);
  },
  handleSubmit() {
    console.log('form表单', this.data.form);
  }
});
