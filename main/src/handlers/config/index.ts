import { configType } from '@/types/config'
import { IpcMain, IpcMainInvokeEvent } from 'electron'
import fs from 'fs'
import path from 'path'

const envPath = process.env.DEPENDENCE_PATH ?? 'D:'
// 配置文件路径
const configPath = path.join(envPath, 'config.json')

const config = (ipcMain: IpcMain) => {
  ipcMain.handle('config:get', async () => {
    try {
      if (!fs.existsSync(configPath)) {
        throw new Error(
          `配置文件不存在: ${configPath}\n` +
            `可通过设置环境变量 DEPENDENCE_PATH 来指定配置文件路径`
        )
      }
      const raw = fs.readFileSync(configPath, 'utf-8')
      const parsed = JSON.parse(raw)
      return { code: 200, message: `已读取${configPath}文件内容`, data: parsed }
    } catch (error) {
      return {
        code: 500,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
  ipcMain.handle('config:set', async (_event: IpcMainInvokeEvent, data: configType) => {
    try {
      // 将配置对象转换为格式化的JSON字符串
      const jsonString = JSON.stringify(data, null, 2)
      // 验证生成的JSON字符串是否有效
      JSON.parse(jsonString)
      // 写入文件
      fs.writeFileSync(configPath, jsonString, 'utf-8')
      console.log(`配置文件已更新: ${configPath}`)
      return { code: 200, message: '配置更新成功', data: jsonString }
    } catch (err) {
      const errorMessage = `配置字符串格式错误或写入失败\n${(err as Error).message}`
      return {
        code: 500,
        message: errorMessage
      }
    }
  })
}

export default config
