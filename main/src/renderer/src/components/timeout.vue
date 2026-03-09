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
import { onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import report from './report.vue'
import router from '@renderer/router'
import { delay } from '@/utils/delay'
import { useCmdStore } from '@renderer/stores/cmd'
import { reportType } from '@/types/report'

const props = defineProps({
  size: {
    type: Number,
    default: 1
  },
  value: {
    type: Number,
    default: 7
  },
  reportShow:{
    type:Boolean,
    default:true
  },
  reportData: {
    type: Object as PropType<reportType> ,
    default: () => ({
      title: '标题',
      content: '内容',
      type: 'primary',
      timeout: 30
    })
  }
})
const timeout = ref(props.value)
const timeoutPercentage = ref(100)
const warning = ref(false)
const setIntervalData1 = ref<NodeJS.Timeout | null>(null)
const setIntervalData2 = ref<NodeJS.Timeout | null>(null)
const setTimeoutData1 = ref<NodeJS.Timeout | null>(null)
const timeOver = ref(false)
const reportOpen = ref(false)

// 时间运行
const runTime = (value: number) => {
  timeout.value = value
  setIntervalData1.value = setInterval(() => {
    timeout.value -= 1

    // 触底
    timeout.value=timeout.value<0?0:timeout.value

    if (
      timeout.value <= 5
    ) {
      warning.value = true
      setTimeoutData1.value = setTimeout(async () => {
        warning.value = false
        if (timeout.value <= 0) {
          await delay(200)
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
  setIntervalData2.value = setInterval(() => {
    temp -= 0.1
    timeoutPercentage.value = (temp / value) * 100
  }, 100)
}

const clear = async () => {
  if (setIntervalData1.value) clearInterval(setIntervalData1.value)
  if (setIntervalData2.value) clearInterval(setIntervalData2.value)
  if (setTimeoutData1.value) clearTimeout(setTimeoutData1.value)
}

const run = async () => {
  clear()
  runTime(props.value)
  runTime1(props.value)
}

onMounted(() => {
  run()
})
onUnmounted(() => {
  clear()
})

defineExpose({ run })

watch(
  () => timeOver.value,
  (newValue) => {
    if (newValue) {
      if (props.reportShow) {
        reportOpen.value = true
      } else {
        useCmdStore().refresh = true
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
