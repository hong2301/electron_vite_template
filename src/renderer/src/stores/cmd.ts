import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCmdStore = defineStore('cmd', () => {
  const home = ref(false)
  const back = ref(false)

  const close = () => {
    home.value = false
    back.value = false
  }

  return { home, back, close }
})
