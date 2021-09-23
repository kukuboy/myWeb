<!--
 * @Description: 确认弹窗
 * @Author: 水印红枫
 * @Date: 2020-07-10 15:53:48
 * @LastEditors: 水印红枫
-->
<template>
  <div id="confirm" v-if="confirm_show">
    <diV class="frame" :style="style">
      <img class="close" @click="close" src="@/assets/images/close.png" />
      <div class="title" v-if="title !== ''">{{ title }}</div>
      <div class="body text" v-if="type === 'text'">{{ text }}</div>
      <div class="body html" v-if="type === 'html'" v-html="text"></div>
      <div class="bottom">
        <button class="button" @click="close">{{ button_text }}</button>
      </div>
    </diV>
  </div>
</template>
<script>
export default {
  name: "confirm",
  props: {
    confirm_show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "提示"
    },
    type: {
      type: String,
      default: "text"
    },
    text: {
      type: String,
      default: "这是一条提示"
    },
    button_text: {
      type: String,
      default: "确认"
    },
    theme: {
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      style: "background-color: #FFFFFF;color:black"
    };
  },
  watch: {
    theme: {
      handler(newVal) {
        this.themeInit(newVal);
      },
      immediate: true
    }
  },
  methods: {
    themeInit(val) {
      if (val === "red") {
        this.style = "background-color: red;color:#FFFFFF";
      }
    },
    close() {
      let vm = document.getElementById("confirm");
      if (vm !== null) {
        document.body.removeChild(vm);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.confirm {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.8);
  .frame {
    position: absolute;
    width: 70%;
    left: 15%;
    top: 30%;
    background-color: #ffffff;
    border-radius: 15px;
    // box-shadow: 5px 5px 5px #ffffff;
    text-align: center;
    .close {
      position: absolute;
      width: 30px;
      top: -35px;
      right: 0;
    }
    .title {
      font-size: 0.4rem;
      font-weight: 600;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      padding: 0.2rem;
      background-color: red;
      color: #ffffff;
    }
    .body {
      padding: 0.4rem 0.5rem 0 0.5rem;
      font-size: 0.3rem;
    }
    .text {
      font-size: 0.3rem;
    }
    .bottom {
      position: relative;
      width: 100%;
      //   border-radius: 15px;
      .button {
        font-size: 0.4rem;
        position: relative;
        width: 50%;
        height: 0.8rem;
        margin: 0.3rem;
        box-shadow: 3px 3px 3px #000000;
        border-radius: 0.4rem;
        font-weight: 500;
        line-height: 0.8rem;
        background-color: red;
        color: #ffffff;
      }
    }
  }
}
</style>
