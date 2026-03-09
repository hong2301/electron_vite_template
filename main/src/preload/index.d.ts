import { ElectronAPI } from '@electron-toolkit/preload'
import type { resType } from '@/types/index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      cmd: {
        close: () => promises<resType>
        shutDown: () => promises<resType>
        restart: () => promises<resType>
      }
      config: {
        get: () => promises<configType>
        set: (data: configType) => promises<resType>
      }
    }
  }
}
