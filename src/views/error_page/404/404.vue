<style lang="scss">
@import "./404.scss";
</style>

<template>
  <div class="error404">
    <div class="error404-body-con">
      <div>
        <div class="error404-body-con-title">4<span>0</span>4</div>
        <p class="error404-body-con-message">
          YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST
        </p>
        <div class="error404-btn-con">
          <button
            class="backtop"
            @click="goHome"
            size="large"
            style="width: 2.2rem;"
            type="text"
          >
            返回首页
          </button>
          <button
            class="backprev"
            @click="backPage"
            size="large"
            style="width: 2.2rem;margin-left: 40px;"
            type="primary"
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error404",
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push({
        path: "/"
      });
    }
  }
};
</script>
