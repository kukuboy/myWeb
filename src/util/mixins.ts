/*
 * @Description: 混入组件
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2020-11-19 10:04:50
 * @LastEditors: 水印红枫
 */
import { checkPlatform } from "@/util/myUtil";
import { Vue, Options } from "vue-class-component"
import { AllStateType } from "@/store"
import { mapGetters } from "vuex"

@Options({
  computed: mapGetters(["loginSign", "deviceId"]),
})
export default class Mixin extends Vue {
  declare loginSign: AllStateType["loginSign"]
  declare deviceId: AllStateType["deviceId"]
  mixin_time: number | undefined
  activatedStatus: boolean = false // 用于再次进来重新请求
  isHexin: boolean = checkPlatform() === "hexin"
  isIos: boolean = checkPlatform("plat") === "ios"
  unmounted() {
    clearTimeout(this.mixin_time);
  }
  deactivated() {
    this.activatedStatus = true
  }
  activated() {
    this.activatedStatus = false
  }
  created() {
    console.time("页面加载时间：");
    this.mixin_time = setTimeout(() => {
      console.log("开始出现加载条");
      this.$dialog.ViewLoading();
    }, 1000);
  }
  get isRefresh() {
    return this.loginSign !== "" && !this.activatedStatus;
  }
  get isLogin() {
    return this.loginSign !== "";
  }
  mounted() {
    console.timeEnd("页面加载时间：");
    this.$dialog.ViewLoading({
      state: "end"
    });
    clearTimeout(this.mixin_time);
    // }, 5000);
  }
  // 其它属性方法......
}
