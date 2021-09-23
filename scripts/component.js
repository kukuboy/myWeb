/*
 * @Description: 组件快速生成脚本
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
    {{componentData.componentName}}
  </div>
</template>

<script lang="ts">
  import { ref,inject } from "vue"
  import { Vue, Options, setup,prop } from "vue-class-component"
  import { ${capPirName}Type } from "@/types/components/${dirName}.interface"
  class Props{
    // optional prop
  // foo?: string
  // required prop
  // bar!: string
  // optional prop with default
  speed = prop<number>({ default: 100 })
  delay = prop<number>({ default: 2000 })
  close = prop<boolean>({ default: false })
  isShow = prop<boolean>({ default: true })
}
  @Options({})
  export default class ${capPirName} extends Vue.with(Props) {
    setupObject = setup(() => {
      const abc = ref(222)
      const a = inject('abc')
      return {
        abc ,a
      }
    })
    // data
    componentData: ${capPirName}Type = {
      componentName: '${dirName}'
    }
    unmounted() {
      //
    }
    created() {
      //
    }

    activated() {
      //
    }

    mounted() {
      //
    }

  }
</script>

<style lang="scss">
  .${dirName} {
    width: 100%;
  }
</style>

`;

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export interface ${capPirName}Type {
  componentName: string
}

`;

if (!fs.existsSync(`${basePath}/components`)) {
  fs.mkdirSync(`${basePath}/components`);
}
fs.mkdirSync(`${basePath}/components/${dirName}`); // mkdir

process.chdir(`${basePath}/components/${dirName}`); // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep); // vue

// 创建文件夹目录
if (!fs.existsSync(`${basePath}/types`)) {
  fs.mkdirSync(`${basePath}/types`);
}
if (!fs.existsSync(`${basePath}/types/components`)) {
  fs.mkdirSync(`${basePath}/types/components`);
}
process.chdir(`${basePath}/types/components`); // cd components
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep); // interface

process.exit(0);
