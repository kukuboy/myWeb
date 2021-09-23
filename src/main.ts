/*
 * @Description: 入口文件
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-04-30 11:07:54
 * @LastEditors: 水印红枫
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import { Store } from 'vuex'

import { default as http, Api } from "@/request"
import { default as dialog, Dialog } from "@/util/dialog"
import { default as store, key, AllStateType } from '@/store'


import { addVConsole, getQueryVariable, preloadImg } from "@/util/myUtil";

// 声明挂载的类型
import { ComponentCustomProperties } from 'vue'
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<AllStateType>
        $http: Api
        $dialog: Dialog
    }
}

const app = createApp(App)

// 捕捉错误
app.config.errorHandler = http.errorHandler

app.use(http)
app.use(dialog)
app.use(store, key)
app.use(router)


// 预加载图片的数组
const imgData: string[] = []
preloadImg(imgData)
// 根据参数增加vconsole
if (getQueryVariable("VConsole") !== "") {
    addVConsole().finally(() => {
        // 进行最后的挂载
        router.isReady().then(() => app.mount('#app'))
    })
} else {
    // 进行最后的挂载
    router.isReady().then(() => app.mount('#app'))
}