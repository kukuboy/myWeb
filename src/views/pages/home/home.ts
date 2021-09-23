import { Options } from "vue-class-component"
import Mixin from "@/util/mixins"
import HomeType from "@/types/views/pages/home.interface"
// import demo from "@/components/demo" // 组件
@Options({
  components:{
  }
})
export default class Home extends Mixin {
  // declare $refs: {
  //   demo: HTMLImageElement
  // }

  // data
  pageName: HomeType["pageName"] = "home"
  pre: string = "123"
  // setupNumber = setup<Ref<number>>(() => ref(111))
  // setupObject = setup(() => {
  // const key: InjectionKey<string> = Symbol()
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
