/*
 * @Description: 挂载类便捷函数
 * @Author: 水印红枫
 * @Date: 2020-07-10 09:09:16
 * @LastEditors: 水印红枫
 */
// const cookieExpires = 12
import { App } from "vue";
export default {
  install(app: App) {
    Object.defineProperty(app.config.globalProperties, "$kuku", {
      value: this, // 设置值
      writable: false // 是否可以改变，默认false，更改会报undefined
    });
  },
  // setLoaclImage(name, data) {
  //   try {
  //     let local = JSON.parse(localStorage.getItem("kukuImage"));
  //     console.log(local);
  //     local = local === null ? {} : local;
  //     local[name] = data;
  //     localStorage.setItem("kukuImage", JSON.stringify(local));
  //   } catch {
  //     console.log("存储出错，请重新存储");
  //   }
  // },
  // getLoaclImage(name) {
  //   try {
  //     let local = JSON.parse(localStorage.getItem("kukuImage"));
  //     console.log(local);
  //     local = local === null ? {} : local;
  //     return local[name];
  //   } catch {
  //     console.log("存储出错，请重新存储");
  //     return "";
  //   }
  // }
};
