/*
 * @Description: cookie文件
 * @Author: 水印红枫
 * @Date: 2020-07-09 10:26:37
 * @LastEditors: 水印红枫
 */
import Cookies from "js-cookie";
const TOKEN_KEY = "token";
const cookieExpires = 1;
export default {
  install: function(Vue) {
    Object.defineProperty(Vue.prototype, "$cookie", {
      value: this, // 设置值
      writable: false // 是否可以改变，默认false，更改会报undefined
    });
  },
  setToken(token, expires = cookieExpires) {
    Cookies.set(TOKEN_KEY, token, { expires: expires || 1 });
  },
  getToken(type = "string") {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      if (type === "json") return JSON.parse(token);
      else return token;
    } else {
      return "you don't own the token";
    }
  }
};
