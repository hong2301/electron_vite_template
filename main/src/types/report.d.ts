import { cmdType } from "."

/**
 * 报告组件配置接口
 * @description 用于配置弹窗报告的显示和行为
 */
export interface reportType {
  /** 是否显示报告 */
  isOpen?: boolean

  /** 弹窗标题 */
  title: string
  
  /** 弹窗内容文本 */
  content: string
  
  /** 弹窗类型：danger-警告/primary-主要/undefined-默认 */
  type: 'danger' | 'primary' | undefined
  
  /** 自动关闭时间（毫秒） */
  timeout: number
  
  /** 弹窗宽度（可选，默认自适应） */
  width?: number
  
  /** 弹窗高度（可选，默认自适应） */
  height?: number
  
  /** 报告收起高度 */
  ty?: number
  
  /** 是否在首页显示 */
  isHome?: boolean
  
  /** 是否需要重新加载 */
  isRe?: boolean
  
  /** 自定义工具栏 */
  reportCmds?: cmdType[]
}