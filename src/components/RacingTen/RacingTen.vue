<template>
	<div
		class="racingTen"
		v-show="isShow && Mshow"
    @touchmove.prevent
	>
		<div
			class="racingFrame"
			ref="racingFrame"
		>
			<div
				class="racingBar"
				ref="racingBar"
			>
				<slot></slot>
			</div>
		</div>
		<img
			class="close"
			v-if="close"
			@click="goClose"
			src="@/assets/images/close@2x.png"
		/>
	</div>
</template>

<script lang="ts">
// import { ref, inject } from "vue";
import { Vue, Options, prop } from "vue-class-component";
// import ComponentName from "@/components/ComponentName.vue";
// import { mapGetters } from "vuex";
// 文档
// api：
// speed:控制滚动速度，默认100px/s
// delay:第一次滚动的迟，默认2000/ms
// close:是否显示关闭按钮
// length：滚动失效后转入可以跟随内容该变化的值，比如字符
// 功能：
// 如需外部主动开启关闭，接受close时间后改变isShow传入值即可
let racingBar: any, sw: number, cw: number, checkInit: any;
class Props {
  speed = prop<number>({ default: 100 });
  delay = prop<number>({ default: 3000 });
  close = prop<boolean>({ default: false });
  isShow = prop<boolean>({ default: true });
  autoS = prop<boolean>({ default: false });
  length = prop<string>({ default: "" });
}
@Options({
  watch: {
    isShow: {
      handler(newVal) {
        if (newVal) {
          this.Mshow = true;
          this.init();
        }
      },
      immediate: false
    },
    length: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      immediate: true
    }
  }
})
export default class RacingTen extends Vue.with(Props) {
  Mshow: boolean = true;
  $refs!: {
    racingFrame: HTMLDivElement;
    racingBar: HTMLDivElement;
  };
  unmounted() {
    racingBar.removeEventListener("transitionend", this.transitionend);
    clearTimeout(checkInit);
  }
  // created() {
  //   //
  // }
  // activated() {
  //   //
  // }
  // mounted() {
  //   this.init();
  // }
  init() {
    if (this.close) {
      this.$refs.racingFrame.style.width = "calc(100% - 0.77rem)";
      this.$refs.racingFrame.style.marginRight = "0.77rem";
    } else {
      this.$refs.racingFrame.style.width = "100%";
      this.$refs.racingFrame.style.marginRight = "0";
    }
    racingBar = this.$refs.racingBar;
    sw = racingBar.scrollWidth;
    cw = racingBar.clientWidth;
    if (sw > cw || !this.autoS) {
      racingBar.removeEventListener("transitionend", this.transitionend);
      racingBar.addEventListener("transitionend", this.transitionend);
      racingBar.style.transitionDelay = this.delay + "ms";
      racingBar.style.transitionDuration = sw / this.speed + "s";
      racingBar.style.transform = "translateX(-" + sw + "px" + ")";
    }
  }
  transitionend() {
    clearTimeout(checkInit);
    setTimeout(() => {
      if (racingBar.style.transitionDelay !== "100ms") {
        racingBar.style.transitionDelay = "100ms";
      }
      if (racingBar.style.transitionDuration === "0s") {
        racingBar.style.transitionDuration = (sw + cw) / this.speed + "s";
        racingBar.style.transform = "translateX(-" + sw + "px " + ")";
        checkInit = setTimeout(() => {
          this.transitionend();
        }, ((sw + cw) / this.speed) * 1000 + 3000);
      } else {
        racingBar.style.transitionDuration = "0s";
        racingBar.style.transform = "translateX(" + cw + "px" + ")";
        checkInit = setTimeout(() => {
          this.transitionend();
        }, 3000);
      }
    }, 300);
  }
  goClose() {
    this.Mshow = false;
    this.$emit("close");
  }
}
</script>

<style lang="scss">
.racingTen {
  position: relative;
	width: 100%;
	.racingFrame {
		width: 100%;
    height: 100%;
		overflow: hidden;
		.racingBar {
			width: 100%;
      height: 100%;
			overflow-x: visible;
			transition-timing-function: linear;
			white-space: nowrap;
		}
	}
	.close {
		position: absolute;
		right: 0.25rem;
		width: 0.27rem;
    top: 50%;
    transform: translateY(-50%);
	}
}
</style>

