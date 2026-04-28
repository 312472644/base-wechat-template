import properties from '../FormItem/properties';
import { uploadFile } from '../../utils/http';

Component({
  /**
   * 组件的属性列表
   * @example https://tdesign.tencent.com/miniprogram/components/upload?tab=demo
   */
  properties: {
    ...properties,
    disabled: {
      type: Boolean,
      value: false
    },
    mediaType: {
      type: Array,
      value: ['image']
    },
    config: {
      type: Object
      // value: {
      // 上传视频和图片。album、camera。
      // sourceType: {},
      // 上传视频。back、front。
      // camera: {}
      // }
    },
    max: {
      type: Number,
      value: 0
    },
    files: {
      type: Array,
      value: [],
      observer: 'process'
    },
    sizeLimit: {
      type: Object,
      value: {
        size: 4,
        unit: 'MB',
        message: '图片大小不超过 {sizeLimit} MB'
      }
    },
    // media/messageFile
    source: {
      type: String,
      value: 'media'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    process(files = []) {
      this.setData({ fileList: files });
    },
    handleAdd(e) {
      const files = e.detail.files || [];
      const uploadPromiseList = files.map((item) => {
        return uploadFile(item);
      });
      Promise.all(uploadPromiseList).then((res) => {
        const response = (res || []).map((item) => {
          const url = item.url;
          return {
            url,
            name: url.split('/').slice(-1)[0]
          };
        });
        this.setData({ fileList: this.data.fileList.concat(response) });
        this.triggerEvent('change', this.data.fileList);
      });
    },
    handleRemove(e) {
      const index = e.detail.index;
      this.data.fileList.splice(index, 1);
      this.setData({ fileList: [...this.data.fileList] });
      this.triggerEvent('change', this.data.fileList);
    },
    handleFail() {
      wx.showToast({
        title: '上传附件失败',
        icon: 'none'
      });
    }
  }
});
