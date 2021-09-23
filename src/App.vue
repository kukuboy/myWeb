<!--
 * @Description: 主页面
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-04-30 11:04:40
 * @LastEditors: 水印红枫
-->
<template>
	<router-view v-slot="{ Component }">
		<transition name="filter">
			<keep-alive v-if="$route.meta.keepAlive">
				<component :is="Component" />
			</keep-alive>
			<component
				v-else
				:is="Component"
			/>
		</transition>
	</router-view>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { mapGetters, mapMutations } from "vuex";
import { AllStateType, AllMutationsType } from "@/store";
import { preloadImg } from "./util/myUtil";

@Options({
  computed: mapGetters(["scrollBottom"]),
  methods: mapMutations(["update_state"])
})
export default class App extends Vue {
  declare scrollBottom: AllStateType["scrollBottom"];
  declare update_state: AllMutationsType["update_state"];
  resizeEvt: "orientationchange" | "resize" =
    "orientationchange" in window ? "orientationchange" : "resize";
  imgData: string[] = [
    // require("@/assets/images/chcj-images-2@2x.jpg"),
  ];
  unmounted() {
    window.removeEventListener(this.resizeEvt, () => this.adjustRem());
    window.removeEventListener("unload", this.saveState);
    window.removeEventListener("scroll", this.onScroll);
  }
  created() {
    this.init();
  }
  mounted() {
    this.adjustRem();
  }
  init() {
    // 打印环境
    console.log("当前环境为：" + process.env.VUE_APP_NODE_ENV);

    // 修复字体放大手机上rem尺寸错误的问题
    window.addEventListener(this.resizeEvt, () => this.adjustRem(), {
      passive: true
    });
    // 存储vuex刷新丢失的数据
    window.addEventListener("unload", this.saveState, { passive: true });
    // 检测滑动到底部
    window.addEventListener("scroll", this.onScroll, { passive: true });

    // 添加刷新丢失的数据
    const sessionState = sessionStorage.getItem("state");
    if (sessionState) {
      const sessign_state = JSON.parse(sessionState) as Partial<AllStateType>;
      // 需要保留的属性如此处理，即刷新需要清空的数据
      delete sessign_state.bodyColor;
      // 进行数据的覆盖
      this.$store.replaceState(
        Object.assign({}, this.$store.state, sessign_state)
      );
    }
    // 开始预加载图片
    Promise.resolve().then(() => preloadImg(this.imgData));
  }
  // 调整页面rem大小，w即为你需要设置的宽度的大小，即为wrem=100vw
  adjustRem(w: number = 7.5) {
    console.log("初始化页面");
    const clientWidth = document.documentElement.clientWidth;
    if (!clientWidth) {
      return;
    }
    let pxOneRem = clientWidth / w;
    document.documentElement.style.fontSize = pxOneRem + "px";
    pxOneRem = (pxOneRem * pxOneRem) / adapt();
    document.documentElement.style.fontSize = pxOneRem + "px";
    // 纠错函数
    function adapt() {
      const d = window.document.createElement("div");
      d.style.width = "1rem";
      d.style.display = "none";
      const head = window.document.getElementsByTagName("head")[0];
      head.appendChild(d);
      const defaultFontSize = parseFloat(
        window.getComputedStyle(d, null).getPropertyValue("width")
      );
      return defaultFontSize;
    }
  }
  // 保存vuex数据
  saveState() {
    sessionStorage.setItem("state", JSON.stringify(this.$store.state));
  }
  // 滑动到底部
  onScroll() {
    const clientHeight: number =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const scrollTop: number =
      document.documentElement.scrollTop == 0
        ? document.body.scrollTop
        : document.documentElement.scrollTop;
    const scrollHeight: number =
      document.documentElement.scrollTop == 0
        ? document.body.scrollHeight
        : document.documentElement.scrollHeight;
    if (clientHeight + scrollTop + 30 >= scrollHeight) {
      if (!this.scrollBottom) {
        this.update_state({ scrollBottom: true });
        console.log("滑动到底部");
      }
    } else {
      this.update_state({ scrollBottom: false });
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/common.scss";
#app {
	min-height: 100vh;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
.filter-enter-active {
	transition: filter 0.3s;
}
.filter-leave-active {
	transition: filter 0;
}

.filter-enter-from,
.filter-leave-to {
	/* & below version 2.1.8 */
	filter: blur(6px);
}
* {
	margin: 0;
	padding: 0;
	// cursor: pointer;
	outline: 0;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	/*iOS会在元素周围显示橙色的外框，以表明该元素被tap了。如果你想自己实现tap时的响应效果，可以用以下方法“去除”这个高亮效果*/
}
body {
	/* 禁止长按选中事件 */
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	/* ios页面主题限制在安全区域内 */
	padding-bottom: constant(safe-area-insert-bottom);
	padding-bottom: env(safe-area-insert-bottom);
}
// 更改盒模型
div {
	box-sizing: border-box;
}
/* 深色模式适配 */
:root {
	color-scheme: light dark;
	background: #ffffff;
	color: black;
}
@media (prefers-color-scheme: dark) {
	:root {
		filter: grayscale(100%) !important;
	}
}
</style>
