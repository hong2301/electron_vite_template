<script setup lang="ts">
import { play } from '@/utils/horn'
import { markRaw, onMounted, ref } from 'vue'
import { projectType } from '@/types/project'
import { useProjectStore } from '@renderer/stores/project'
import {
  SwitchButton,
  Refresh,
  Close,
  Setting,
  Clock,
  Back,
} from '@element-plus/icons-vue'
import { cmdType } from '@/types'
import { delay } from '@/utils/delay'
import { useCmdStore } from '@renderer/stores/cmd'
import router from '@renderer/router'
import report from '@renderer/components/report.vue'
import { reportType } from '@/types/report'

const emit = defineEmits(['cmd'])
const isReport = ref(false)
const reportData = ref<reportType>({
  isOpen: true,
  title: '字符数量不对',
  content: '输入的字符数量不对，请输入18位身份证号码，否则即将返回首页',
  type: 'danger',
  timeout: 30
})
const reportCmds = ref<cmdType[]>([])
const CloseBoldButtonBtn = {
  icon: markRaw(Back),
  label: '取消',
  type: 'primary',
  operation: async () => {
    isReport.value = false
  }
}
const SwitchButtonBtn = {
  icon: markRaw(SwitchButton),
  label: '关机',
  type: 'danger',
  dir: 'right' as const,
  operation: async () => {
    isReport.value = true
    reportData.value.title = '二次确认'
    reportData.value.content = '确认要关机?'
    reportCmds.value = [SwitchButtonTrueBtn, CloseBoldButtonBtn]
  }
}

const RefreshButtonBtn = {
  icon: markRaw(Refresh),
  label: '重启',
  type: 'danger',
  dir: 'right' as const,
  operation: async () => {
    isReport.value = true
    reportData.value.title = '二次确认'
    reportData.value.content = '确认要重启电脑?'
    reportCmds.value = [RefreshButtonTrueBtn, CloseBoldButtonBtn]
  }
}
const RefreshButtonTrueBtn = {
  icon: markRaw(Refresh),
  label: '重启',
  type: 'danger',
  dir: 'right' as const,
  operation: async () => {
    window?.api?.cmd?.restart()
  }
}
const CloseButtonTrueBtn = {
  icon: markRaw(Close),
  label: '关闭',
  type: 'danger',
  dir: 'right' as const,
  operation: async () => {
    await delay(2000)
    window?.api?.cmd?.close()
  }
}
const SwitchButtonTrueBtn = {
  icon: markRaw(SwitchButton),
  label: '关机',
  type: 'danger',
  dir: 'right' as const,
  operation: async () => {
    window?.api?.cmd?.shutDown()
  }
}
const CloseButtonBtn = {
  icon: markRaw(Close),
  label: '关闭',
  type: 'danger',
  dir: 'right' as const,
  operation: async () => {
    isReport.value = true
    reportData.value.title = '二次确认'
    reportData.value.content = '确认要关闭软件?'
    reportCmds.value = [CloseButtonTrueBtn, CloseBoldButtonBtn]
  }
}

const BackBtn = {
  icon: markRaw(Back),
  label: '返回',
  dir: 'left',
  type: 'warning',
  operation: () => {
    useCmdStore().refresh = true
    router.replace('/')
  }
}
const cmd: cmdType[] = [BackBtn as cmdType, CloseButtonBtn, RefreshButtonBtn, SwitchButtonBtn]
const cards = ref<projectType[]>([
  {
    icon: markRaw(Setting),
    name: '基础设置',
    process: [
      {
        name: '基础设置',
        path: '/back/foundation',
        key: 'foundation',
        timeout: -1,
        des: '将身份证放置到扫描区'
      }
    ]
  },
  {
    icon: markRaw(Clock),
    name: '时间设置',
    process: [
      {
        name: '时间设置',
        path: '/back/time',
        key: 'time',
        timeout: -1,
        des: '将身份证放置到扫描区'
      }
    ]
  }
])

const clickCard = (item: projectType) => {
  useProjectStore().mountProject(item)
  useProjectStore().nextStep()
}

onMounted(async () => {
  emit('cmd', cmd)
  await play('请选择需要修改的设置')
})
</script>

<template>
  <div class="content">
    <div class="w-title0">后台设置</div>
    <div class="box">
      <div v-for="(cItem, cIndex) in cards" :key="cIndex" class="card" @click="clickCard(cItem)">
        <div class="logbox">
          <el-icon class="icon">
            <component :is="cItem?.icon" />
          </el-icon>
          <el-icon v-if="cItem?.icon1" class="icon1">
            <component :is="cItem?.icon1" />
          </el-icon>
        </div>
        <div class="w-label1">{{ cItem.name }}</div>
      </div>
    </div>
    <report
      v-if="isReport"
      :title="reportData.title"
      :content="reportData.content"
      :timeout-value="reportData.timeout"
      :type="reportData.type"
      :cmds="reportCmds"
    />
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.box {
  margin-top: 2rem;
  height: 70%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background-color: white;
  border-radius: 1rem;
  height: 80%;
  width: 25%;
  box-shadow: 0px 0px 1.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-inline: 2rem;
  transition: all ease 1s;
}

.card:active {
  transform: scale(2);
}

.logbox {
  width: 70%;
  aspect-ratio: 1;
  border: 0.2rem solid var(--mian-color);
  background-color: var(--bg-color);
  box-sizing: border-box;
  border-radius: 50%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
}

.icon {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.6));
  font-size: 6rem;
}

.icon1 {
  position: absolute;
  /* filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.6)); */
  font-size: 3rem;
  background-color: white;
  border-radius: 50%;
  background-color: var(--bg-color);
  padding: 0.5rem;
  box-sizing: border-box;
  right: 17%;
  bottom: 18%;
  border: 0.2rem solid white;
}
</style>
