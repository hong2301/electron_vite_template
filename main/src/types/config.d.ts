import type { resType } from './index'
export interface configType extends resType {
  time: timeConfigType
  foundation: foundationConfigType
}
export interface timeConfigType {
  isOpen: number | boolean
  process1:number
  over: number
}

export interface foundationConfigType {
  fontSize: number
  isTest: string
  backPassword: string
  dataPath: string
}
