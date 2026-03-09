import { app, IpcMain } from 'electron'
import { promisify } from 'util'
import { exec } from 'child_process'

const dependencyPath = process.env.DEPENDENCE_PATH
const execAsync = promisify(exec)

const cmd = (ipcMain: IpcMain) => {
  ipcMain.handle('cmd:close', async () => {
    try {
      const command = `quit.bat`
      await execAsync(command, {
        cwd: `${dependencyPath}` // 指定工作目录
      })
      app.quit()
      return { code: 200, message: 'ok' }
    } catch (error) {
      return {
        code: 500,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
  ipcMain.handle('cmd:shutDown', async () => {
    try {
      const command = `shutdown /s /f /t 0`
      await execAsync(command, {
        cwd: `${dependencyPath}` // 指定工作目录
      })
      return { code: 200, message: 'ok' }
    } catch (error) {
      return {
        code: 500,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
  ipcMain.handle('cmd:restart', async () => {
    try {
      const command = `shutdown /r /t 0`
      await execAsync(command, {
        cwd: `${dependencyPath}` // 指定工作目录
      })
      return { code: 200, message: 'ok' }
    } catch (error) {
      return {
        code: 500,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
}

export default cmd
