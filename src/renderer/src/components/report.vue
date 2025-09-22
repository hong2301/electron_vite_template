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
        <div class="content">
          <div class="w-label2" style="margin-bottom: 1rem">
            {{ content }}
          </div>

          <slot></slot>
        </div>
        <el-divider />
        <div class="btn-box">
          <timeout :size="0.6" :value="timeoutValue" />
          <div>
            <el-button
              v-for="(cItem, cIndex) in cmd"
              :key="cIndex"
              :type="cItem?.type"
              size="large"
              :icon="cItem.icon"
              @click="cItem.operation"
              >{{ cItem.label }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { markRaw, onMounted, PropType, ref } from 'vue'
import { HomeFilled, Refresh } from '@element-plus/icons-vue'
import router from '@renderer/router'
import timeout from './timeout.vue'
import { cmdType } from '@/types'

const props = defineProps({
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
  },
  cmds: {
    type: Array as PropType<cmdType[]>,
    default: () => []
  }
})
const isStart = ref(false)
const homeFilledBtn = {
  icon: markRaw(HomeFilled),
  label: '返回首页',
  type: 'warning',
  operation: () => {
    router.replace('/')
  }
}
const refreshBtn = {
  icon: markRaw(Refresh),
  type: 'primary',
  label: '重试',
  operation: () => {
    window.location.reload()
  }
}
const cmd = ref<cmdType[]>([homeFilledBtn, refreshBtn])

onMounted(() => {
  isStart.value = false
  setTimeout(() => {
    isStart.value = true
  }, 200)
  if (props.cmds.length !== 0) {
    cmd.value = props.cmds
  }
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
  min-height: 10rem;
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
  display: flex;
  flex-direction: column;
  white-space: pre-line;
}
.btn-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
