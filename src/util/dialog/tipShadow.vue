<!--
 * @Description: 提示遮罩
 * @Author: 水印红枫
 * @Date: 2020-07-02 16:46:07
 * @LastEditors: 水印红枫
-->
<template>
	<div
		id="tipShadow"
		@click="close"
	>
		<div v-if="type === 'share'">
			<img
				src="@/assets/images/arrow.png"
				alt=""
			/>
			<h1>如何进行分享</h1>
			<div class="det">
				<p><em>1</em> 点击右上角 · · · 按钮</p>
				<p><em>2</em> 选择“发送给朋友”或“分享到朋友圈”</p>
			</div>
		</div>
		<div v-else-if="type === 'download'">
			<img
				src="@/assets/images/arrow.png"
				alt=""
			/>
			<h1>如何进行下载</h1>
			<div class="det">
				<p><em>1</em> 点击右上角 · · · 按钮</p>
				<p v-if="plat === 'ios'"><em>2</em> 选择“在Safari中打开”</p>
				<p v-else><em>2</em> 选择“在浏览器中打开”</p>
			</div>
		</div>
		<div v-else></div>
	</div>
</template>
<script>
import { checkPlatform } from "../myUtil";
export default {
	name: "tipShadow",
	props: {
		type: {
			type: String,
			default: "share"
		}
	},
	data() {
		return {
			plat: checkPlatform("plat")
		};
	},
	methods: {
		close() {
			let vm = document.getElementById("TipShadow");
			if (vm !== null) {
				document.body.removeChild(vm);
			}
		}
	}
};
</script>
<style scoped lang="scss">
#tipShadow {
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	z-index: 2001;
	color: #ffffff;
	text-align: center;
	background-color: rgba(0, 0, 0, 0.8);
	h1 {
		position: relative;
		margin: 30px;
		margin-top: 50px;
		font-size: 25px;
	}
	p {
		text-align: left;
		margin: 20px;
		font-size: 18px;
		em {
			text-align: center;
			width: 25px;
			height: 25px;
			line-height: 25px;
			display: inline-block;
			border-radius: 50%;
			background-color: #ffffff;
			color: rgba(0, 0, 0, 0.8);
		}
	}
	img {
		position: absolute;
		right: 0;
		top: 0;
		width: 15%;
	}
}
</style>
