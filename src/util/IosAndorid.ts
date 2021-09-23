/*
 * @Description: app功能函数
 * @Author: ths
 * @Date: 2020-07-02 16:46:07
 * @LastEditors: 水印红枫
 */

export default {
  checkJsBridge(): void {
    try {
      this.connectWebViewJavascriptBridge((bridge: any) => {
        // eslint-disable-next-line no-unused-vars
        bridge.init((message: any, responseCallback: any) => {
          console.log("checkJsBridge", message, responseCallback)
        });
      });
    } catch (e) {
      const timer = setTimeout(() => {
        this.checkJsBridge();
        clearTimeout(timer);
      }, 100);
    }
  },
  // 是否安卓系统
  isAndroid:
    /Android/.test(window.navigator.userAgent) ||
    /Linux/.test(window.navigator.userAgent),
  // 是否苹果手机
  isIphone:
    /Iphone/.test(window.navigator.userAgent) ||
    /iPhone/.test(window.navigator.userAgent),
  /**
   * 调用客户端方法封装函数
   * @param callback function 回调函数
   */
  connectWebViewJavascriptBridge(callback: any): void {
    if (window.WebViewJavascriptBridge) {
      callback(window.WebViewJavascriptBridge);
    } else {
      document.addEventListener(
        "WebViewJavascriptBridgeReady",
        () => {
          callback(window.WebViewJavascriptBridge);
        },
        false
      );
    }
  },
  /**
   * 客户端回退方法
   * @param params 调用方法的入参
   */
  goBackAction(params = {}): void {
    try {
      this.connectWebViewJavascriptBridge((bridge: any) => {
        // eslint-disable-next-line no-unused-vars
        bridge.callHandler("goback", params, (response: any) => {
          console.log("goBackAction", response)
        });
      });
    } catch (e) {
      alert("当前版本不支持！请更新！");
    }
  },
  /**
   * 客户端登录方法
   * @param params 调用方法的入参
   */
  getClientInfo(params: any = {}) {
    return new Promise((resolve, reject) => {
      params.info_type = params.info_type ? params.info_type : "wt";
      params.call_type = params.call_type
        ? params.call_type
        : "callback_after_login";
      try {
        this.connectWebViewJavascriptBridge((bridge: any) => {
          bridge.callHandler("getUserInfoByRsa", params, (response: any) => {
            if (response) {
              resolve(response);
            } else {
              reject(new Error("用户信息查询失败!"));
            }
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  /**
   * 客户端分享方法
   * @param params 调用方法的入参
   */
  share(params = {}) {
    return new Promise((resolve, reject) => {
      try {
        this.connectWebViewJavascriptBridge((bridge: any) => {
          // eslint-disable-next-line no-unused-vars
          bridge.callHandler("hexinShare", params, (response: any) => {
            console.log("share", response)
            resolve(response)
          });
        });
      } catch (e) {
        reject(e)
        alert("ShareError: " + JSON.stringify(e));
      }
    })
  },
  /**
   * 客户端支付方法
   * @param params 调用方法的入参
   */
  hxPay(params = {}) {
    return new Promise((resolve, reject) => {
      try {
        this.connectWebViewJavascriptBridge((bridge: any) => {
          // eslint-disable-next-line no-unused-vars
          bridge.callHandler("hxPay", params, (response: any) => {
            console.log("hxPay", response)
            resolve(response)
          });
        });
      } catch (e) {
        alert("ShareError: " + JSON.stringify(e));
        reject(e)
      }
    })
  }
};
