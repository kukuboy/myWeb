import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { BaseStateType } from "../index"
//import * as HomeApi from '@/api/home'

// VUEX home.State 参数类型
export interface HomeStateType {
  pageName: string
}

// 定义局部的mutations类型
export interface HomeMutationsType {
  update_state: (obj: Partial<HomeStateType>) => void
}

// 定义局部的actions类型
export interface HomeActionsType {}

const state: HomeStateType = {
  pageName: "home"
}

// 使用getter获取state
const getters: GetterTree<HomeStateType, BaseStateType> = {
  pageName: (state: HomeStateType) => state.pageName
}

// 更改state
const mutations: MutationTree<HomeStateType> = {
  update_state(state: HomeStateType, obj: Partial<HomeStateType>) {
    Object.assign(state, obj)
  }
}

const actions: ActionTree<HomeStateType, BaseStateType> = {
  // updatepageName({ commit }, data: obj: Partial<HomeStateType>) {
  //   commit("update_state", data)
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
