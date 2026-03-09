<!-- src/components/logo.vue -->
<script setup lang="ts">
import { reportType } from '@/types/report'
import keyboard from '@renderer/components/keyboard.vue'
import { useConfigStore } from '@renderer/stores/config'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import report from '@renderer/components/report.vue'
import { useRoute } from 'vue-router'
import router from '@renderer/router'
import pkg from '../../../../package.json'

const setIntervalData1 = ref<NodeJS.Timeout | null>(null)
const projectName=ref(pkg?.name)
const projectVersion=ref(pkg?.version)
const reportData=ref<reportType>({
    isOpen:false,
    title: '后台登陆',
    content: '',
    type: 'primary',
    reportCmds:[],
    timeout: 120
})
const backPassword=ref('')
const isPassword=ref('password')
const isBack=ref(false)
const route = useRoute()
const processName=ref<string>('')

// 接触log
const logDown = () => {
  console.log('接触')
  if (setIntervalData1.value) clearInterval(setIntervalData1.value)
  setIntervalData1.value = setTimeout(() => {
    reportData.value.isOpen=true
  }, 500)
}
// 离开log
const logLeave = () => {
  console.log('离开')
   if (setIntervalData1.value) clearInterval(setIntervalData1.value)
}

// 后台键盘确认
const keyBoardConfirm = async () => {
  if (backPassword.value === useConfigStore()?.data?.foundation?.backPassword) {
    reportData.value.isOpen=false
    router.replace('/back')
  } else {
    isPassword.value = ''
    backPassword.value = '密码错误!'
    setTimeout(() => {
      backPassword.value = ''
      isPassword.value = 'password'
    }, 500)
  }
}

// 判断是否在后台
const isBackFn = () => {
  if (route.path.includes('back')) {
    isBack.value = true
  } else {
    isBack.value = false
  }
}

// 获取流程名称
const getProcessName=()=>{
  processName.value=route?.name as string
}

onMounted(()=>{
  getProcessName()
  isBackFn()
})
onUnmounted(()=>{
    if (setIntervalData1.value) clearInterval(setIntervalData1.value)
})

// 监控路由变化
watch(
  () => route.path,
  () => {
     getProcessName()
  }
)
</script>

<template>
    <div class="logBox">
        <img
            class="log"
            src="../assets//log.png"
            mode="heightFix"
            @mousedown="logDown"
            @mouseup="logLeave"
            @touchstart="logDown"
            @touchend="logLeave"
        />
        <div class="title-box">
            <div class="w-title">{{projectName}} {{ isBack ? projectVersion : '' }}</div>
            <div v-if="processName!==''" class="w-title2" >/{{ processName }}</div>
        </div>
        <report
            v-if="reportData?.isOpen"
            :title="reportData?.title"
            :content="reportData?.content"
            :timeout-value="reportData?.timeout"
            :type="reportData?.type"
            :cmds="reportData?.reportCmds"
            >
            <el-input
                v-model="backPassword"
                :type="isPassword"
                size="large"
                class="input"
            ></el-input>
            <div class="keybox">
                <keyboard
                v-model:text="backPassword"
                :limit="18"
                type="number"
                class="keyboard"
                :padding-block="0.5"
                :font-size="2"
                @confirm="keyBoardConfirm"
                />
            </div>
        </report>
    </div>
</template>

<style scoped>
.logBox{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 3%;
}
.log {
  height: 70%;
  aspect-ratio: 1.88;
  margin-right: 1rem;
}
.title-box {
  margin-left: 1rem;
  height: 2.5rem;
  display: flex;
  align-items: end;
  justify-content: center;
}
.input {
  margin-block: 1rem;
}
.keybox {
  width: 100%;
}

:deep() .el-input__inner {
  font-size: 2rem;
  height: 5rem;
  line-height: 5rem;
}
</style>