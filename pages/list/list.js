import useViewList from '../../hooks/use-view-list';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryOptions: [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' }
    ],
    form: {
      keyWord: '',
      date: '',
      category: []
    },
    useView: {},
    handleReachBottom: null,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDataList();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive(2);
    }
  },
  getQueryParams() {
    const queryParams = { ...this.data.form };
    queryParams.category = queryParams.category.length ? queryParams.category[0].value : '';
    return queryParams;
  },
  getDataList() {
    const { getList, useView, handleReachBottom } = useViewList({
      url: '/api/v1/users',
      params: this.getQueryParams(),
      context: this,
      isPage: false
    });
    this.setData({ useView, handleReachBottom });
    getList().then(() => {
      this.setData({ downRefresh: false });
    });
  },
  handleDateConfirm(e) {
    const date = e.detail;
    this.setData({ 'form.date': date });
  },
  handleCategoryConfirm(e) {
    const detail = e.detail;
    this.setData({ 'form.category': [detail] });
  },
  handleSearch(e) {
    const detail = e.detail;
    this.setData({ 'form.keyWord': detail });
    this.getDataList();
  },
  handleReset() {
    const form = {
      date: '',
      keyWord: '',
      category: []
    };
    this.setData({ form });
    this.getDataList();
  },
  toDetailPage() {
    wx.navigateTo({
      url: '/subpackages/list-detail/index'
    });
  },
  onReachBottom() {
    console.log('触底了');
    this.data.handleReachBottom();
  },
  onRefresh() {
    this.setData({ downRefresh: true });
    this.getDataList();
  }
});
