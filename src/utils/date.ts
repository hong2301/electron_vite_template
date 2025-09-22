/**
 * 将身份证生日日期转位年月日
 * @param dateStr
 * @returns
 */
export const formatDateForBirthday = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr.length !== 8) return ''

  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)

  return `${year}年${month}月${day}日`
}

/**
 * 获取当前年月日
 * @returns 当前日期，格式为YYYY年MM月DD日
 */
export const getCurrentDate = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}年${month}月${day}日`
}

/**
 * 获取当前星期几
 * @returns 当前星期几
 */
export const getCurrentDayOfWeek = (): string => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const now = new Date()

  return days[now.getDay()]
}

/**
 * 获取当前时分秒
 * @returns 当前时间，格式为HH:MM:SS
 */
export const getCurrentTime = (mode: number = 3): string => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  switch (mode) {
    case 1:
      return `${hours}`
    case 2:
      return `${hours}:${minutes}`
    case 3:
      return `${hours}:${minutes}:${seconds}`
  }
  return `${hours}:${minutes}:${seconds}`
}
