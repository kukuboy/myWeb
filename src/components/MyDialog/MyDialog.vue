<template>
	<div
		class="MyDialog"
		v-show="isShow"
		:class="myDialogStyle"
		@touchmove.self.prevent
	>
		<div
			class="TaskDialog"
			:class="{toShow:transtionShow}"
			v-if="MyDialogData.type==='TaskDialog'"
		>
		</div>
		<div
			v-else
			class="MyDialogFrame"
		>
			<img
				@click="close"
				v-if="!MyDialogData.time"
				class="closeImg"
				src="@/assets/images/close@2x.png"
			/>
			<div
				v-else
				class="closeTime"
			>{{closeTime}}s</div>
			<div
				class="addressDialog"
				v-if="MyDialogData.type==='addressDialog'"
			><img
					class="addressDialog-bgTop"
					src="@/assets/images/blueBGDTop@2x.png"
				/>
				<div class="addressDialog-content">
					<p class="addressDialog-content-title">填写收货地址</p>
					<input
						class="addressDialog-content-name"
						v-model="form.name"
						placeholder="姓名"
					/>
					<input
						class="addressDialog-content-phone"
						v-model="form.phone"
						placeholder="联系电话"
					/>
					<textarea
						class="addressDialog-content-name"
						v-model="form.address"
						placeholder="详细收货地址"
					/>
					<p class="addressDialog-content-tip">注：排名奖励实时发送，不可再修改信息</p>
					<p class="addressDialog-content-tip"></p>
					<div
						class="addressDialog-content-cancel"
						@click="close"
					>取消</div>
					<div
						class="addressDialog-content-submit"
						@click="submitA"
					>提交</div>
				</div>
				<img
					class="addressDialog-bgBottom"
					src="@/assets/images/blueBGDBottom@2x.png"
				/>
			</div>
			<div
				class="RuleDialog"
				v-else-if="MyDialogData.type==='RuleDialog'"
			>
				<div class="RuleDialog-title">规则说明</div>
				<div class="RuleDialog-content">
					<p>
						<span class="t1">1、参与规则：</span>
						<span class="t2">活动期间，客户参与活动每日可免费获得一次掷骰子机会，掷骰子可获得收益或福袋奖励，完成任务获得更多掷骰子机会，不同任务对应机会次数不同。</span>
					</p>
					<p>
						<span class="t1">2、收益及福袋规则：</span>
						<span class="t2">客户在参与环节中，棋子落入财富地图可获得收益或福袋。①答题得收益，客户需答对问题获得收益，答错无收益；②命运卡得收益，好运获得收益，坏运无收益；
							③福袋，获得福袋奖励需通过完成任务激活后领取，具体以页面展示为准，获得福袋无收益。活动中获得收益仅作为排行依据，每交易日收益排行前50名可获得100元京东E卡。</span>
					</p>
					<p>
						<span class="t1">3、奖励规则：</span>
						<span class="t2">本次活动有三种获得奖励的途径，如下。
							①收益排行榜：客户参与活动所得收益每交易日会进行排名，每交易日排行榜前50名，可获得100元京东E卡，得奖客户注意查收短信，尽快兑换卡密，避免失效。
							②福袋奖励：客户获得福袋，激活成功后，有机会获得福袋对应的奖励，激活方式以活动页面展示为准。
							③神秘礼包：活动期间，每个交易日中午12：00神秘礼包随机掉落，参与过活动的客户均有机会获得。
							获得福袋奖励或神秘礼包后，客户需根据页面提示填写收货信息，奖品以快递形式在活动结束后15个工作日内发出，未填写或信息模糊不完整则视为自动放弃，将不予发放奖品，奖品售后时间以发出后7个工作日内有效。</span>
					</p>
					<p>
						<span class="t1">4、活动须知：</span>
						<span class="t2">
							活动期间，禁止利用活动进行赌博等违法违规行为。若在活动前后发现违法违规行为，包括但不限于欺诈、赌博、冒用他人身份等，中原证券有权取消活动参与资格及领奖资格。
							凡参与本游戏均视为已经阅读并同意本游戏规则，若发现客户利用不正当手段参与游戏，中原证券有权取消其所获奖励。请确保在参与活动时，网络、系统环境畅通。
							若因网络问题或系统原因，造成活动奖励未到账的情况，中原证券将不予补发。</span>
					</p>
					<p>
						<span class="t1">5、</span><span class="t2">中原证券在法律范围内保留对本游戏的最终解释权。如有疑问，请致电客服热线：95377。</span>
					</p>
					<p v-if="isIos">
						<span class="t1">6、</span>
						<span class="t2">
							通过本软件参加的任何商业活动或财豆相关活动，均与Apple
							Inc.无关，参与客户需满17周岁。
						</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
