<script setup lang="ts">
import { getCurrentDate, getCurrentDayOfWeek, getCurrentTime } from '@/utils/date'
import { onMounted, onUnmounted, ref } from 'vue';
import {Calendar} from '@element-plus/icons-vue'

const sf = ref('')
const setIntervalData1 = ref<NodeJS.Timeout | null>(null)

// 运行循环获取当前时间
const runGetCurrentTime = () => {
  sf.value = getCurrentTime(2)
  if(setIntervalData1.value)clearInterval(setIntervalData1.value)
  setIntervalData1.value = setInterval(() => {
    sf.value = getCurrentTime(2)
  }, 60000)
}

onMounted(()=>{
    runGetCurrentTime()
})
onUnmounted(()=>{
    if(setIntervalData1.value)clearInterval(setIntervalData1.value)
})
</script>

<template>
    <div class="desBox">
    <el-icon class="w-label-des" style="font-size: 1.3rem; margin-right: 0.2rem"
        ><Calendar
    /></el-icon>
    <div class="w-label-des" style="margin-inline: 0.5rem">
        {{ getCurrentDate('data') }}
    </div>
    <div class="w-label-des" style="margin-right: 0.5rem">{{ getCurrentDayOfWeek() }}</div>
    <div class="w-label-des">{{ sf }}</div>
    </div>    
</template>