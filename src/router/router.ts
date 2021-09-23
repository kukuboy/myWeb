/*
 * @Description: 路由页面
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-04-30 15:48:44
 * @LastEditors: 水印红枫
 */

/**
 * meta 可配置参数
 * @param {boolean} icon 页面icon
 * @param {boolean} keepAlive 是否缓存页面
 * @param {string} title 页面标题
 */
 const page500 = {
  path: "/500",
  name: "error_500",
  hidden: true,
  meta: {
    title: "500-服务端错误"
  },
  component: () => import("@/views/error_page/500/500.vue")
};
 const page404 = {
  path: "/*",
  name: "error_404",
  hidden: true,
  meta: {
    title: "404-页面不存在"
  },
  component: () => import("@/views/error_page/404/404.vue")
};
export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/pages/home/home.vue'),
    meta: {
      icon: '',
      keepAlive: true,
      title: 'home',
      bodyColor: '#ffffff'
    },
  },
  page500,
  page404
];