// import { ref, inject } from "vue";
import { Vue, Options, prop } from "vue-class-component";
import { checkPlatform, numMulti } from "@/util/myUtil";
import IOSAndroid from "@/util/IosAndorid";
// import { a_share } from "@/util/activity";
import {
  MyDialogDataPropsType,
  FormData,
} from "@/types/components/MyDialog.interface";
class Props {
  $refs!: {
    [x: string]: HTMLDivElement;
  };
  MyDialogData = prop<MyDialogDataPropsType>({
    default: {
      type: "RuleDialog"
    }
  });
  isShow = prop<boolean>({ default: false });
}
@Options({
  watch: {
    isShow: {
      handler(newVal) {
        //   需要等到渲染的
        setTimeout(() => {
          this.$nextTick(() => {
            //   实现渐出
            this.transtionShow = newVal;
            // 实现倒计时关闭
            clearInterval(this.interTime);
            if (newVal && this.MyDialogData.time) {
              this.closeTime = this.MyDialogData.time;
              this.interTime = setInterval(() => {
                this.closeTime--;
                if (this.closeTime <= 0) {
                  clearInterval(this.interTime);
                  this.$emit("update:isShow", false);
                }
              }, 1000);
            }
          });
        }, 30);
        if (newVal) {
          // 防止意外拦截
          this.isQuerying = false;
          // 获取已填写的地址
          if (
            this.MyDialogData.type === "addressDialog" &&
            this.MyDialogData.addressDialogContent
          ) {
            this.$http
              .getDeliveryInfoById({
                recordId: this.MyDialogData.addressDialogContent.id
              })
              .then((res: any) => {
                if (res.flag && res.data) {
                  this.form = res.data;
                } else {
                  this.form = {
                    name: "",
                    phone: "",
                    address: ""
                  };
                }
              })
              .catch(() => {
                this.form = {
                  name: "",
                  phone: "",
                  address: ""
                };
              });
          }
        }
      },
      immediate: true
    }
  }
})
export default class MyDialog extends Vue.with(Props) {
  // setupObject = setup(() => {
  //   const abc = ref(222);
  //   const a = inject("abc");
  //   return {
  //     abc,
  //     a
  //   };
  // });
  // data
  interTime: number | undefined;
  closeTime: number = 3;
  transtionShow: boolean = this.isShow;
  checkitem: number = 1;
  isIos: boolean = checkPlatform("plat") === "ios";
  questionDataChose: string = "";
  form: FormData = {
    name: "",
    phone: "",
    address: ""
  };
  isQuerying: boolean = false; // 用于重复提交
  get myDialogStyle() {
    return {
      begin: ["TaskDialog"].includes(this.MyDialogData.type),
      end: this.transtionShow
    };
  }
//   get isAnswer() {
//     return (val: string) => {
//       return /^[a-zA-Z]$/i.test(val);
//     };
//   }
  get getPercent() {
    return (val: number) => {
      return numMulti(val, 100);
    };
  }
  unmounted() {
    //
  }
  created() {
    //
  }

  activated() {
    //
  }

