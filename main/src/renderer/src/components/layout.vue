<script setup lang="ts">
import {
  Back,
  HomeFilled,
  WarnTriangleFilled,
  PhoneFilled,
  Right,
  Refresh,
  Check,
  SwitchButton
} from '@element-plus/icons-vue'
import router from '@renderer/router'
import { useCmdStore } from '@renderer/stores/cmd'
import { onMounted, ref, watch, computed, markRaw, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { delay } from '@/utils/delay'
import { useProjectStore } from '@renderer/stores/project'
import timeout from './timeout.vue'
import { cmdType } from '@/types/index'
import report from '@renderer/components/report.vue'
import { reportType } from '@/types/report'
import date from './date.vue'
import { Close } from '@element-plus/icons-vue'
import { useConfigStore } from '@renderer/stores/config'
import logo from './logo.vue'

const overReData = {
  isOpen: true,
  title: '是否结束受理',
  content: '点击确定退出受理',
  type: 'primary',
  timeout: 30
}
const backLoginReData = {
  isOpen: true,
  title: '后台登陆',
  content: '',
  type: 'primary',
  timeout: 120
}
const CloseBtn = {
  icon: markRaw(Close),
  label: '取消',
  operation: () => {
    isReport.value = false
    backPassword.value = ''
  }
}
const yesBtn = {
  icon: markRaw(Check),
  label: '确定',
  type: 'danger',
  operation: () => {
    isReport.value = false
    backPassword.value = ''
    goHome()
  }
}
const isBack = ref(false)
const backPassword = ref('')
const isReport = ref(false)
const reportData = ref<reportType>(backLoginReData as reportType)
const route = useRoute()
const isHome = ref(true)
const isProcess = ref(false)
const contentHide = ref(false)
const rTimeout = ref(30)
const cmds = ref<cmdType[]>([])
const SwitchButtonBtn = {
  icon: markRaw(SwitchButton),
  label: '结束',

  type: 'danger',
  dir: 'left' as const,
  operation: async () => {
    isReport.value = true
    reportData.value = overReData as reportType
    reportCmds.value = [CloseBtn, yesBtn]
  }
}
const reportCmds = ref([CloseBtn])

const back = async () => {
  router.go(-1)
}

const goHome = async () => {
  useCmdStore().refresh = true
  router.replace('/')
}

const reload = () => {
  window.location.reload()
}

const next = () => {
  useProjectStore().nextStep()
}

// 判断是否在首页
const isHomeFn = () => {
  if (route.path === '/') {
    isHome.value = true
  } else {
    useCmdStore().home = true
    isHome.value = false
  }
}

// 判断是否在在进行流程
const isProcessFn = () => {
  if (route.path.includes('process')) {
    useCmdStore().back = true
    useCmdStore().next = true
    isProcess.value = true
  } else {
    isProcess.value = false
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

// 获取操作时间
const getRTimeout = async () => {
  if (isProcess.value) {
    rTimeout.value = 0
    nextTick(() => {
      rTimeout.value = useProjectStore().getNowStepTimeout()
    })
  }
}

// 获取流程的操作按钮
const getCmd = (cmd: cmdType[]) => {
  cmds.value = cmd
}



onMounted(() => {
  isBackFn()
  isHomeFn()
  isProcessFn()
  getRTimeout()
})
// 在路由配置中添加全局守卫
router.beforeEach(async (_to, _from, next) => {
  try {
    // 隐藏
    contentHide.value = true
    setTimeout(() => {
      contentHide.value = false
    }, 400)
    await delay(200)
    next()
  } catch (error) {
    console.error('导航守卫错误:', error)
    next('/')
  }
})

// 监控路由变化
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log('路由从', oldPath, '跳转到', newPath)
    // 关闭所有cmd
    useCmdStore().close()

    isBackFn()
    isHomeFn()
    isProcessFn()
    getRTimeout()
    cmds.value = []
  }
)

const leftCmds = computed(() => {
  const leftCmds = cmds.value.filter((cmd) => cmd.dir === 'left')
  if (isProcess.value) {
    return [SwitchButtonBtn, ...leftCmds]
  } else {
    return leftCmds
  }
})

const rightCmds = computed(() => cmds.value.filter((cmd) => !cmd.dir || cmd.dir === 'right'))
</script>

<template>
  <div class="overture">
    <div class="content">
      <div class="body">
        <div class="head">
          <logo class="logBox"/>
          <date class="desBox"/>
        </div>
        <div class="page" :style="{ opacity: `${contentHide ? 0 : 1}` }">
          <div v-if="isProcess" class="process">
            <el-steps
              direction="vertical"
              :active="useProjectStore().getStep()"
              finish-status="success"
              class="step-box"
            >
              <el-step
                v-for="(pItem, pIndex) in useProjectStore().nowProject.process"
                :key="pIndex"
                :title="pItem.name"
                :description="pItem.des"
              />
            </el-steps>
            <div v-if="useConfigStore()?.data?.time?.isOpen" class="timeout">
              <timeout
                :value="rTimeout"
                :report-data="{
                  isOpen: true,
                  title: '操作超时',
                  content: '点击重试可重新进该步骤，否则30秒后前往首页',
                  type: 'danger',
                  timeout: 30
                }"
              />
            </div>
          </div>
          <div class="router-view">
            <router-view @cmd="getCmd" />
          </div>
        </div>
      </div>
      <div v-if="!isHome" class="tail" :style="{ opacity: `${contentHide ? 0 : 1}` }">
        <div>
          <el-button
            v-for="(cItem, cIndex) in leftCmds"
            :key="cIndex"
            text
            bg
            size="large"
            :type="cItem.type ?? 'primary'"
            :icon="cItem.icon"
            class="tool-btn1"
            @click="cItem.operation"
          >
            {{ cItem.label }}
          </el-button>
        </div>
        <div class="middle-btn-box">
          <el-button
            v-if="useCmdStore().back && useConfigStore()?.data?.foundation?.isTest"
            text
            size="large"
            :icon="Back"
            color="rgb(255,255,255)"
            class="tool-btn"
            @click="back"
          >
            上一步
          </el-button>
          <el-button
            v-if="(useCmdStore().home && useConfigStore()?.data?.foundation?.isTest) || isBack"
            text
            size="large"
            :icon="Refresh"
            color="rgb(255,255,255)"
            class="tool-btn"
            @click="reload"
          >
            刷新
          </el-button>
          <el-button
            v-if="(useCmdStore().home && useConfigStore()?.data?.foundation?.isTest) || isBack"
            text
            size="large"
            :icon="HomeFilled"
            color="rgb(255,255,255)"
            class="tool-btn"
            @click="goHome"
          >
            首页
          </el-button>
          <el-button
            v-if="useCmdStore().next && useConfigStore()?.data?.foundation?.isTest"
            text
            size="large"
            :icon="Right"
            color="rgb(255,255,255)"
            class="tool-btn"
            @click="next"
          >
            下一步
          </el-button>
        </div>
        <div>
          <el-button
            v-for="(cItem, cIndex) in rightCmds"
            :key="cIndex"
            text
            bg
            size="large"
            :type="cItem.type ?? 'primary'"
            :icon="cItem.icon"
            class="tool-btn1"
            @click="cItem.operation"
          >
            {{ cItem.label }}
          </el-button>
        </div>
      </div>
      <div
        v-else
        class="tail"
        style="display: flex; justify-content: space-between; padding-inline: 2rem"
        :style="{ opacity: `${contentHide ? 0 : 1}` }"
      >
        <div style="display: flex; justify-content: center; align-items: center">
          <el-icon class="w-label" style="font-size: 1.3rem; margin-right: 0.2rem"
            ><WarnTriangleFilled
          /></el-icon>
          <div class="w-label">操作过程如有问题请联系引导员或到前台办理</div>
        </div>
        <div style="display: flex; justify-content: center; align-items: center">
          <el-icon class="w-label" style="font-size: 1.3rem; margin-right: 0.2rem"
            ><PhoneFilled
          /></el-icon>
          <div class="w-label">技术支持: 0755-89700058</div>
        </div>
      </div>
    </div>
    <report
      v-if="isReport"
      :title="reportData.title"
      :content="reportData.content"
      :timeout-value="reportData.timeout"
      :type="reportData.type"
      :cmds="reportCmds"
    >
    </report>
  </div>
