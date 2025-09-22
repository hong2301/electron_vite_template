export interface projectType {
  name: string
  icon: DefineComponent
  process: processType[]
}

export interface processType {
  name: string
  path: string
  key: string
  input: Record<string, unknown | string>
  result: Record<string, unknown | string>
  timeout: number
  des: string
}
