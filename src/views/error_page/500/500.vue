<style lang="scss">
@import "./500.scss";
</style>

<template>
  <div class="error500">
    <div class="error500-body-con">
      <Card>
        <div class="error500-body-con-title">
          5<span class="error500-0-span"
            ><i type="social-freebsd-devil"></i></span
          ><span class="error500-0-span"
            ><i type="social-freebsd-devil"></i
          ></span>
        </div>
        <p class="error500-body-con-message">Oops! the server is wrong</p>
        <div class="error500-btn-con">
          <button class="backtop" @click="goHome" size="large" type="text">
            返回首页
          </button>
          <button
            @click="backPage"
            size="large"
            style="margin-left: 40px;"
            type="primary"
          >
            返回上一页
          </button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error500",
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push({
        name: "/"
      });
    }
  }
};
</script>
