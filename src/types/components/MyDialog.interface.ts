// MyDialog.Data 参数类型
// import { BoxType } from "@/types/views/pages/home.interface"
// import { MyPrize } from "@/types/views/pages/myPrize.interface"
// export { BoxType, MyPrize }



export interface MyDialogDataPropsType {
  type: string
  time?: number
  RuleDialogContent?: string,
  // addressDialogContent?: MyPrize
}

export interface MyDialogActionDataType {
  type: string
}

export interface FormData {
  name: string,
  phone: string,
  address: string
}
