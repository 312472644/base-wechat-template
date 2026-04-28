// subpackages/list-detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mediaUrls: [
      { url: 'https://tdesign.gtimg.com/mobile/demos/image1.jpeg', name: '图片1' },
      { url: 'https://picsum.photos/200/300', name: '图片2', isImage: true },
      { url: 'https://picsum.photos/200/300', name: '图片3', isImage: true },
      { url: 'https://picsum.photos/200/300', name: '图片4', isImage: true },
      { url: 'https://www.runoob.com/try/demo_source/movie.mp4', name: '视频1', isVideo: true }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {}
});
