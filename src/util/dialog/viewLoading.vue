<!--
 * @Description: 页面加载遮罩
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2020-11-19 14:42:35
 * @LastEditors: 水印红枫
-->
// 小原加载动画
// 上下伸缩加载五彩块
<template>
	<div id="viewLoading">
		<img
			id="fly"
			src="<%= BASE_URL %>static/xiaoyuan@2x.png"
			alt="..."
		/>
		<p id="text">正在加载中...</p>
		<!-- <div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div> -->
	</div>
</template>

<script>
export default {
	name: "viewLoading"
};
</script>

<style scoped>
#viewLoading {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	/* padding: 36vh 2.25rem; */
	z-index: 2000;
	background-color: rgba(0, 0, 0, 0.6);
}
#fly {
	width: 13vw;
	display: block;
	margin: 20vh auto 10px;
	animation: fly 2.5s linear 0s infinite normal;
}

#text {
	font-size: 3vw;
	text-align: center;
	color: #ffffff;
}

@keyframes fly {
	0% {
		transform: translateY(0);
	}

	25% {
		transform: translateY(-40px);
	}

	50% {
		transform: translateY(0);
	}

	60% {
		transform: translateY(-10px);
	}

	70% {
		transform: translateY(0);
	}

	80% {
		transform: translateY(-10px);
	}

	90% {
		transform: translateY(0);
	}

	100% {
		transform: translateY(0);
	}
}
/* #viewLoading div {
	width: 0.2rem;
	height: 1rem;
	margin: 0.2rem;
	display: inline-block;
	background-color: #e83030;
	border-radius: 40%;
}

#viewLoading div:nth-child(1) {
	animation: loading 0.4s ease 0s infinite alternate;
}

#viewLoading div:nth-child(2) {
	animation: loading 0.4s ease 0.08s infinite alternate;
}

#viewLoading div:nth-child(3) {
	animation: loading 0.4s ease 0.16s infinite alternate;
}

#viewLoading div:nth-child(4) {
	animation: loading 0.4s ease 0.24s infinite alternate;
}

#viewLoading div:nth-child(5) {
	animation: loading 0.4s ease 0.32s infinite alternate;
}

@keyframes loading {
	from {
		transform: scaleY(0.3);
	}

	to {
		transform: scaleY(2); 
	}
}*/
</style>
