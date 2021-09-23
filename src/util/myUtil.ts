/*
 * @Description: 便捷函数
 * @Author: 水印红枫
 * @Date: 2019-11-10 16:46:07
 * @LastEditors: 水印红枫
 */

export {
  sortObject,
  getTime,
  formatTime,
  insertTo,
  deepClone,
  versionCmd,
  cmd,
  checkPlatform,
  CheckUrlStatus,
  getQueryVariable,
  getNumberType,
  getUrlParams,
  timeCmd,
  arrayCmd,
  numMulti,
  addVConsole,
  preloadImg,
}
/**
 * @description: 以对象对应键值快速排序
 * @param {any} arr: 需要排序的对象
 * @param {any} key: 依此排序的键值
 * @param {boolean} from: 从大到小后从小到大
 * @return {*}
 */
function sortObject(arr: any, key: any, from = false): any {
  if (!arr || arr.length <= 1) {
    return arr;
  }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];
  if (from) {
    for (const i of arr) {
      const a = Number(i[key]);
      const b = Number(pivot[key]);
      if (!a && a !== 0) {
        // TODO:转化失败不能比较大小，抛出异常
        console.log("该字段不能比较大小", i, key);
        return;
      }
      if (!b && b !== 0) {
        // TODO:转化失败不能比较大小，抛出异常
        console.log("该字段不能比较大小", pivot, key);
        return;
      }
      if (a >= b) {
        left.push(i);
      } else {
        right.push(i);
      }
    }
  } else {
    for (const i of arr) {
      const a = Number(i[key]);
      const b = Number(pivot[key]);
      if (!a && a !== 0) {
        // TODO:转化失败不能比较大小，抛出异常
        console.log("该字段不能比较大小", i, key);
        return;
      }
      if (!b && b !== 0) {
        // TODO:转化失败不能比较大小，抛出异常
        console.log("该字段不能比较大小", pivot, key);
        return;
      }
      if (a <= b) {
        left.push(i);
      } else {
        right.push(i);
      }
    }
  }
  // TODO:splice操作会更改原数组，故在此将原数组变回，否则当前数组指向一个地址的数组都会改变
  arr.splice(pivotIndex, 0, pivot);
  // console.log(left.concat([pivot], right))
  return sortObject(left, key, from).concat(
    [pivot],
    sortObject(right, key, from),
  );
}
/**
 * @description: 根据对应格式获取对应的日期
 * @param {string} format: 需要转换成为的时间格式，Y,M,D,H,m,S 
 * @param {*} time: 对象的时间
 * @return {*}
 */
function getTime(format: string, time = new Date()) {
  // let time = new Date()
  // eslint-disable-next-line no-unused-vars
  let NowTime = "";
  const y = time.getFullYear();
  const M =
    time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
  const d = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
  const h = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
  const m = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
  const s = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
  for (let i = 0; i < format.length; i += 3) {
    let re;
    if (format.indexOf("YYYY") === i) {
      re = format.substring(i, i + 4);
      i += 2;
    } else {
      re = format.substring(i, i + 2);
    }
    switch (re) {
      case "YYYY":
        NowTime += y;
        break;
      case "MM":
        NowTime += M;
        break;
      case "DD":
        NowTime += d;
        break;
      case "HH":
        NowTime += h;
        break;
      case "mm":
        NowTime += m;
        break;
      case "SS":
        NowTime += s;
        break;
      default:
        NowTime += "";
    }
    if (i < format.length - 2) {
      NowTime += format.substring(i + 2, i + 3);
    }
  }
  return NowTime;
}
/**
 * @description: 获取以当前时间对比时间
 * @param {string} time: 可以新建转为时间类型的时间
 * @param {*} countdown: 转换的类型
 * @return {*}
 */
