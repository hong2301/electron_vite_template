<template>
  <el-progress
    type="circle"
    indeterminate
    :percentage="Math.max(0, Math.min(timeoutPercentage, 100))"
    :width="100 * size"
    status="exception"
  >
    <template #default>
      <div
        class="w-label1 timeout-text"
        :style="{ fontSize: `${warning ? 3.5 * size : 1.6 * size}rem` }"
      >
        {{ Math.floor(timeout) }}
      </div>
    </template>
  </el-progress>
  <report
    v-if="reportOpen"
    :title="reportData.title"
    :content="reportData.content"
    :timeout-value="reportData.timeout"
    :type="reportData.type"
    class="report"
  />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import report from './report.vue'
import router from '@renderer/router'

const props = defineProps({
  size: {
    type: Number,
    default: 1
  },
  value: {
    type: Number,
    default: 7
  },
  reportData: {
    type: Object,
    default: () => ({
      isOpen: false,
      title: '标题1',
      content: '内容',
      type: 'primary',
      timeout: 3
    })
  }
})
const timeout = ref(props.value)
const timeoutPercentage = ref(100)
const warning = ref(false)
let setIntervalData1: NodeJS.Timeout | null = null
let setIntervalData2: NodeJS.Timeout | null = null
let setTimeoutData1: NodeJS.Timeout | null = null
const timeOver = ref(false)
const reportOpen = ref(false)

// 时间运行
const runTime = (value: number) => {
  timeout.value = value
  setIntervalData1 = setInterval(() => {
    timeout.value -= 1
    if (
      timeout.value === 5 ||
      timeout.value === 4 ||
      timeout.value === 3 ||
      timeout.value === 2 ||
      timeout.value === 1 ||
      timeout.value === 0
    ) {
      warning.value = true
      setTimeoutData1 = setTimeout(() => {
        warning.value = false
        if (timeout.value <= 0) {
          clear()
          timeOver.value = true
        }
      }, 200)
    }
  }, 1000)
}

// 时间运行1
const runTime1 = (value: number) => {
  let temp = value
  setIntervalData2 = setInterval(() => {
    temp -= 0.1
    timeoutPercentage.value = (temp / value) * 100
  }, 100)
}

const clear = async () => {
  if (setIntervalData1) clearInterval(setIntervalData1)
  if (setIntervalData2) clearInterval(setIntervalData2)
  if (setTimeoutData1) clearTimeout(setTimeoutData1)
}

onMounted(() => {
  runTime(props.value)
  runTime1(props.value)
})
onUnmounted(() => {
  clear()
})

watch(
  () => timeOver.value,
  (newValue) => {
    if (newValue) {
      if (props.reportData.isOpen) {
        reportOpen.value = true
      } else {
        router.replace('/')
      }
    }
  }
)
watch(
  () => props.value,
  (newValue) => {
    clear()
    runTime(newValue)
    runTime1(newValue)
  }
)
</script>

<style scoped>
.timeout-text {
  color: brown;
  transition: all ease 0.2s;
}
.report1 {
  width: 50%;
}
</style>
