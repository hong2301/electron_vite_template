import { delay } from './delay'

interface AudioPlayer {
  /**
   * 播放文本语音
   * @param text - 要朗读的文本
   * @param pan - 声道设置 ('left'|'right'|'center')
   * @param volume - 音量 (0-1)
   * @param rate - 播放速率 (0.1-10)
   * @returns 播放完成的Promise
   */
  play(
    text: string,
    pan?: 'left' | 'right' | 'center',
    volume?: number,
    rate?: number
  ): Promise<void>
}

// 音频播放器单例
export const audioPlayer: AudioPlayer = (function () {
  let audioContext: AudioContext | null = null
  let currentPanner: StereoPannerNode | null = null
  let currentGain: GainNode | null = null
  let currentUtterance: SpeechSynthesisUtterance | null = null

  // 初始化音频上下文
  function initAudioContext(): AudioContext {
    if (!audioContext) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContext
  }

  // 清理资源
  function cleanup() {
    if (currentUtterance) {
      // 移除事件监听器
      currentUtterance.onend = null
      currentUtterance.onerror = null
      currentUtterance = null
    }

    // 停止语音合成
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    // 断开音频节点连接
    if (currentGain) {
      try {
        currentGain.disconnect()
      } catch (e) {
        // 忽略断开连接时的错误
      }
      currentGain = null
    }

    if (currentPanner) {
      try {
        currentPanner.disconnect()
      } catch (e) {
        // 忽略断开连接时的错误
      }
      currentPanner = null
    }
  }

  window.addEventListener('beforeunload', cleanup)
  window.addEventListener('unload', cleanup)

  return {
    async play(
      text: string,
      pan: 'left' | 'right' | 'center' = 'center',
      volume = 1,
      rate = 1
    ): Promise<void> {
      // 立即清理之前的资源
      cleanup()
      await delay(100)

      try {
        const audioCtx = initAudioContext()

        // 创建音频节点
        currentGain = audioCtx.createGain()
        currentPanner = audioCtx.createStereoPanner()

        // 设置音量
        currentGain.gain.value = volume

        // 设置声道
        switch (pan) {
          case 'left':
            currentPanner.pan.value = -1
            break
          case 'right':
            currentPanner.pan.value = 1
            break
          default:
            currentPanner.pan.value = 0
        }

        // 连接节点
        currentGain.connect(currentPanner)
        currentPanner.connect(audioCtx.destination)

        // 创建语音合成实例
        currentUtterance = new SpeechSynthesisUtterance(text)
        currentUtterance.rate = rate

        return new Promise((resolve) => {
          // 处理播放结束
          currentUtterance!.onend = () => {
            cleanup()
            resolve()
          }

          // 处理错误 - 只记录非"interrupted"的错误
          currentUtterance!.onerror = (event: SpeechSynthesisErrorEvent) => {
            if (event.error !== 'interrupted') {
              console.error('SpeechSynthesis error:', event)
            }
            cleanup()
            resolve()
          }

          // 开始播放
          window.speechSynthesis.speak(currentUtterance!)
        })
      } catch (error) {
        console.error('Audio playback error:', error)
        cleanup()
        throw error
      }
    }
  }
})()
