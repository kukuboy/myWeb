<!--
 * @Description: toast提示
 * @Author: 水印红枫
 * @Date: 2020-07-02 16:46:07
 * @LastEditors: 水印红枫
-->
<template>
	<div
		id="toast"
		ref="toast"
		v-show="show"
	>
		<div
			class="header"
			v-if="title_show"
		>{{ title }}</div>
		<div
			class="content"
			ref="content"
			:class="{rotateFlower_show}"
		>
			<span>{{ content }}</span>
			<div
				class="rotateFlower"
				ref="rotateFlower"
				v-show="rotateFlower_show"
			>
				<div
					class="rotate"
					ref="rotate"
					:style="getStyle"
				>
					<div class="line line1"></div>
					<div class="line line2"></div>
					<div class="line line3"></div>
					<div class="line line4"></div>
					<div class="line line5"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Options, prop } from "vue-class-component";
class Props {
  title = prop<string>({ default: "提示" });
  title_show = prop<boolean>({ default: false });
  content = prop<string>({ default: "请选择评价再提交哦" });
  showTime = prop<number>({ default: 3000 });
  rotateFlower_show = prop<boolean>({ default: false });
}
@Options({
  watch: {
    show: {
      handler(newVal) {
        this.change(newVal);
      },
      immediate: true
    }
  }
})
export default class Toast extends Vue.with(Props) {
  declare $refs: {
    toast: HTMLDivElement;
  };
  show: boolean = false;
  time: number | undefined;
  mounted() {
    this.show = true;
    this.init();
  }
  unmounted() {
    clearTimeout(this.time);
  }
  init() {
    this.$refs.toast.style.opacity = "0.8";
  }
  change(val: boolean) {
    if (val) {
      this.time = setTimeout(() => {
        const ToastHtml = document.getElementById("Toast");
        if (ToastHtml) {
          ToastHtml.style.opacity = "0";
          clearTimeout(this.time);
          this.time = setTimeout(() => {
            const ToastHtml = document.getElementById("Toast");
            ToastHtml && document.body.removeChild(ToastHtml);
          }, 1000);
        }
      }, this.showTime);
    }
  }
}
</script>

<style scoped lang="scss">
#toast {
	position: fixed;
	z-index: 1001;
	text-align: center;
	max-width: 80%;
	min-width: 50%;
	word-break: break-all;
	opacity: 0;
	border-radius: 0.2rem;
	background-color: black;
	left: 50%;
	top: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	transition: 1s linear;
}

#toast .header {
	height: 1rem;
	line-height: 1rem;
	font-size: 0.75rem;
	color: white;
	padding: 0 0.3rem;
}

#toast .content {
	font-size: 0.3rem;
	color: white;
	padding: 0.2rem 0.3rem;
	line-height: 0.4rem;
	&.rotateFlower_show {
		padding-right: 0.8rem;
	}
}
.rotateFlower {
	.rotate {
		position: absolute;
		top: calc(50% - 0.15rem);
		right: 0.3rem;
		width: 0.3rem;
		height: 0.3rem;
		animation: rotate 2s linear infinite;
	}
	.line {
		position: absolute;
		width: 0.1rem;
		height: 0.02rem;
		top: 0.14rem;
		left: 0;
		box-sizing: content-box;
		border-color: inherit;
		border-width: 0.1rem;
		border-right-style: solid;
		border-left-style: solid;
	}
	.line2 {
		transform: rotate(36deg);
	}
	.line3 {
		transform: rotate(72deg);
	}
	.line4 {
		transform: rotate(108deg);
	}
	.line5 {
		transform: rotate(144deg);
	}

	@-webkit-keyframes rotate {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(180deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(180deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
}
</style>
