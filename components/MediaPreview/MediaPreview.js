// components/MediaPreview/MediaPreview.js
import properties from '../FormItem/properties.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ...properties,
    urls: {
      type: Array,
      value: [],
      observer: 'process'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mediaList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMediaType(url) {
      return url.split('.').pop().toLocaleLowerCase();
    },
    isImage(type) {
      return ['jpeg', 'png', 'gif', 'bmp', 'webp'].includes(type);
    },
    isVideo(type) {
      return ['mp4', 'webm', 'ogg', 'x-flv', 'x-matroska'].includes(type);
    },
    process(val) {
      // 如果url无法区别媒体类型，也可以手动指定媒体类型（isImage，isVideo）
      const mediaList = (val || []).map((item) => {
        const fielType = this.getMediaType(item.url);
        return {
          ...item,
          isImage: this.isImage(fielType) || item.isImage,
          isVideo: this.isVideo(fielType) || item.isVideo
        };
      });
      this.setData({ mediaList });
    },
    handlePreview(e) {
      const item = e.currentTarget.dataset.item;
      if (item.isImage) {
        wx.previewImage({
          urls: [item.url],
          current: 0
        });
      } else if (item.isVideo) {
        wx.previewMedia({
          sources: [{ url: item.url, type: 'video' }],
          current: 0
        });
      }
    }
  }
});