  mounted() {
    //
  }
  close() {
    this.$emit("update:isShow", false);
    this.$emit("action", { type: "closed" });
  }
  back() {
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
  //   通用性动作
  action(val: { type: string; content?: string } | undefined) {
    if (val) {
      if (val.type === "router") {
        this.close();
        this.$router.push({
          name: val.content
        });
      } else if (val.type === "emit") {
        this.$emit("update:isShow", false);
        this.$emit("action", { type: val.content });
      }
    } else {
      this.close();
    }
  }
  //   跳转动作
  href(val: any) {
    this.$emit("update:isShow", false);
    if (checkPlatform("plat") === "Android") {
      window.location.href = val.androidUrl;
    } else {
      window.location.href = val.iosUrl;
    }
  }
  //   提交地址
  submitA() {
    if (this.isQuerying) {
      return;
    }
    this.isQuerying = true;
    const { name, phone, address } = this.form
    if (name.trim() === "") {
      this.$dialog.Toast({
        content: "姓名不得为空"
      });
      return;
    } else if (!/^1[0-9]{10}$/.test(phone)) {
      this.$dialog.Toast({
        content: "手机号格式错误"
      });
      return;
    }
  }
}
</script>

<style lang="scss">
.MyDialog {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 100;
	height: 100%;
	width: 100%;
	background-color: rgba($color: #000000, $alpha: 0.8);
	text-align: center;
	&.begin {
		background-color: rgba($color: #000000, $alpha: 0);
		transition: 1s ease-in;
		&.end {
			background-color: rgba($color: #000000, $alpha: 0.8);
		}
	}
	&-button {
		position: absolute;
		width: 3.47rem;
		height: 1.06rem;
		line-height: 0.9rem;
		background-image: url(../../assets/images/buttonBgD@2x.png);
		background-repeat: no-repeat;
		background-size: 100%;
		left: 0.93rem;
		bottom: 0.5rem;
		font-size: 0.37rem;
		font-weight: 500;
		color: #762701;
	}
	.styleClose {
		width: 0.4rem;
		height: 0.4rem;
		line-height: 0.41rem;
		background-color: #9ed8ff;
		border-radius: 50%;
		color: #1e9bef;
		font-size: 0.38rem;
	}
	.toShow {
		transition: 1s ease-in;
		transform: translateY(0) !important;
	}
	// 全屏布局
	.TaskDialog {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transform: translateY(100%);
	}
	// 自动居中
	.MyDialogFrame {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		.closeImg {
			position: absolute;
			width: 0.48rem;
			top: -0.96rem;
			right: 0;
		}
		.closeTime {
			position: absolute;
			width: 0.48rem;
			height: 0.48rem;
			line-height: 0.48rem;
			top: -0.96rem;
			right: 0;
			background: rgba(0, 0, 0, 0.3);
			border: 0.02rem solid rgba(255, 255, 255, 0.3);
			border-radius: 50%;
			font-size: 0.24rem;
			color: #ffffff;
		}

		.addressDialog {
			width: 5.8rem;
			&-bgTop {
				width: 100%;
				vertical-align: text-bottom;
			}
			&-content {
				margin-top: -0.5rem;
				width: 100%;
				background-image: url(../../assets/images/blueBGDMiddle@2x.png);
				background-repeat: repeat;
				background-size: 100%;
				padding: 0.18rem 0.6rem;
				&-title {
					font-size: 0.4rem;
					font-weight: 500;
					color: #1d9aef;
				}
				input,
				textarea {
					margin-top: 0.27rem;
					border-radius: 0.1rem;
					width: 4.14rem;
					border: 0;
					padding-left: 0.32rem;
					font-size: 0.3rem;
					line-height: 0.7rem;
				}
				textarea {
					height: 2.06rem;
				}
				&-tip {
					font-size: 0.28rem;
					color: #757575;
					text-align: left;
					padding: 0 0.1rem;
				}
				&-cancel {
					width: 2.1rem;
					height: 0.72rem;
					line-height: 0.72rem;
					border: 0.02rem solid #ff0044;
					border-radius: 0.36rem;
					display: inline-block;
					font-size: 0.32rem;
					font-weight: 500;
					color: #ff0044;
					margin-right: 0.4rem;
					margin-bottom: 0.1rem;
				}
				&-submit {
					width: 2.1rem;
					height: 0.72rem;
					line-height: 0.72rem;
					border-radius: 0.36rem;
					background-color: #ff0044;
					display: inline-block;
					font-size: 0.32rem;
					font-weight: 500;
					color: #ffffff;
					margin-bottom: 0.1rem;
				}
			}
			&-bgBottom {
				margin-top: -0.2rem;
				width: 100%;
				vertical-align: text-top;
			}
		}
		.RuleDialog {
			width: 6.4rem;
			height: 8.73rem;
			background-color: #fef8f6;
			border-radius: 0.12rem;
			padding: 0 0.32rem;
			&-title {
				width: 5.76rem;
				height: 1rem;
				line-height: 1rem;
				font-size: 0.36rem;
				font-weight: 500;
				color: #324552;
				border-bottom: 0.01rem solid #bdcdd9;
			}
			&-content {
				margin-top: 0.39rem;
				width: 5.76rem;
				height: 7.33rem;
				overflow-y: auto;
				text-align: left;
				font-size: 0.28rem;
				color: #324552;
				.t1 {
					font-weight: 800;
				}
			}
		}
	}
}
@keyframes toShow {
	0% {
		transform: scale(0.1) rotate3d(0, 1, 0, 0deg);
	}
	100% {
		transform: scale(1) rotate3d(0, 1, 0, 1080deg);
	}
}
</style>