function formatTime(time: string | number | Date, countdown = false) {
  const nowTime = new Date().getTime();
  const inTime = new Date(time).getTime();
  // console.log(time, nowTime)
  if (isNaN(inTime)) {
    return String(time);
  }
  if (countdown) {
    let allTime = inTime - nowTime;
    const D = Math.floor(allTime / 86400000);
    allTime %= 86400000;
    const H = Math.floor(allTime / 3600000);
    allTime %= 3600000;
    const S = Math.floor(allTime / 60000);
    allTime %= 60000;
    const m = Math.floor(allTime / 1000);
    return D + "天" + H + "时" + S + "分" + m + "秒";
  } else {
    const T = nowTime - inTime;
    if (T < 60000) {
      return "刚刚";
    } else if (T < 3600000) {
      return Math.floor(T / 60000) + "分钟前";
    } else if (T < 86400000) {
      return Math.floor(T / 3600000) + "小时前";
    } else if (T < 25920000000) {
      return Math.floor(T / 86400000) + "天前";
    } else {
      return getTime("YYYY-MM-DD HH:mm", new Date(inTime)).substr(5);
    }
  }
}
// TODO:
/**
 * @description: 数组比较大小
 * @param {string} arr1 : 数组1
 * @param {string} arr2 : 数组2
 * @return {1：数组1>数组2，0：数组1=数组2，-1：数组1《数组2}
 */
function arrayCmd(arr1: string[], arr2: string[]) {
  if (arr1.length >= arr2.length) {
    for (const i in arr1) {
      const o = isNaN(parseInt(arr1[i])) ? 0 : parseInt(arr1[i]);
      const t = isNaN(parseInt(arr2[i])) ? 0 : parseInt(arr2[i]);
      if (o > t) {
        return 1;
      } else if (o < t) {
        return -1;
      } else {
        if (parseInt(i) === arr1.length - 1) {
          return 0;
        }
      }
    }
  } else {
    for (const i in arr2) {
      const o = isNaN(parseInt(arr1[i])) ? 0 : parseInt(arr1[i]);
      const t = isNaN(parseInt(arr2[i])) ? 0 : parseInt(arr2[i]);
      if (o > t) {
        return 1;
      } else if (o < t) {
        return -1;
      } else {
        // tslint:disable-next-line: radix
        if (parseInt(i) === arr2.length - 1) {
          return 0;
        }
      }
    }
  }
}
// TODO:时间对比
function timeCmd(time1: string, time2: string, sp = ":") {
  const one = time1.split(sp);
  const two = time2.split(sp);
  return arrayCmd(one, two);
}
/**
 * @description: 光标插入
 * @param {any} ele : 对象的元素
 * @param {any} val : 需要插入的值
 */
function insertTo(ele: any, val: any) {
  if ((document as any).selection) {
    const cursor = (document as any).selection.createRange();
    cursor.text = val;
  } else if (ele.selectionStart || ele.selectionStart === 0) {
    let start = parseInt(ele.selectionStart);
    let end = parseInt(ele.selectionEnd);
    if (localStorage.getItem("SAVE_CURSOR_INDEX")) {
      start = parseInt(localStorage.getItem("CURSOR_SELECT_START") || "0");
      end = parseInt(localStorage.getItem("CURSOR_SELECT_END") || "0");
    } else {
      if (ele.value.length !== start) {
        // 说明是从中间开始插的
        localStorage.setItem("SAVE_CURSOR_INDEX", "true");
      } else {
        localStorage.setItem("SAVE_CURSOR_INDEX", "");
      }
      if (
        !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ||
        /HUAWEI GRA-CL00/gi.test(window.navigator.userAgent)
      ) {
        // IOS中有bug正常插入的第二个会有问题
        if (
          localStorage.getItem("CURSOR_IOS_BUG_FIRST_START") ||
          localStorage.getItem("CURSOR_IOS_BUG_FIRST_START") === "0"
        ) {
          // 如果是第二次点击表情，就有这个值了。如果获取到的两个值相等
          // if (String(start) === String(localStorage.getItem('CURSOR_IOS_BUG_FIRST'))) {
          start = parseInt(
            localStorage.getItem("CURSOR_SELECT_START") || "0"
          );
          end = parseInt(
            localStorage.getItem("CURSOR_SELECT_END") || "0"
          );
          // }
        } else {
          // 如果是第一次点击，会没有这个值，ios获取到的值是正确的，start还是用 ele.selectionStart，把这个值存下来
          localStorage.setItem("CURSOR_IOS_BUG_FIRST_START", start.toString());
          localStorage.setItem("CURSOR_IOS_BUG_FIRST_END", end.toString());
        }
        // iosBugFlag = true
      }
    }
    const value = ele.value;
    ele.value = value.substring(0, start);
    ele.value += val;
    ele.value += value.substring(end, value.length);
  } else {
    ele.innerHTML += val;
  }
}
/**
 * @description: 对象或数组深度克隆
 * @param {any} obj: 需要克隆的对象
 * @return {any} newObj: 返回克隆出的新对象
 */
