export interface reportType {
  isOpen: boolean
  title: string
  content: string
  type: 'danger' | 'primary' | undefined
  timeout: number
}
