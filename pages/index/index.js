Page({
  data: {},
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive(0);
    }
  },
  onLoad() {},
  handleSubmit() {}
});