function deepClone(obj: any) {
  const newObj: any = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (const i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        newObj[i] =
          obj[i] && typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
      }
    }
  }
  return newObj;
}
/**
 * @description: 对象或数组啊判断是否相等
 * @param {any} obj1: 对象1
 * @param {any} obj2: 对象2
 * @param {number} type: 判断的方式
 */
function cmd(obj1: any, obj2: any, type: number = 0) {
  if (type === 0) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (const i in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj1, i)) {
        if (typeof obj1[i] === "object") {
          if (!cmd(obj1[i], obj2[i])) {
            return false;
          }
        } else {
          if (obj1[i] !== obj2[i]) {
            return false;
          }
        }
      }
    }
    return true;
  } else if (type === 1) {
    for (const i in obj1) {
      if (!obj2.includes(obj1[i])) {
        return false;
      }
    }
    return true;
  }
}
/**
 * @description: 手机端判断各个平台浏览器及操作系统平台
 * @param {string} type: 需要检查的类型
 */
function checkPlatform(type: "app" | "plat" = "app") {
  // eslint-disable-next-line no-debugger
  if (type === "app") {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      // 这是微信平台下浏览器
      return "wx";
    }
    if (/hexin/i.test(navigator.userAgent)) {
      // 这是ths平台下浏览器
      return "hexin";
    }
  }
  if (/android/i.test(navigator.userAgent)) {
    // 这是Android平台下浏览器
    return "Android";
  }

  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    // 这是iOS平台下浏览器
    return "ios";
  }

  if (/Linux/i.test(navigator.userAgent) || /Linux/i.test(navigator.platform)) {
    // 这是Linux平台下浏览器
    return "Linux";
  }
  return "none";
}
/**
 * @description: 版本判断 格式为以V开头以.分割，且为阿拉伯数字
 * @param {string} currentVer: 当前版本
 * @param {string} ver: 需要比对的判断
 * @returns {-1:小于对应的版本，0:版本相等,1: 大于对应版本 }
 */
function versionCmd(currentVer: string, ver?: string): number {
  if (!ver) {
    return -2
  }
  const rep = /^V(\d|0\d)(\.\d|\.0\d|\.)+$/;
  if (rep.test(ver) && rep.test(currentVer)) {
    let temp: any = ver.substring(1);
    temp = temp.split(".");
    let tempC: any = currentVer.substring(1);
    tempC = tempC.split(".");
    for (const i in temp) {
      tempC[i] = isNaN(parseInt(tempC[i])) ? 0 : parseInt(tempC[i]);
      temp[i] = isNaN(parseInt(temp[i])) ? 0 : parseInt(temp[i]);
      if (tempC[i] > temp[i]) {
        return 1;
      } else if (tempC[i] < temp[i]) {
        return -1;
      } else {
        if (i === (temp.length - 1).toString()) {
          return 0;
        }
      }
    }
  }
  return -2
}
/**
 * @description: 检查xmlhttp是否支持
 * @param {string} url: 需要检查的链接
 */
