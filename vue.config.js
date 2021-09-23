/*
 * @Description:
 * @Author: 水印红枫
 * @Date: 2020-05-25 09:15:19
 * @LastEditTime: 2021-06-21 11:13:53
 * @LastEditors: 水印红枫
 */
// const merge = require("webpack-merge");
// const PrerenderSPAPlugin = require("prerender-spa-plugin");
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// var path = require("path");
const pagesMake = array => {
  const pages = {
    index: {
      // page 的入口
      entry: "src/main.ts",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "中原证券",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  };
  for (const i of array) {
    const arr = i.split(",");
    const index = arr[0];
    pages[index] = JSON.parse(JSON.stringify(pages.index));
    if (arr.length > 1) {
      pages[index].entry = "src/entry/" + arr[1];
    }
    // pages[index].template = "public/" + index + "/index.html";
    pages[index].filename = index + "/index.html";
  }
  return pages;
};

module.exports = {
  // 更改路径，解决空白
  publicPath:
    process.env.NODE_ENV === "production"
      ? process.env.VUE_APP_BASEURL
      : "./",
  // 输出文件目录
  // outputDir: "dist", // 默认dist
  outputDir: "dist" + process.env.VUE_APP_BASEURL, // 默认dist
  // 用于嵌套生成的静态资产（js,css,img,fonts）目录
  // assetsDir: '',
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
  indexPath: "index.html", // Default: 'index.html'
  filenameHashing: true,
  // 构建多页时使用
  pages: pagesMake([]),
  // eslint-loader是否在保存的时候检查
  lintOnSave: true,
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: false,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  transpileDependencies: [],
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  configureWebpack: () => {
    if (process.env.NODE_ENV !== "production") { return; }
    return {
      // plugins: [
      //   new PrerenderSPAPlugin({
      //     // 生成文件的路径，也可以与webpakc打包的一致。
      //     // 下面这句话非常重要！！！
      //     // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
      //     staticDir: path.join(__dirname, "dist"),
      //     // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
      //     routes: ["/HomeView/AnnualBill"],
      //     // 这个很重要，如果没有配置这段，也不会进行预编译
      //     renderer: new Renderer({
      //       inject: {
      //         foo: "bar"
      //       },
      //       headless: false
      //       // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
      //       // renderAfterDocumentEvent: "render-event"
      //     })
      //   })
      // ]
    };
  },
  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 1000, esModule: false }));
    config.module.rule('ts').use('ts-loader')
    // config.resolve.alias.set("@", resolve("src"));
    // config
    //   .plugin("webpack-bundle-analyzer")
    //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
  },
  // // css相关配置
  // css: {
  //   // 启用 CSS modules
  //   modules: false,
  //   // 是否使用css分离插件
  //   extract: true,
  //   // 开启 CSS source maps?
  //   sourceMap: false,
  //   // css预设器配置项
  //   loaderOptions: {}
  // },
  // webpack-dev-server 相关配置
  devServer: {
    hotOnly: false,
    disableHostCheck: true, // 内网穿透时使用
    proxy: {
      "/normalized": {
        target: "http://10.3.176.49:9999",
        changeOrigin: true,
        pathRewrite: {
          "^/normalized": "/normalized"
        }
      }
    },
    before: app => {
      console.log("\n挂载路径：", app.mountpath);
    }
  },
  // PWA 插件相关配置
  pwa: {},
  // 第三方插件配置
  pluginOptions: {}
};
