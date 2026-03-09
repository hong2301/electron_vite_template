export interface projectType {
  name: string
  icon: DefineComponent
  icon1?: DefineComponent
  processData?: processDataType
  process: processType[]
}

export interface processDataType {
}


export interface processType {
  name: string
  path: string
  key: string
  timeout: number
  des: string
}