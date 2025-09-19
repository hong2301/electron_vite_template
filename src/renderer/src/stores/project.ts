import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { projectType } from '@renderer/types/project'
import { useRouter } from 'vue-router'

const router = useRouter()

export const useProjectStore = defineStore(
  'project',
  () => {
    // 当前项目
    const nowProject = ref<projectType>({
      name: '',
      process: [],
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
        router.push('/')
      }
    }

    // 返回
    const back = () => {
      const step = getStep() - 1
      if (step >= 0) {
        router.push(nowProject.value.process[step].path)
      } else {
        router.push('/')
      }
    }

    // 设置当前步骤获取的数据
    const setVlaueForNowProject = (key: string, value: unknown) => {
      const step = getStep()
      if (step >= 0 && step < nowProject.value.process.length) {
        nowProject.value.process[step].result[key] = value
      }
    }

    // 获取当前项目获取的数据
    const getNowProject = () => {
      const projectData: Record<string, unknown | Record<string, unknown | string>> = {}
      nowProject.value.process.forEach((item) => {
        if (item && item.key && item.result && typeof item.result === 'object') {
          projectData[item.key] = item.result
        }
      })
      projectData.projectName = nowProject.value.name
      return projectData
    }

    // 获取当前步骤的输入
    const getNowStepInput = () => {
      return nowProject.value.process[getStep()].input
    }

    return {
      mountProject,
      nextStep,
      setVlaueForNowProject,
      nowProject,
      back,
      getStep,
      getNowProject,
      getNowStepInput
    }
  },
  {
    persist: true
  }
)
