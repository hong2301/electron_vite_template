export interface cmdType {
  icon: DefineComponent
  label: string
  type?: string
  dir?: 'left' | 'right'
  operation: function
}
