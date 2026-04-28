import http from '../utils/http';

/**
 * 获取列表数据
 * @param {*} config
 * @param {string} config.url - 请求的URL地址
 * @param {Object} config.params - 请求参数
 * @param {Object} config.context - 调用的Page或Component实例
 * @param {boolean} [config.isPage=true] - 是否分页加载
 * @param {Function} [config.transFormData] - 数据转换函数，用于处理返回的数据
 * @returns {Object} 返回一个包含列表数据和相关方法的对象
 * @example
 * const { useView, getDataList, handleReachBottom } = useViewList({
 *   url: '/api/data/list',
 *   params: { type: 'example' },
 *   context: this,
 *   isPage: true,
 *   transFormData: (data) => data.map(item => ({ ...item, transformed: true }))
 * });
 */
const useViewList = (config) => {
  // 缓存配置
  const cacheData = {};

  const queryForm = {
    page: 1,
    limit: 10,
    total: 0,
    list: [],
    loading: false,
    hasMore: true
  };

  // 对外提供的Page Data数据
  const useView = {
    list: [],
    total: 0,
    hasMore: true
  };

  function getConfig() {
    const { url, params, context, isPage, transFormData } = config || {};

    if (!cacheData.url) {
      cacheData.url = url;
    }
    if (!cacheData.params) {
      cacheData.params = params || {};
    }
    if (!cacheData.context) {
      cacheData.context = context || {};
    }
    if (cacheData.isPage === undefined) {
      cacheData.isPage = isPage;
    }
    if (!cacheData.transFormData) {
      cacheData.transFormData = transFormData;
    }
    return {
      url: cacheData.url,
      params: cacheData.params,
      context: cacheData.context,
      isPage: cacheData.isPage !== undefined ? cacheData.isPage : true,
      transFormData: cacheData.transFormData
    };
  }

  function getQueryParams(isPage, params) {
    let queryParams = { ...params };
    if (isPage) {
      queryParams = {
        ...queryParams,
        page: queryForm.page,
        limit: queryForm.limit
      };
    }
    return filterQueryParams(queryParams);
  }

  function filterQueryParams(queryParams) {
    if (!queryParams) return {};
    const params = {};
    for (const [key, value] of Object.entries(queryParams)) {
      if (!(value === null || value === undefined || value === '')) {
        params[key] = value;
      }
    }
    return params;
  }

  /**
   * 获取数据列表
   * @param {*} config
   */
  function getList(isScrollTrigger = false) {
    if (queryForm.loading) return;
    const { url, context, params, isPage, transFormData } = getConfig();
    const queryParams = getQueryParams(isPage ?? true, params);

    return new Promise((resolve) => {
      wx.showLoading({ title: '加载中' });
      queryForm.loading = true;

      http({ url: url, data: queryParams })
        .then((res) => {
          // 可自行修改返回，查询接口返回数据结构
          const response = {
            code: 0,
            data: res,
            total: res.length
          };
          if (response.code === 0) {
            const total = response.data.total || response.data.length;
            const record = response.data.list || response.data;
            queryForm.total = total;
            // 是否为滚动加载
            if (isScrollTrigger) {
              queryForm.list = [...queryForm.list, ...record];
            } else {
              queryForm.list = record;
              queryForm.page = 1;
            }
            // 更新Page Data数据
            context.setData({
              'useView.list': typeof transFormData === 'function' ? transFormData(queryForm.list) : queryForm.list,
              'useView.total': total,
              'useView.hasMore': total > queryForm.list.length
            });
            resolve(record);
          }
        })
        .finally(() => {
          queryForm.loading = false;
          setTimeout(() => wx.hideLoading(), 500);
        });
    });
  }

  /**
   * 滚动触底事件
   * @returns
   */
  function handleReachBottom() {
    if (!queryForm.hasMore || queryForm.loading) return;
    if (queryForm.list.length >= queryForm.total) {
      console.warn('已加载全部数据');
      return;
    }
    queryForm.page += 1;
    getList(true);
  }

  return {
    useView,
    getList,
    handleReachBottom
  };
};

export default useViewList;
