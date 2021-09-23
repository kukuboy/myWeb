/*
 * @Description: 挂载组件
 * @Author: 水印红枫
 * @Date: 2020-07-02 16:46:07
 * @LastEditors: 水印红枫
 */

import { createApp, App } from "vue";
import Toast from "./toast.vue";
import TipShadow from "./tipShadow.vue";
import Confirm from "./confirm.vue";
import ViewLoading from "./viewLoading.vue";
export interface Dialog {
  install(app: App): void,
  Toast(options?: { content: string }): void,
  ViewLoading(options?: any): void,
  TipShadow(options?: any): void,
  // Confirm(options?: any): void
}
export default {
  install(app: App) {
    Object.defineProperty(app.config.globalProperties, "$dialog", {
      value: this,
      writable: false
    });
  },
  Toast(options) {
    const vm = document.getElementById("Toast");
    if (vm !== null) {
      document.body.removeChild(vm);
    }
    const div = document.createElement("div");
    div.id = "Toast";
    document.body.appendChild(div);
    createApp(Toast, options).mount("#Toast")
    // if (typeof options === "object") {
    //   Object.assign($vm, options);
    // } else if (typeof options === "string" || typeof options === "number") {
    //   $vm.content = options;
    // }
  },
  TipShadow(options = {}) {
    const vm = document.getElementById("TipShadow");
    if (vm !== null) {
      document.body.removeChild(vm);
    }
    const div = document.createElement("div");
    div.id = "TipShadow";
    document.body.appendChild(div);
    createApp(TipShadow, options).mount("#TipShadow")
  },
  // Confirm(options = {}) {
  //   const vm = document.getElementById("Confirm");
  //   if (vm !== null) {
  //     document.body.removeChild(vm);
  //   }
  //   const div = document.createElement("div");
  //   div.id = "Confirm";
  //   document.body.appendChild(div);
  //   const ConfirmFrame = Vue.extend(Confirm);
  //   const $vm = new ConfirmFrame({
  //     el: "#Confirm"
  //   });
  //   if (typeof options === "object") {
  //     Object.assign($vm, options);
  //   } else if (typeof options === "string" || typeof options === "number") {
  //     $vm.content = options;
  //   }
  // },
  ViewLoading(options = { state: "begin" }) {
    const vm = document.getElementById("ViewLoading");
    if (vm !== null) {
      document.body.removeChild(vm);
    }
    if (options.state === "end") {
      return;
    }
    const div = document.createElement("div");
    div.id = "ViewLoading";
    document.body.appendChild(div);
    createApp(ViewLoading, options).mount("#ViewLoading")
  }
} as Dialog;
