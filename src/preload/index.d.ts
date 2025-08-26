import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      test: {
        echo: (str: string) => promises<string>
      }
    }
  }
}
