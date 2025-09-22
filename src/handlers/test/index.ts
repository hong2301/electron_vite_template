import { echoReqType } from '@/types/test'
import { IpcMain, IpcMainInvokeEvent } from 'electron'

const test = (ipcMain: IpcMain) => {
  ipcMain.handle('test:echo', async (_event: IpcMainInvokeEvent, str: echoReqType) => {
    try {
      return { code: 200, message: 'ok', data: str }
    } catch (error) {
      return {
        code: 500,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
}

export default test
