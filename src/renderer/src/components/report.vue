<template>
  <div class="report">
    <div class="w-mask" :style="{ opacity: `${isStart ? 1 : 0}` }"></div>
    <div
      class="card"
      :class="[type]"
      :style="{ transform: `translate(-50%,${isStart ? -50 : 200}%)` }"
    >
      <div class="w-title1 title-box">{{ title }}</div>
      <div class="content-box">
        <div class="content w-label2">{{ content }}</div>
        <el-divider />
        <div class="btn-box">
          <timeout :size="0.6" :value="timeoutValue" />
          <div>
            <el-button type="warning" size="large" :icon="HomeFilled" @click="goHome"
              >返回首页</el-button
            >
            <el-button type="primary" size="large" :icon="Refresh" @click="refresh">重试</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'
import { HomeFilled, Refresh } from '@element-plus/icons-vue'
import router from '@renderer/router'
import timeout from './timeout.vue'

defineProps({
  title: {
    type: String,
    default: '标题'
  },
  content: {
    type: String,
    default: '内容'
  },
  type: {
    type: String as PropType<'primary' | 'danger'>,
    default: 'primary'
  },
  timeoutValue: {
    type: Number,
    default: 3
  }
})
const isStart = ref(false)

const goHome = () => {
  router.replace('/')
}
const refresh = () => {
  window.location.reload()
}

onMounted(() => {
  isStart.value = false
  setTimeout(() => {
    isStart.value = true
  }, 200)
})
</script>

<style scoped>
.report {
}
.primary {
  background-color: var(--mian-color);
}
.danger {
  background-color: var(--mian-color-danger);
}
.card {
  position: fixed;
  width: 50%;
  height: 60%;
  z-index: 1;
  border-radius: 2rem;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  transition: all ease-out 0.5s;
}
.title-box {
  width: 100%;
  height: 3.5rem;
  justify-content: center;
  display: flex;
  color: white;
  align-items: center;
}
.content-box {
  width: 100%;
  flex: 1;
  background-color: white;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  align-items: end;
}
.content {
  width: 100%;
  flex: 1;
}
.btn-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
