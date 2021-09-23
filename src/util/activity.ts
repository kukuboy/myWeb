/*
 * @Description: 活动功能文件
 * @Author: 水印红枫
 * @Editor: 水印红枫, 似水流年
 * @Date: 2020-07-02 16:46:07
 * @LastEditors: 水印红枫
 */
import IOSAndroid from "./IosAndorid";
import { checkPlatform, getQueryVariable, versionCmd } from "./myUtil";
import store, { AllMutationsType } from "@/store";
import { sensors } from "@/util/sensors";
import Axios from "axios";
import Dialog from "./dialog";
import IosAndorid from "./IosAndorid";

const update_state: AllMutationsType["update_state"] = obj => store.commit("update_state", obj)

let loginTime: number | undefined
export { a_login, a_href, a_share };
// TODO:登录
const a_login = (val: "login" | "fetch", notWx = true) => {
  return new Promise<string>(resolve => {
    const plat = checkPlatform();
    if (plat === "hexin") {
      if (val === "login") {
        sessionStorage.setItem("callbackNum", "1");
      } else if (store.state.loginSign) {
        resolve(store.state.loginSign);
        return
      }
      IosAndorid.checkJsBridge()
      IOSAndroid.getClientInfo({
        info_type: "wt",
        call_type: val,
        callback_url: user(),
        key_type: "defaultths",
      }).then((res: any) => {
        console.log("登录返回:", val, res.login_status);
        if (val === "login") {
          versionControl(res.appVersion);
        }
        if (res.login_status === "1") {
          sessionStorage.setItem("callbackNum", "0");
          update_state({ loginSign: res.param })
          // sensors.login(res.param); // app_js_bridge开启后不再需要
          if (!res.param) {
            Dialog.Toast({
              content: "对不起，当前版本不支持，请升级到最新版本后再参与此活动",
            });
          }
        } else {
          update_state({ loginSign: "" })
        }
        try {
          const mobileHardwareArray = res.mobile_hardware.split(",");
          let key;
          if (checkPlatform("plat") === "ios") key = "UDID";
          else key = "IMEI";
          for (const i of mobileHardwareArray) {
            if (i.indexOf(key) >= 0) {
              update_state({ deviceId: i.substring(key.length + 1) })
              break
            }
          }
        } catch (e) {
          console.log(e, "获取设备号失败");
          update_state({ deviceId: "getfail" })
        }
        resolve(store.state.loginSign);
      }).catch((err: unknown) => {
        console.log(err)
        update_state({ loginSign: "" })
        resolve("");
      });
    } else if (plat === "wx" && !notWx) {
      resolve(xwbd(val));
    } else {
      update_state({ deviceId: process.env.VUE_APP_NODE_ENV, loginSign: process.env.VUE_APP_LOGINSIGN || "" })
      console.log("不支持该页面登录");
      // if (process.env.VUE_APP_NODE_ENV === "production") {
      //   Dialog.Toast({
      //     content: "请在中原证券微信官微或财升宝客户端参与后再登录"
      //   });
      // }
      resolve(store.state.loginSign);
    }
  });
};
// TODO:登录回调函数
const user = () => {
  clearTimeout(loginTime);
  let callbackNum = parseInt(sessionStorage.getItem("callbackNum") || "0");
  if (callbackNum > 0 && callbackNum < 50) {
    loginTime = setTimeout(() => {
      callbackNum = parseInt(sessionStorage.getItem("callbackNum") || "0");
      if (callbackNum > 0 && callbackNum < 50) {
        callbackNum++;
        sessionStorage.setItem("callbackNum", callbackNum.toString());
        a_login("fetch");
      } else {
        clearTimeout(loginTime);
      }
    }, 300);
  }
};
// TODO:微信登录
const xwbd = async (val: string): Promise<string> => {
  return new Promise(resolve => {
    let isbind = 1;
    const key =
      getQueryVariable("args").split("_");
    const openId = getQueryVariable("openid");
    let parmas = location.pathname.replace(/\//g, "_").slice(0, -1);
    // 微信跳转绑定
    for (const i of key) { parmas += "_" + i; }
    // 微信判断是否有code
    if (openId === "") {
      window.location.href = process.env.VUE_APP_OPENID + parmas; // 'http://wx.ccnew.com/RoxBusiness/wxauth/auth.3g?publicKey=ccsccfzy&key=openkey'
    } else {
      getAccount({ openId }, (res: any) => {
        console.log(res);
        if (res && res.data.flag) {
          isbind = res.data.data.bindResult;
          const cAccount = res.data.data.sign || "";
          console.log("登录相关", val, isbind);
          // 绑定资金账号直接登录获取资金账号信息
          if (isbind === 1) {
            update_state({ loginSign: cAccount })
          } else {
            if (val === "fetch") {
              update_state({ loginSign: "" })
            } else {
              window.location.href =
                process.env.VUE_APP_BIND + parmas + "&openId=" + openId; // 'http://wx.ccnew.com/RoxBusiness/zhbdService/toGeneralBind.3g?pubAccount=gh_939a267bccd1&openId=' + openId + '&flag=2020818'
            }
          }
          sensors.login(store.state.loginSign);
          resolve(store.state.loginSign)
        } else {
          if (val === "login") {
            Dialog.Toast({
              content: "网络异常，请尝试重新进入",
            });
          }
          resolve("")
        }
      });
    }
  })
};

const getAccount = (params: any, callback: any) => {
  Axios({
    url: "/normalized/wechat/getAccount",
    params,
    method: "GET",
  })
    .then(res => {
      callback(res);
    })
    .catch(error => {
      callback(false);
      console.log("getOpenid error is", error);
    });
};
// TODO:版本控制之对比
const versionControl = (ver: string) => {
  // console.log(checkPlatform())
  if (localStorage.getItem("version")) { return; }
  if (checkPlatform() === "hexin") {
    if (checkPlatform("plat") === "Android") {
      console.log("版本控制之安卓");
      if (versionCmd(ver, process.env.VUE_APP_ANDROID) < 0) {
        console.log("当前版本不支持");
        // 防止多次弹出
        localStorage.setItem("version", "true");
        alert("当前版本过低,页面可能异常，建议你升级到最新版本");
      }
    } else if (checkPlatform("plat") === "ios") {
      console.log("版本控制之苹果");
      if (versionCmd(ver, process.env.VUE_APP_IOS) < 0) {
        console.log("当前版本不支持");
        // 防止多次弹出
        localStorage.setItem("version", "true");
        alert("当前版本过低,页面可能异常，建议你升级到最新版本");
      }
    }
  } else if (checkPlatform() === "wx") {
    console.log("版本控制之微信");
  } else {
    console.log("版本控制之其他");
  }
};
// TODO:分享
// 可在index.html引入微信jsapi，然后用把wx设为全局变量，如window.wx=wx，再初始化时引入
interface shareDataType {
  query?: {
    [x: string]: string
  }
  routerName?: string
  urlType?: string
  url?: string
  shareContent?: {
    title: string
    desc: string
    imgUrl: string
  }
}
const a_share = {
  shareContent: {
    title: "【财升宝APP】中原618财富地图", // 分享标题
    desc: "来财升宝参加活动赢大奖，百元京东E卡、华为手机、小米电动牙刷...每天都有机会拿哦！", // 分享描述
    imgUrl: "https://yyhd.ccnew.com.cn/img/csb.png", // 分享图标
  } as Required<shareDataType>["shareContent"],
  queryChange(query: shareDataType["query"]): string {
    let parmas = "";
    for (const i in query) {
      if (parmas === "") {
        parmas += "?";
      } else {
        parmas += "&";
      }
      parmas += i + "=" + query[i];
    }
    return parmas;
  },
  geturl(val: number = 0, query: shareDataType["query"] = {}, routerName: string = ""): string {
    // 0是添加路由名，1是不添加
    let url;
    if (val === 0) {
      url =
        location.origin + process.env.VUE_APP_BASEURL + "/" + routerName + "/";
    } else if (val === 1) {
      url = location.origin + process.env.VUE_APP_BASEURL + "/";
    } else {
      url = ""
    }
    url += this.queryChange(query);
    return url;
  },
  dataChangeUrl(data: shareDataType): string {
    const query = data.query || {};
    if (data.urlType === "openId" && data.query) {
      return process.env.VUE_APP_OPENID + "_" + data.query.args;
    } else {
      return data.routerName
        ? this.geturl(0, query, data.routerName)
        : data.url
          ? (data.url += this.queryChange(query))
          : this.geturl(1, query);
    }
  },
  init(data: shareDataType = {}) {
    const url = this.dataChangeUrl(data);
    const content = data.shareContent || this.shareContent;
    return new Promise((resolve, reject) => {
      if (checkPlatform() === "wx") {
        const codeurl = encodeURIComponent(this.geturl(1));
        getSign(
          {
            url: codeurl,
          },
          (res: any) => {
            if (res.data.flag) {
              this.wxshare(res.data.data, url, content).then(() => {
                resolve(true);
              });
            } else { reject(); }
          },
        );
      }
    });
  },
  share(data: shareDataType = {}) {
    return new Promise((resolve, reject) => {
      try {
        const url = this.dataChangeUrl(data);
        const content = data.shareContent || this.shareContent;

        console.log(url, content);
        if (checkPlatform() === "hexin") {
          IOSAndroid.share({
            type: 1,
            title: content.title,
            content: content.desc,
            url,
            bmpRes: 1,
            bmpUrl: content.imgUrl,
          });
          resolve(true);
        } else if (checkPlatform() === "wx") {
          Dialog.Toast({
            content: "微信异常进入",
          });
          reject("微信异常进入");
        } else {
          Dialog.Toast({
            content: "请前往官方app参与活动",
          });
          reject("请前往官方app参与活动");
        }
      } catch {
        reject("抛出错误");
      }
    });
  },
  /*
  @param
    bmpRes：1:图片来源-网络 ,2:图片来源-截图（对当前webview进行截图） 
    bmpUrl：图片来源是网络条件传的图片url
  */
  sharePage(bmpRes: 1 | 2 = 2, bmpUrl?: string) {
    return new Promise((resolve, reject) => {
      try {
        console.log("调用截屏分享");
        if (checkPlatform() === "hexin") {
          IOSAndroid.share({
            type: 2,
            bmpRes,
            bmpUrl
          });
          resolve(true);
        } else if (checkPlatform() === "wx") {
          Dialog.Toast({
            content: "微信异常进入",
          });
          reject("微信异常进入");
        } else {
          Dialog.Toast({
            content: "请前往官方app参与活动",
          });
          reject("请前往官方app参与活动");
        }
      } catch {
        reject("抛出错误");
      }
    });
  },
  wxshare(data: any, url: string, content: any) {
    return new Promise(resolve => {
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: process.env.VUE_APP_APPID, // 必填，公众号的唯一标识 wx499dabf9f6a6e1a6
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
          "updateAppMessageShareData",
          "updateTimelineShareData",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
        ], // 必填，需要使用的JS接口列表
      });
      window.wx.ready(() => {
        // 需在用户可能点击分享按钮前就先调用
        // 分享给朋友
        window.wx.onMenuShareAppMessage({
          title: content.title, // 分享标题
          desc: content.desc, // 分享描述
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: content.imgUrl, // 分享图标
          success: () => {
            console.log("微信分享配置完成");
            // 设置成功
            resolve(true);
          },
        });
        // 分享给朋友圈
        window.wx.onMenuShareTimeline({
          title: content.title, // 分享标题
          desc: content.desc, // 分享描述
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: content.imgUrl, // 分享图标
          success: () => {
            // 用户点击了分享后执行的回调函数
            console.log("朋友圈分享配置完成");
            resolve(true);
          },
        });
      });
    });
  },
};
const getSign = (params: any, callback: any) => {
  Axios({
    url: "/normalized/wechat/getSign",
    params,
    method: "POST",
  })
    .then(res => {
      callback(res);
    })
    .catch(error => {
      console.log("getSign error is", error);
    });
};
// TODO:跳转
const a_href = (name: string, parmas?: any) => {
  if (name === "url") {
    // 传入链接跳转
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=5002^isHiddenNavigationBar=1^url=" +
          parmas;
      } else {
        window.location.href =
          "client.html?action=ymtz^webid=2792^isHiddenNavigationBar=1^url=" +
          parmas;
      }
    } else if (checkPlatform() === "wx") {
      window.location.href = parmas;
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "czd") {
    // 猜涨跌首页
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=5002^isHiddenNavigationBar=1^url=https://yyhd.ccnew.com.cn/activeczd/?channel=2";
      } else {
        window.location.href =
          "client.html?action=ymtz^webid=2792^isHiddenNavigationBar=1^url=https://yyhd.ccnew.com.cn/activeczd/?channel=2";
      }
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动"
      });
    }
  } else if (name === "jjdt") {
    // 开门红之基金定投
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=web_lcsc^url=https://upsc.ccnew.com/ger/thinkive/mall/m/planbuyindex^needloginfirst=1";
      } else {
        window.location.href =
          "client.html?action=openscsdk^isHiddenNavigationBar=^isNoNeedWtLogin=1^webid=2792^url=https://upsc.ccnew.com/ger/thinkive/mall/m/planbuyindex?source=trade";
      }
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动"
      });
    }
  } else if (name === "rmjj") {
    // 开门红之热门基金
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=web_lcsc^url=https://up.ccnew.com/ger/thinkive/mall/m/fundopenred^needloginfirst=1";
      } else {
        window.location.href =
          "client.html?action=openscsdk^isHiddenNavigationBar=^isNoNeedWtLogin=1^webid=2792^url=https://up.ccnew.com/ger/thinkive/mall/m/fundopenred?source=trade";
      }
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动"
      });
    }
  } else if (name === "jfsc") {
    // 积分商城首页
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=5002^isHiddenNavigationBar=1^url=https://jf.ccnew.com:9035/m/jf_ths/views/main/index.html";
      } else {
        window.location.href =
          "client.html?action=ymtz^webid=2792^isHiddenNavigationBar=1^url=https://jf.ccnew.com:9035/m/jf_ths/views/main/index.html";
      }
    } else if (checkPlatform() === "wx") {
      window.location.href =
        "http://wx.ccnew.com/RoxBusiness/wxauth/auth.3g?publicKey=ccsccfzy&key=integralMall";
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "lxtz") {
    // 做理性投资人系列活动
    if (checkPlatform() === "hexin") {
      window.location.href =
        "https://www.ccnew.com/main/new-tzzjy/jydt/index.shtml";
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "cfztc") {
    // 财富直通车
    if (checkPlatform() === "hexin") {
      window.location.href =
        "http://wx.ccnew.com/RoxBusiness/video/show.3g?publicKey=ccsccfzy";
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "sbds") {
    // 实盘理财竞技大赛
    if (checkPlatform() === "hexin") {
      window.location.href =
        "https://spds-mobile.ccnew.com.cn/?publicKey=ccsccfzy";
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "zxxx") {
    // 非金产品资讯产品资讯信息首页
    if (checkPlatform() === "hexin") {
      window.location.href =
        "client.html?action=openscsdk^webid=web_lcsc^url=https://up.ccnew.com/ger/thinkive/mall/m/infolist?product_type=1&source=trade";
    } else if (checkPlatform() === "wx") {
      window.location.href =
        "https://up.ccnew.com/ger/thinkive/mall/m/infolist?product_type=1";
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "zyyx") {
    // 金融产品中原优选首页
    if (checkPlatform() === "hexin") {
      window.location.href =
        "client.html?action=openscsdk^webid=web_lcsc^url=https://up.ccnew.com/ger/thinkive/mall/m/highqualityfund";
    } else if (checkPlatform() === "wx") {
      window.location.href =
        "https://up.ccnew.com/ger/thinkive/mall/m/highqualityfund";
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "lcsc") {
    // 金融产品理财商城首页
    if (checkPlatform() === "hexin") {
      window.location.href =
        "client.html?action=openscsdk^webid=web_lcsc^url=https://up.ccnew.com/ger/thinkive/mall/m/index?source=trade";
    } else if (checkPlatform() === "wx") {
      window.location.href = "https://up.ccnew.com/ger/thinkive/mall/m/index";
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "tgkzb") {
    // 投顾直播之看直播页面
    if (checkPlatform() === "hexin") {
      window.location.href =
        "client.html?action=ymtz^webid=2804^url=https://hlwtg.ccnew.com.cn:6443/tgh5/live/list";
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "tgzb") {
    // 投顾直播首页
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=2804^url=https://hlwtg.ccnew.com.cn:6443/tgh5";
      } else {
        window.location.href =
          "client.html?action=ymtz^webid=2792^url=https://hlwtg.ccnew.com.cn:6443/tgh5";
      }
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "zyxgb") {
    // 选股宝首页
    if (checkPlatform() === "hexin") {
      window.location.href =
        "client.html?action=ymtz^webid=2804^url=http://wencai.ths8.com/wcznxg/pro/app/index1.html?qs=zyzq?appFrom=ths";
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "lcxt") {
    // 理财学堂
    if (checkPlatform() === "hexin") {
      window.location.href =
        "client.html?action=openscsdk^webid=web_lcsc^url=https://up.ccnew.com/ger/thinkive/mall/m/articleindex?catalog_id=9&catalog_name=%E7%90%86%E8%B4%A2%E8%AF%BE%E5%A0%82&func_type=117";
    } else if (checkPlatform() === "wx") {
      window.location.href =
        "https://up.ccnew.com/ger/thinkive/mall/m/articleindex?catalog_id=9&catalog_name=%E7%90%86%E8%B4%A2%E8%AF%BE%E5%A0%82&func_type=117";
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "zyyb") {
    // 研报页面，十大金股
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=2804^url=https://hlwtg.ccnew.com.cn:6443/tgh5/research/list";
      } else {
        window.location.href =
          "client.html?action=ymtz^webid=2792^url=https://hlwtg.ccnew.com.cn:6443/tgh5/research/list";
      }
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "zykh") {
    // 开户界面
    if (checkPlatform() === "hexin") {
      window.location.href =
        "client.html?action=ymtz^webid=2804^url=https://h5kh.ccnew.com/p/6ZI5wP";
    } else if (checkPlatform() === "wx") {
      window.location.href = "https://h5kh.ccnew.com/p/6ZI5wP";
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "zyxy") {
    // 小原链接
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href = "client.html?action=ymtz^webid=sdk_znkf";
      } else {
        window.location.href =
          "client.html?action=thirdjump^isHiddenNavigationBar=1^isNoNeedWtLogin=1^pagename=openznkf^isNeedHqLogin=1";
      }
    } else if (checkPlatform() === "wx") {
      a_href("download");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "bindWx") {
    // 绑定微信
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^isHiddenNavigationBar=^webid=3561";
      } else {
        window.location.href =
          "client.html?action=thirdjump^webid=5008^pagename=bindwx^version=3.4";
      }
    } else if (checkPlatform() === "wx") {
      xwbd("login");
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "currentUrl") {
    if (location.href.indexOf(parmas) < 0) {
      Dialog.Toast({
        content: "地址错误",
      });
      return;
    }
    const url = location.href.substring(
      0,
      location.href.indexOf(parmas) + parmas.length + 1,
    );
    console.log(url);
    if (checkPlatform() === "hexin") {
      if (checkPlatform("plat") === "Android") {
        window.location.href =
          "client.html?action=ymtz^webid=5002^isHiddenNavigationBar=1^needloginfirst=0^url=" +
          url;
      } else {
        window.location.href =
          "client.html?action=ymtz^webid=2792^isHiddenNavigationBar=1^isNoNeedWtLogin=1^url=" +
          url;
      }
    } else {
      Dialog.Toast({
        content: "请前往官方app参与活动",
      });
    }
  } else if (name === "download") {
    window.location.href =
      "https://csbbh.ccnew.com.cn:8086/phone_download.html";
  } else if (name === "OpenAccounts") {
    window.location.href = "https://h5kh.ccnew.com/p/IgV5Pb";
  } else {
    Dialog.Toast({
      content: "未指定对应跳转",
    });
  }
};
