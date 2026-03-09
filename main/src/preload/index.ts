import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { configType } from '@/types/config'

// Custom APIs for renderer
const api = {
  cmd: {
    close: () => ipcRenderer.invoke('cmd:close'),
    shutDown: () => ipcRenderer.invoke('cmd:shutDown'),
    restart: () => ipcRenderer.invoke('cmd:restart')
  },
  config: {
    get: () => ipcRenderer.invoke('config:get'),
    set: (data: configType) => ipcRenderer.invoke('config:set', data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
