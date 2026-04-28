# 基于微信小程序的项目使用说明

本项目为微信小程序模板，集成自定义导航栏、表单组件、列表加载、请求封装等能力，适合作为业务起步工程使用。

## 快速开始
- 环境准备
  - 安装微信开发者工具（基础库建议 `3.8.11` 及以上）。
  - 安装 Node.js（建议 `>=16`），用于管理 `npm` 依赖。
- 安装依赖
  - 在项目根目录执行：`npm install`
  - 打开微信开发者工具，导入项目后勾选“使用 npm”，并执行“工具 → 构建 npm”。
- SASS 支持
  - 项目使用 `scss`，`project.config.json` 已启用编译插件：`useCompilerPlugins: ["sass"]`，导入后即可正常编译。
- 运行
  - 在微信开发者工具中选择对应 `appid` 项目运行调试（`project.config.json` 中已有 `appid` 配置）。

## 目录结构
- `assets/` 静态资源（图片、样式变量）
- `components/` 业务基础组件（`Form*`、`PageLayout`、`PullDownRefresh`、`Tree*` 等）
- `config/` 运行配置（`env.js` 环境请求前缀、`tabbar.js` 自定义底部导航）
- `custom-tab-bar/` 自定义底部导航栏组件
- `hooks/` 自定义逻辑钩子（如 `use-view-list` 列表加载）
- `pages/` 主包页面（`index`、`form`、`list`、`login`、`mine`）
- `subpackages/` 分包页面（如 `list-detail`）
- `utils/` 工具函数（`http` 请求、`cache` 缓存、`intercept-navigate` 路由拦截）
- 根文件：`app.js`、`app.json`、`app.scss`、`project.config.json`、`package.json`、`sitemap.json`

## 第三方依赖
- UI 组件库：`tdesign-miniprogram`、`@vant/weapp`
  - 页面或组件中通过 `usingComponents` 引入，例如：
    ```
    "usingComponents": {
      "t-button": "tdesign-miniprogram/button/button",
      "t-input": "tdesign-miniprogram/input/input"
    }
    ```
  - 安装后需在微信开发者工具执行“构建 npm”，生成 `miniprogram_npm` 目录供运行时使用。
- 日期库：`dayjs`

## 配置说明
- 请求前缀 `config/env.js`
  - 根据运行环境从本地缓存 `envVersion` 获取前缀，默认映射为：
    - `develop` → `https://68ac2b087a0bbe92cbb97fa3.mockapi.io`
    - `trial` → `https://trial/api`
    - `release` → `https://release/ap`
  - 启动时在 `app.js` 通过 `wx.getAccountInfoSync()` 写入 `envVersion`，可按需修改映射。
- 自定义底部导航 `config/tabbar.js`
  - 通过 `tabBar.custom: true` + `custom-tab-bar` 组件实现，条目由 `Tabbar` 配置数组驱动。
- 页面与窗口 `app.json`
  - 主包页面路由、分包配置、`tabBar`、`window`、`componentFramework: "glass-easel"` 等均在此定义。

## 登录与路由拦截
- 缓存键
  - `TOKEN`：登录态令牌，通过 `utils/cache.js` 读写。
- 路由拦截
  - 在 `app.js` 初始化时接入 `utils/intercept-navigate.js`，重写 `navigateTo/redirectTo/switchTab/reLaunch`，未登录时统一跳转登录页。
  - 白名单 `WhiteList` 可在 `utils/intercept-navigate.js` 中维护，默认全量受控。
- 示例登录
  - `pages/login/login` 中模拟登录，成功后调用 `setToken('token-test')` 并根据来源页跳转。

## 请求封装与文件能力
- 请求封装 `utils/http.js`
  - 自动拼接环境前缀，注入 `authorization` 头；未登录触发拦截；超时与 POST 错误信息统一提示。
  - 使用示例：
    ```js
    import http from '../../utils/http';
    http({ url: '/api/v1/users', data: { page: 1, limit: 10 } }).then(res => {
      // 处理数据
    });
    ```
- 文件预览
  - `previewDocument(url, fileType, isNativeUrl = true)` 支持 `doc/docx/xls/xlsx/ppt/pptx/pdf`，可预览直链或后端下载接口。
- 文件上传
  - `uploadFile(file)` 通过后端上传接口实现，成功返回上传结果。

## 列表页数据加载
- 钩子 `hooks/use-view-list.js`
  - 统一处理分页参数、滚动触底、数据合并与 `Page` 的 `setData` 更新。
  - 使用示例（参考 `pages/list/list.js`）：
    ```js
    import useViewList from '../../hooks/use-view-list';
    const { getList, useView, handleReachBottom } = useViewList({
      url: '/api/v1/users',
      params: { keyWord: 'k', category: '1' },
      context: this,
      isPage: false
    });
    this.setData({ useView, handleReachBottom });
    getList();
    ```

## 基础组件
- 布局 `components/PageLayout`
  - 支持自定义头部导航、返回行为、标题与底部 Tabbar 占位；配合 `navigationStyle: "custom"` 使用。
- 表单组件 `components/Form*`
  - 包含选择器、日期、日期范围、单选/多选、搜索、上传、日历等常用能力，页面通过 `usingComponents` 引入并以事件回调获取值。
- 刷新组件 `components/PullDownRefresh`
  - 提供下拉刷新联动（示例见列表页）。
- 树组件 `components/Tree` 与 `TreePopup`
  - 支持异步加载、禁用节点与选中联动（参考表单页示例）。

## 页面说明
- `pages/index` 首页，演示自定义 Tabbar 选中状态。
- `pages/form` 表单演示页，集成多个基础组件与交互示例。
- `pages/list` 列表演示页，包含搜索、筛选、下拉刷新与触底加载。
- `pages/login` 登录页，示例记住密码与登录后跳转逻辑。
- `pages/mine` 个人中心占位页。
- 分包 `subpackages/list-detail` 列表详情演示页。

## 发布与上传
- 在微信开发者工具中完成真机测试后，按流程“上传代码 → 提交审核 → 发布”。
- 如使用 `npm` 依赖，确保每次变更后均执行“构建 npm”并上传所需产物。

## 常见问题
- 构建 npm 失败
  - 确认勾选“使用 npm”，删除 `miniprogram_npm` 后重新构建；必要时清空微信开发者工具缓存。
- 样式不生效
  - 确认开启 `sass` 编译插件；检查 `*.scss` 文件路径与引用是否正确。
- 请求前缀异常
  - 根据实际环境调整 `config/env.js` 映射；或在启动阶段写入指定 `envVersion`。

## 许可证
- 本模板仅用于学习与内部项目初始化，按需修改与扩展。

