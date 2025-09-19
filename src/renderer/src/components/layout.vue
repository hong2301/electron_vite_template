<script setup lang="ts">
import {
  Back,
  HomeFilled,
  WarnTriangleFilled,
  PhoneFilled,
  Calendar
} from '@element-plus/icons-vue'
import router from '@renderer/router'
import { useCmdStore } from '@renderer/stores/cmd'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentDate, getCurrentDayOfWeek, getCurrentTime } from '@renderer/utils/date'

const route = useRoute()
const isHome = ref(true)
const isProcess = ref(false)
const sf = ref('')

const back = () => {
  router.go(-1)
}

const goHome = () => {
  router.replace('/')
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
  } else {
    isProcess.value = false
  }
}

// 运行循环获取当前时间
const runGetCurrentTime = () => {
  sf.value = getCurrentTime(2)
  setInterval(() => {
    sf.value = getCurrentTime(2)
    console.log(sf.value)
  }, 60000)
}

onMounted(() => {
  isHomeFn()
  isProcessFn()
  runGetCurrentTime()
})

// 在路由配置中添加全局守卫
router.beforeEach(async (to, from, next) => {
  try {
    // 可以在这里添加跳转前的逻辑
    // 比如检查权限、加载数据等

    // 如果需要等待某个操作完成
    // await someAsyncOperation()
    console.log(1)
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
            <div class="w-title">自助拍照机</div>
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
        <div class="page">
          <router-view />
        </div>
      </div>
      <div v-if="!isHome" class="tail">
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
      </div>
      <div
        v-else
        class="tail"
        style="display: flex; justify-content: space-between; padding-inline: 2rem"
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
}
.body {
  width: 100%;
  height: 92%;
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
  width: 100%;
  flex: 1;
  border-radius: 0rem 0rem 2.5rem 2.5rem;
  padding: 1rem;
  box-sizing: border-box;
}
.tail {
  width: 100%;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
.tool-btn {
  color: rgb(225, 225, 225);
  font-size: 1.4rem;
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
