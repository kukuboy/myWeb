/*
 * @Description: 接口文件
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-05-12 09:50:22
 * @LastEditors: 水印红枫
 */
import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import { App } from "vue"
import qs from 'qs';
import Dialog from "@/util/dialog";
import store from "@/store";
import { getQueryVariable } from "@/util/myUtil";
import { a_login } from "@/util/activity";
// import '../common/js/mock/mock'

// 页面接口
import home, { HomeApiType } from "./module/home"

export interface ApiResponse {
  flag: boolean,
  data: any,
  code: number,
  [x: string]: any
}

export interface BaseApi {
  install(app: App): void,
  errorHandler(err: unknown): void
  savePointData(source: number, type: number, bagId?: number, taskId?: number): Promise<boolean>
}
// 页面声明
export interface Api extends BaseApi{
  home: HomeApiType
}

export const httpA = Axios.create({
  timeout: 10000
  // headers: {}
});
export default {
  // TODO: 页面接口api
  // TODO: 首页
  home,
  install(app: App) {
    Object.defineProperty(app.config.globalProperties, "$http", {
      value: this, // 设置值
      writable: false // 是否可以改变，默认false，更改会报undefined
    });
    // httpA.defaults.baseURL = process.env.VUE_APP_BASEURL;
    // httpA.defaults.headers.common['token'] = localStorage.invest_h5_token
    sessionStorage.asking = "\n";
    // 设置请求拦截器
    httpA.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 活动结束拦截接口
        if (
          process.env.VUE_APP_ACTIVITYEND === "true" &&
          new Date().getTime() > Number(process.env.VUE_APP_ACTIVITYENDTIME)
        ) {
          Dialog.Toast({
            content: "活动已结束"
          });
          return Promise.reject(new Error("活动已结束"));
        }
        // 记录请求的接口
        // sessionStorage.asking += "the api:" + config.url + " is asking\n";
        // 未登录拦截对应的接口
        if (
          store.state.loginSign === "" &&
          config.method === "post" &&
          config.data &&
          config.data.sign === "" &&
          config.url &&
          config.url.indexOf("wechat") < 0 &&
          config.url.indexOf("savePointData") < 0
        ) {
          return Promise.reject(new Error("未登录"));
        }
        // 增加sign值
        if (config.data && config.data.sign === "") {
          config.data.sign = store.state.loginSign;
        }
        // 序列化post传递数据
        if (config.method === "post") {
          config.data = qs.stringify(config.data)
        }
        return config;
      },
      err => {
        return Promise.reject(err);
      }
    );
    // 设置响应拦截器
    httpA.interceptors.response.use(
      (res: AxiosResponse<ApiResponse>) => {
        // 去除返回的接口
        // sessionStorage.asking = sessionStorage.asking.replace(
        //   "the api:" + res.config.url + " is asking\n",
        //   ""
        // );
        // 统一判断，如果请求成功返回数据
        if (!res.data.flag && res.data.code !== -1) {
          Dialog.Toast({
            content: res.data.data.msg
          });
        }
        return res;
      },
      (error: AxiosError) => {
        // if (error.config) {
        // 去除返回的接口
        // sessionStorage.asking = sessionStorage.asking.replace(
        //   "the api:" + error.config.url + " is asking\n",
        //   ""
        // );
        // }
        if (error.isAxiosError) {
          Dialog.Toast({
            content: "网络错误，请稍后重试~"
          });
        }
        // console.log(error);
        return Promise.reject(error);
      }
    );
  },
  // TODO: 接口api
  // TODO: 直接调用
  // TODO：错误接口捕捉
  errorHandler(err: unknown) {
    console.log("捕捉到错误:", err, "\n设备号：", store.state.deviceId, "\n账号：", store.state.loginSign);
  },
  // TODO: 数据埋点
  savePointData(source: number, type: number) {
    return new Promise<boolean>(resolve => {
      const toSave = () => {
        let channel: string | number =
          getQueryVariable("channel") || sessionStorage.getItem("channel") || "0";
        sessionStorage.setItem("channel", channel);
        channel = Number(channel)
        const sign = store.state.loginSign;
        const deviceId = store.state.deviceId;
        interface ParmasType {
          sign: string
          deviceId: string
          channel: number
          type: number
          source: number
          openId?: string
        }
        const params: ParmasType = { sign, deviceId, channel, type, source };
        const openId = getQueryVariable("openid");
        if (openId) {
          params.openId = openId
        }
        httpA({
          url: "/monopoly/h5/point/savePointData",
          params,
          method: "POST"
        })
          .then(() => {
            resolve(true);
          })
          .catch(e => {
            resolve(false);
            console.log("埋点调用出错", e);
          });
      };
      if (!store.state.deviceId) {
        a_login("fetch").then(() => {
          toSave();
        });
      } else { toSave(); }
    });
  },
} as Api;