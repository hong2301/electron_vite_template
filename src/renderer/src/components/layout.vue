<script setup lang="ts">
import {
  Back,
  HomeFilled,
  WarnTriangleFilled,
  PhoneFilled,
  Calendar,
  Right
} from '@element-plus/icons-vue'
import router from '@renderer/router'
import { useCmdStore } from '@renderer/stores/cmd'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentDate, getCurrentDayOfWeek, getCurrentTime } from '@/utils/date'
import { delay } from '@/utils/delay'
import { useProjectStore } from '@renderer/stores/project'
import timeout from './timeout.vue'
import { cmdType } from '@/types/index'

const route = useRoute()
const isHome = ref(true)
const isProcess = ref(false)
const sf = ref('')
const contentHide = ref(false)
const urlLog = ref(['流程1'])
let setIntervalData1: NodeJS.Timeout | null = null
const rTimeout = ref(30)
const cmds = ref<cmdType[]>([])

const back = () => {
  router.go(-1)
}

const goHome = () => {
  router.replace('/')
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
    isProcess.value = true
    useCmdStore().next = true
  } else {
    isProcess.value = false
  }
}

// 运行循环获取当前时间
const runGetCurrentTime = () => {
  sf.value = getCurrentTime(2)
  setIntervalData1 = setInterval(() => {
    sf.value = getCurrentTime(2)
  }, 60000)
}

// 获取路由历史
const getUrlLog = () => {
  urlLog.value = []
  if (isProcess.value) {
    urlLog.value = useProjectStore().getUrlLog()
  }
}

// 获取操作时间
const getRTimeout = () => {
  if (isProcess.value) {
    rTimeout.value = useProjectStore().getNowStepTimeout()
  }
}

// 获取流程的操作按钮
const getCmd = (cmd: cmdType[]) => {
  cmds.value = cmd
}

onMounted(() => {
  isHomeFn()
  isProcessFn()
  getUrlLog()
  runGetCurrentTime()
  getRTimeout()
})
onUnmounted(() => {
  if (setIntervalData1) clearInterval(setIntervalData1)
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

    isHomeFn()
    isProcessFn()
    getUrlLog()
    getRTimeout()
    cmds.value = []
  }
)
</script>

<template>
  <div class="overture">
    <div class="content">
      <div class="body">
        <div class="head">
          <div class="logBox">
            <img class="log" src="../assets//log.png" mode="heightFix" />
            <div class="title-box">
              <div class="w-title">自助拍照机</div>
              <div v-for="(uItem, uIndex) in urlLog" :key="uIndex" class="w-title2">
                /{{ uItem }}
              </div>
            </div>
          </div>
          <div class="desBox">
            <el-icon class="w-label-des" style="font-size: 1.3rem; margin-right: 0.2rem"
              ><Calendar
            /></el-icon>
            <div class="w-label-des" style="margin-inline: 0.5rem">{{ getCurrentDate() }}</div>
            <div class="w-label-des" style="margin-right: 0.5rem">{{ getCurrentDayOfWeek() }}</div>
            <div class="w-label-des">{{ sf }}</div>
          </div>
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
            <div class="timeout">
              <timeout
                :value="rTimeout"
                :report-data="{
                  isOpen: true,
                  title: '操作超时',
                  content: '点击重试可重新进该步骤，否则5秒后前往首页',
                  type: 'danger',
                  timeout: 5
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
        <el-button
          v-if="useCmdStore().back"
          text
          size="large"
          :icon="Back"
          color="rgb(255,255,255)"
          class="tool-btn"
          @click="back"
        >
          返回
        </el-button>
        <div>
          <el-button
            v-if="useCmdStore().home"
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
            v-if="useCmdStore().next"
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
            v-for="(cItem, cIndex) in cmds"
            :key="cIndex"
            text
            bg
            size="large"
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
          <div class="w-label">技术支持: 0755-89700590</div>
        </div>
      </div>
    </div>
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
}
.head {
  width: 100%;
  height: 4rem;
  background-color: rgb(246, 248, 254);
  border-radius: 1rem;
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
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 1rem;
  box-sizing: border-box;
}
.logBox {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 2.5rem;
  box-sizing: border-box;
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
.log {
  height: 2.5rem;
  aspect-ratio: 1.88;
}
.title-box {
  margin-left: 1rem;
  height: 2.5rem;
  display: flex;
  align-items: end;
  justify-content: center;
}
.tool-btn {
  color: rgb(225, 225, 225);
  font-size: 1.4rem;
}
.tool-btn1 {
  color: var(--mian-color);
  font-size: 1.4rem;
  font-weight: 800;
  transition: all ease 0.2s;
}
.tool-btn1:active {
  scale: 1.1;
}
.tool-btn:hover {
  color: rgb(43, 43, 43);
  font-size: 1.4rem;
}
.tool-btn:active {
  color: rgb(43, 43, 43);
  font-size: 1.4rem;
}
</style>
