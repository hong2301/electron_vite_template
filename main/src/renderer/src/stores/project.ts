import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { projectType } from '@/types/project'
import router from '@renderer/router'
import { useCmdStore } from './cmd'

export const useProjectStore = defineStore(
  'project',
  () => {
    // 当前项目
    const nowProject = ref<projectType>({
      name: '',
      process: [],
      processData: {},
      icon: null
    })

    // 挂载项目
    const mountProject = (project: projectType) => {
      nowProject.value = project
    }

    // 获取当前步骤
    const getStep = () => {
      let step = -1
      const currentUrl = window.location.href
      nowProject.value.process.forEach((item, index) => {
        if (currentUrl.includes(item.path)) {
          step = index
        }
      })
      return step
    }

    // 下一步
    const nextStep = () => {
      const step = getStep() + 1
      if (step < nowProject.value.process.length) {
        router.push(nowProject.value.process[step].path)
      } else {
        useCmdStore().refresh = true
        router.replace('/')
      }
    }

    // 返回
    const back = () => {
      const step = getStep() - 1
      if (step >= 0) {
        router.push(nowProject.value.process[step].path)
      } else {
        useCmdStore().refresh = true
        router.replace('/')
      }
    }

    // 设置当前步骤获取的数据
    const setVlaueForNowProject = (key: string, value: unknown) => {
      if (!nowProject?.value?.processData) {
        nowProject.value.processData = {}
      }
      if (nowProject?.value?.processData) {
        nowProject.value.processData[key] = value
      }
    }

    // 获取当前步骤的计时
    const getNowStepTimeout = () => {
      return nowProject.value.process[getStep()].timeout
    }

    return {
      mountProject,
      nextStep,
      setVlaueForNowProject,
      nowProject,
      back,
      getStep,
      getNowStepTimeout
    }
  },
  {
    persist: true
  }
)
