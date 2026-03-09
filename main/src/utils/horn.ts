export function play(
  text: string,
  volume = 1,
  rate = 1
): Promise<void> {
  return new Promise((resolve) => {
    // 开始前先停止之前的
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = volume
    utterance.rate = rate

    const cleanup = () => {
      utterance.onend = null
      utterance.onerror = null
      window.speechSynthesis.cancel()
    }

    utterance.onend = () => {
      cleanup()
      resolve()
    }

    utterance.onerror = () => {
      cleanup()
      resolve()
    }

    window.speechSynthesis.speak(utterance)
  })
}