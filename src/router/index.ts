/*
 * @Description: 路由文件
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-04-30 15:48:44
 * @LastEditors: 水印红枫
 */

import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import routes from './router';
import store, { AllMutationsType } from "@/store"
import sensors from "@/util/sensors"

const update_state: AllMutationsType["update_state"] = obj => store.commit("update_state", obj)


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


// 跳转之前
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // const token = getToken()
    if (
        process.env.VUE_APP_ACTIVITYEND === "true" &&
        to.name !== "activityEnd" &&
        new Date().getTime() > process.env.VUE_APP_ACTIVITYENDTIME &&
        process.env.VUE_APP_ACTIVITYEND
    ) {
        next({
            name: "activityEnd"
        });
    } else {
        if (!from.name) { update_state({ startPage: to }); }
        update_state({ fromPage: from, currentPage: to, bodyColor: String(to.meta.bodyColor) || "#e83030", scrollBottom: false });
        sensors.trackView();
        next();
    }
});


// 跳转之后
router.afterEach(() => {
    // 到达新页面后，自动到顶部
    window.scrollTo(0, 0)
});

export default router;
