import { ElectronAPI } from '@electron-toolkit/preload'
import type { echoReqType } from '@/types/test'
import type { rerultType } from '@/types/index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      test: {
        echo: (str: echoReqType) => promises<rerultType>
      }
    }
  }
}
