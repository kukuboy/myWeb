/*
 * @Description: mock文件
 * @Author: 水印红枫
 * @Date: 2020-07-02 16:46:07
 * @LastEditors: 水印红枫
 */

import Mock from "mockjs";
Mock.setup({
  timeout: 200 - 400
});
Mock.mock(/\/lukydraw\/task\/getStatus/, {
  //这里的url地址其实可以换成一个字段，比如msg,下边请求时候对应就可以
  flag: true,
  data: {
    FINANCIAL_STATUS: false,
    prizeId: "18"
  }
});
Mock.mock(/\/lukydraw\/draw\/doLottery/, {
  //这里的url地址其实可以换成一个字段，比如msg,下边请求时候对应就可以
  flag: true,
  data: {
    recordId: 37, //中奖记录id(记录领奖信息时使用)
    prizeId: 4 //奖品编号
  }
});
