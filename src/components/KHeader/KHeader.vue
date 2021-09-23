<template>
	<div
		class="KHeader"
		v-if="KHeader_show"
		@touchmove.prevent
	>
		<div
			class="headerLeft"
			v-if="left_show&&(isHexin || !isStartPage)"
			@click="back"
		>
			<div class="header_left"></div>
		</div>
		<div class="headerRight flex flex_ali_i_center">
			<img
				v-if="headerRightShow"
				@click="share"
				src="@/assets/images/shareTop.png"
			/>
		</div>
		<div class="headerMiddle">
			{{ title }}
		</div>

	</div>
</template>

<script lang="ts">
import { Vue, Options, prop } from "vue-class-component";

import { a_share } from "@/util/activity";
import { checkPlatform } from "@/util/myUtil";
import IOSAndroid from "@/util/IosAndorid";
import { mapGetters } from "vuex";
import { AllStateType } from "@/store";

class Props {
  KHeader_show = prop<boolean>({ default: true });
  left_show = prop<boolean>({ default: true });
  right_show = prop<string>({ default: "hexin" });
  title = prop<string>({ default: "中原证券" });
  default_back_action = prop<boolean>({ default: true });
}
@Options({
  computed: mapGetters(["loginSign", "startPage"])
})
export default class KHeader extends Vue.with(Props) {
  declare loginSign: AllStateType["loginSign"];
  declare startPage: AllStateType["startPage"];
  get isHexin(): Boolean {
    return checkPlatform() === "hexin";
  }
  get headerRightShow(): Boolean {
    if (this.right_show === "hexin") {
      return this.isHexin;
    }
    return false;
  }
  get isStartPage(): Boolean {
    return this.startPage.name === this.$route.name;
  }
  created() {
    // this.init();
  }
  // init() {}
  back() {
    this.$emit("action", "back");
    if (!this.default_back_action) {
      return;
    }
    if (!this.isStartPage) {
      this.$router.go(-1);
    } else {
      if (checkPlatform() !== "hexin") {
        this.$dialog.Toast({
          content: "已到最外层"
        });
      } else {
        IOSAndroid.goBackAction({
          type: "component"
        });
      }
    }
  }
  share() {
    if (checkPlatform() === "wx" && this.right_show === "hexin") {
      this.$dialog.TipShadow();
    } else {
      a_share.share().then(res => {
        if (res) {
        }
      });
    }
  }
}
</script>
<style scoped lang="scss">
.KHeader {
	position: fixed;
	top: 0;
	width: 100%;
	left: 0;
	height: 0.88rem;
	background-color: rgba(232, 48, 48, 1);
	z-index: 999;
	padding: 0 0.1rem;
}
.headerLeft {
	min-width: 10%;
	height: 100%;
	float: left;
}
/* 统一定义左箭头的样式 */
.header_left {
	border-width: 0.04rem 0.04rem 0 0;
	border-color: white;
	float: left;
	width: 0.28rem;
	height: 0.28rem;
	border-style: solid;
	margin-top: 0.25rem;
	margin-left: 0.35rem;
	transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
	-webkit-transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
}

.headerMiddle {
	// position: absolute;
	width: 80%;
	margin: auto;
	// left: 20%;
	text-align: center;
	font-size: 0.34rem;
	font-weight: bold;
	color: #ffffff;
	line-height: 0.88rem;
	color: #fffefe;
}
.headerRight {
	height: 100%;
	min-width: 10%;
	float: right;
	img {
		width: 0.5rem;
	}
}
</style>
