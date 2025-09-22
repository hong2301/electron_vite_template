export interface rerultType {
  code: number
  message: string
  data?: Record<string, unknown | string>
}

export interface cmdType {
  icon: DefineComponent
  label: string
  operation: function
}
