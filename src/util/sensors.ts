/*
 * @Description:
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-03-16 15:54:52
 * @LastEditors: 水印红枫
 */
import { checkPlatform, getQueryVariable } from "@/util/myUtil";
import { App } from "vue";
import store from "@/store";
export const sensors = require("sa-sdk-javascript");
export interface Sensors {
  install(app: App): void,
  trackView(): void,
  trackClick(button_name: string, operation_type: string): void,
  trackFinsh(button_name: string, operation_type: string, task_level: string, prize_id: string, prize_name: string, prize_type: string, prize_count: number): void,
  trackShare(): void,
  trackSlide(slid_type: string): void
}
const channel =
  getQueryVariable("channel") || sessionStorage.getItem("channel") || "0";
sessionStorage.setItem("channel", channel);
const atv_name = "618活动";
const atv_id = 2;
const atv_type = "618活动";
export default {
  install(app: App) {
    try {
      Object.defineProperty(app.config.globalProperties, "$sensors", {
        value: this, // 设置值
        writable: false // 是否可以改变，默认false，更改会报undefined
      });
      // console.log(process.env.VUE_APP_SERVERURL)
      sensors.init({
        // server_url: "http://125.46.87.138:8106/sa?project=default", // 测试
        // server_url: "https://znyydata.ccnew.com.cn:8106/sa?project=online_test", //预生产环境：
        // server_url: "https://znyydata.ccnew.com.cn:8106/sa?project=production", //生产环境：
        server_url: process.env.VUE_APP_SASERVERURL,
        show_log: "true",
        is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
        use_client_time: true,
        send_type: "beacon",
        app_js_bridge: checkPlatform() === 'hexin', // app打通
        heatmap: {
          // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
          clickmap: "default",
          // 是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
          scroll_notice_map: "not_collect"
        }
      });
      sensors.registerPage({
        current_url: location.href,
        referrer: document.referrer
      });
      sensors.quick("autoTrack"); // 用于采集 $pageview 事件。
    } catch (e: unknown) {
      console.log("神策埋点初始化出错:", e)
    }
  },
  trackView() {
    try {
      sensors.track("Atv_First_Detail", {
        channel,
        atv_name,
        atv_id,
        atv_type,
        atv_page_title: store.state.currentPage.meta.title
      });
    } catch (e: unknown) {
      console.log("神策埋点trackView出错:", e)
    }
  },
  trackClick(button_name: string, operation_type: string) {
    try {
      sensors.track("Atv_Operation_Click", {
        channel,
        atv_name,
        atv_id,
        atv_type,
        atv_page_title: store.state.currentPage.meta.title,
        button_name,
        operation_type
      });
    } catch (e: unknown) {
      console.log("神策埋点初始化出错:", e)
    }
  },
  trackFinsh(button_name: string, operation_type: string, task_level: string, prize_id: string, prize_name: string, prize_type: string, prize_count: number) {
    try {
      sensors.track("Atv_Operation_Finish", {
        channel,
        atv_name,
        atv_id,
        atv_type,
        atv_page_title: store.state.currentPage.meta.title,
        button_name,
        operation_type,
        task_level,
        prize_id,
        prize_name,
        prize_type,
        prize_count
      });
    } catch (e: unknown) {
      console.log("神策埋点trackFinsh出错:", e)
    }
  },
  trackShare() {
    try {
      sensors.track("Atv_Share_Result", {
        channel,
        atv_name,
        atv_id,
        atv_type,
        atv_page_title: store.state.currentPage.meta.title
      });
    } catch (e: unknown) {
      console.log("神策埋点trackShare出错:", e)
    }
  },
  trackSlide(slid_type: string) {
    try {
      sensors.track("Atv_Slid_Result", {
        channel,
        atv_name,
        atv_id,
        atv_type,
        atv_page_title: store.state.currentPage.meta.title,
        slid_type
      });
    } catch (e: unknown) {
      console.log("神策埋点trackSlide出错:", e)
    }
  }
} as Sensors;
