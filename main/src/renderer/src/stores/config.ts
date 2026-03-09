import { ref } from 'vue'
import { defineStore } from 'pinia'
import { configType } from '@/types/config'

export const useConfigStore = defineStore(
  'config',
  () => {
    const data = ref<configType>({
      time: {
        isOpen: 0,
        process1: 0,
        over: 0
      },
      foundation: {
        fontSize: 0,
        isTest: '',
        backPassword: '',
        dataPath: ''
      }
    })

    return { data }
  },
  {
    persist: true
  }
)
