/*
 * @Description: vuex文件
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-05-06 15:16:24
 * @LastEditors: 水印红枫
 */
// store.ts
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { RouteLocationNormalized } from "vue-router"

import home, { HomeStateType, HomeMutationsType, HomeActionsType } from "./module/home"

export interface initRouteType {
  name: string
  meta: {
    title: string
  }
}
// 为 store state 声明类型
export interface BaseStateType {
  startPage: RouteLocationNormalized | initRouteType
  fromPage: RouteLocationNormalized | initRouteType
  currentPage: RouteLocationNormalized | initRouteType
  loginSign: string
  deviceId: string
  scrollBottom: boolean
  bodyColor: string
}

// 定义局部的mutations类型
export interface BaseMutationsType {
  update_state: (obj: Partial<BaseStateType>) => void
}

// 定义局部的actions类型
export interface BaseActionsType {}

// 定义全部的state类型
export interface AllStateType extends BaseStateType {
  home: HomeStateType
}

// 定义全部的mutations类型
export interface AllMutationsType extends BaseMutationsType {
  home: HomeMutationsType
}

// 定义全部的actions类型
export interface AllActionsType extends BaseActionsType {
  home: HomeActionsType
}

export default createStore<BaseStateType>({
  state: {
    startPage: { name: "", meta: { title: "" } },
    fromPage: { name: "", meta: { title: "" } },
    currentPage: { name: "", meta: { title: "" } },
    loginSign: "",
    deviceId: "",
    scrollBottom: false,
    bodyColor: "#FFFFFF"
  },
  getters: {
    startPage: (state: BaseStateType) => state.startPage,
    fromPage: (state: BaseStateType) => state.fromPage,
    currentPage: (state: BaseStateType) => state.currentPage,
    loginSign: (state: BaseStateType) => state.loginSign,
    deviceId: (state: BaseStateType) => state.deviceId,
    scrollBottom: (state: BaseStateType) => state.scrollBottom,
    bodyColor: (state: BaseStateType) => state.bodyColor
  },
  mutations: {
    update_state(state: BaseStateType, obj: Partial<BaseStateType>) {
      Object.assign(state, obj)
    }
  },
  actions: {
    // setcurrentPage({ commit }, val) {
    //   commit("setcurrentPage", val);
    // }
  },
  modules: {
    home
  }
})

// 定义 injection key
export const key: InjectionKey<Store<AllStateType>> = Symbol()

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key)
}