/*
 * @Description: 页面快速生成脚本
 * @Author: 水印红枫
 * @Editor: 水印红枫
 * @Date: 2021-04-30 15:36:52
 * @LastEditors: 水印红枫
 */
const fs = require("fs");
const path = require("path");
const basePath = path.resolve(__dirname, "../src");

const dirName = process.argv[2];
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
  console.log("文件夹名称不能为空！");
  console.log("示例：npm run tep ${capPirName}");
  process.exit(0);
}

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}">
    {{pageName}}
  </div>
</template>

<script lang="ts" src="./${dirName}.ts"></script>

<style lang="scss">
  @import './${dirName}.scss'
</style>

`;

// ts 模版
const tsTep = `import { ref, Ref, provide } from "vue"
import { Vue, Options, setup } from "vue-class-component"
import Mixin from "@/util/mixins"
import ${capPirName}Type from "@/types/views/pages/${dirName}.interface"
// import KHeader from "@/components/KHeader/KHeader.vue" // 组件
// const ${dirName} = namespace("${dirName}")
@Options({
  // components:{
  //   KHeader
  // }
})
export default class ${capPirName} extends Mixin {
  // declare $refs: {
  //   demo: HTMLImageElement
  // }

  // data
  pageName: ${capPirName}Type["pageName"] = "${dirName}"
  pre: string = "123"
  setupNumber = setup<Ref<number>>(() => ref(111))
  // setupObject = setup(() => {
  //   const abc = ref(123)
  //   provide(a, 'abc) // 提供非字符串值将导致错误
  //   return {
  //     abc, a
  //   }
  // })
  // unmounted(){
  // }
  // created() {
  // }
  // activated() {
  // }
  mounted() {
    this.init()
  }

  // 初始化函数
  init() {
    //
  }

}
`;

// scss 模版
const scssTep = `.${dirName} {
  width: 100%;
}
`;

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export default interface ${capPirName}Type {
  pageName: string
}

// GET_DATA_ASYN 接口参数类型
// export interface DataOptions {}

`;

// vuex 模版
const vuexTep = `import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { BaseStateType } from "../index"

// VUEX ${dirName}.State 参数类型
export interface ${capPirName}StateType {
  pageName: string
}

// 定义局部的mutations类型
export interface ${capPirName}MutationsType {
  update_state: (obj: Partial<${capPirName}StateType>) => void
}

// 定义局部的actions类型
export interface ${capPirName}ActionsType {}

const state: ${capPirName}StateType = {
  pageName: "${dirName}"
}

// 强制使用getter获取state
const getters: GetterTree<${capPirName}StateType, BaseStateType> = {
  pageName: (state: ${capPirName}StateType) => state.pageName
}

// 更改state
const mutations: MutationTree<${capPirName}StateType> = {
  update_state(state: HomeStateType, obj: Partial<HomeStateType>) {
    Object.assign(state, obj)
  }
}

const actions: ActionTree<${capPirName}StateType, BaseStateType> = {
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
`;

// api 接口模版
const apiTep = `import { AxiosPromise } from "axios"
import { httpA, ApiResponse } from "../index"
export interface ${capPirName}ApiType {
    // demo(data: { sign: string }): AxiosPromise<ApiResponse>
}
export default {
    // // TODO接口名称
    // demo(data: { sign: string }) {
    //     return httpA({
    //         url: "/h5/demo",
    //         data,
    //         method: "POST"
    //     });
    // },
} as ${capPirName}ApiType
`
// 创建文件夹目录
if (!fs.existsSync(`${basePath}/views`)) {
  fs.mkdirSync(`${basePath}/views`);
}
if (!fs.existsSync(`${basePath}/views/pages`)) {
  fs.mkdirSync(`${basePath}/views/pages`);
}
// 创建文件夹目录
fs.mkdirSync(`${basePath}/views/pages/${dirName}`); // mkdir

process.chdir(`${basePath}/views/pages/${dirName}`); // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep); // vue
fs.writeFileSync(`${dirName}.ts`, tsTep); // ts
fs.writeFileSync(`${dirName}.scss`, scssTep); // scss

// 创建类型目录
if (!fs.existsSync(`${basePath}/types`)) {
  fs.mkdirSync(`${basePath}/types`);
}
if (!fs.existsSync(`${basePath}/types/views`)) {
  fs.mkdirSync(`${basePath}/types/views`);
}
// 创建页面
if (!fs.existsSync(`${basePath}/types/views/pages`)) {
  fs.mkdirSync(`${basePath}/types/views/pages`);
}
process.chdir(`${basePath}/types/views/pages`); // cd types
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep); // interface

// 添加vuex
if (!fs.existsSync(`${basePath}/store/module`)) {
  fs.mkdirSync(`${basePath}/store/module`);
}
process.chdir(`${basePath}/store/module`); // cd store
fs.writeFileSync(`${dirName}.ts`, vuexTep); // vuex

// 添加api
if (!fs.existsSync(`${basePath}/request/module`)) {
  fs.mkdirSync(`${basePath}/request/module`);
}
process.chdir(`${basePath}/request/module`); // cd request
fs.writeFileSync(`${dirName}.ts`, apiTep); // request

process.exit(0);