function CheckUrlStatus(url: string) {
  let xmlhttp: any;
  if (window.XMLHttpRequest) {
    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    // IE6, IE5 浏览器执行代码
    // eslint-disable-next-line no-undef
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      console.log("xmlhttp");
    }
  };
  xmlhttp.open("HEAD", url, true);
  xmlhttp.send();
  return xmlhttp.status === 200;
}
/**
 * @description: 获取url参数
 * @param {string} variable：需要获取的变量名
 */
function getQueryVariable(variable: string): string {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return "";
}
/**
 * @description: 获取url所有参数并返回对象
 */
function getUrlParams() {
  const url = window.location.href.split("?");
  const end: any = {};
  try {
    if (url.length > 0) {
      const parmas = url[1].split("&");
      for (const i of parmas) {
        const param = i.split("=");
        if (param.length > 0) {
          end[param[0]] = param[1];
        }
      }
    }
    return end;
  } catch {
    return end;
  }
}
/**
 * @description: 阿拉伯相互装换
 * @param {number} num：需要转换的数字
 * @param {string} to：转化类型
 * @param {string} from：来源类型
 */
function getNumberType(num: number, to: string = "hz", from: string = "alb") {
  if (to === "hz" && from === "alb") {
    let hz;
    switch (num) {
      case 0:
        hz = "零";
        break;
      case 1:
        hz = "一";
        break;
      case 2:
        hz = "二";
        break;
      case 3:
        hz = "三";
        break;
      case 4:
        hz = "四";
        break;
      case 5:
        hz = "五";
        break;
      case 6:
        hz = "六";
        break;
      case 7:
        hz = "七";
        break;
      case 8:
        hz = "八";
        break;
      case 9:
        hz = "九";
        break;
    }
    return hz;
  }
}
/**
 * @description: 小数乘法计算
 * @param {number} num1: 数字1
 * @param {number} num2: 数字2
 */
function numMulti(num1: number, num2: number) {
  if (num1 === null) {
    return num1;
  }
  let baseNum = 0;
  try {
    baseNum +=
      num1.toString().indexOf(".") !== -1
        ? num1.toString().split(".")[1].length
        : 0;
  } catch (e) {
    console.log(e);
  }
  try {
    baseNum +=
      num2.toString().indexOf(".") !== -1
        ? num2.toString().split(".")[1].length
        : 0;
  } catch (e) {
    console.log(e);
  }
  return (
    (Number(num1.toString().replace(".", "")) *
      Number(num2.toString().replace(".", ""))) /
    Math.pow(10, baseNum)
  );
}
/**
 * @description: 添加VConsole
 */
function addVConsole() {
  return new Promise<void>((resolve, reject) => {
    try {
      const script = document.createElement("script");
      // script.async = true;
      script.type = "text/javascript"
      script.src = "https://cdn.bootcss.com/vConsole/3.3.0/vconsole.min.js";
      script.onload = () => {
        window.VConsole && new window.VConsole()
        resolve()
      };
      script.onerror = () => {
        throw ("挂载vconsole失败")
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    } catch {
      console.log("添加VConsole出错")
      reject()
    }

  })
}
/**
 * @description: 预加载对应资源
 * @param {string} imgData: 需要加载的img图片
 * @param {string} backimgData: 需要加载的背景图片
 */
function preloadImg(imgData: string[] = [], backimgData: string[] = []) {
  for (const i of imgData) {
    const image = new Image();
    image.onload = () => {
      image.onload = null;
    };
    image.src = i;
  }
  for (const i of backimgData) {
    const div = document.createElement("div");
    div.style.backgroundImage = i
    div.style.display = "none"
    document.body.append(div)
  }
}