</template>

<style scoped>
.overture {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, rgb(37, 56, 148), rgb(43, 27, 167), rgb(37, 56, 148));
  padding: 0.4rem;
}
.content {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
}
.body {
  width: 100%;
  flex: 1;
  background-color: rgb(248, 248, 248);
  border-radius: 1rem 1rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 1rem rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  overflow: hidden;
}
.head {
  width: 100%;
  height: 4rem;
  background-color: rgb(246, 248, 254);
  border-radius: 1rem;
  flex-shrink: 0;
  display: flex;
}
.page {
  transition: all ease 0.2s;
  width: 100%;
  flex: 1;
  border-radius: 0rem 0rem 2.5rem 2.5rem;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  overflow: auto;
}
.process {
  width: 10%;
  height: 100%;
  border-right: 0.1rem solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}
.timeout {
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
}
.step-box {
  width: 100%;
  height: 70%;
}
.router-view {
  padding-left: 1rem;
  box-sizing: border-box;
  flex: 1;
  height: 100%;
}
.tail {
  transition: all ease 0.2s;
  width: 100%;
  height: 5.5rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 1rem;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
}
.middle-btn-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.logBox {
  width: 50%;
  height: 100%;
}
.desBox {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: flex-end;
  padding-right: 2rem;
}
.tool-btn {
  color: rgb(225, 225, 225);
  font-size: 2rem;
  padding-block: 2rem;
}
.tool-btn1 {
  /* color: var(--mian-color); */
  font-size: 2.5rem;
  font-weight: 800;
  padding-block: 2rem;
  transition: all ease 0.2s;
}
.tool-btn1:active {
  scale: 1.1;
}
.tool-btn:hover {
  color: rgb(43, 43, 43);
  /* font-size: 3rem; */
}
.tool-btn:active {
  color: rgb(43, 43, 43);
  scale: 1.1;
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
