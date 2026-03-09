<template>
  <div class="report">
    <div
      v-if="!useConfigStore()?.data?.foundation?.isTest"
      class="w-mask"
      :style="{ opacity: `${isStart ? 1 : 0}` }"
    ></div>
    <div
      class="card"
      :class="[type]"
      :style="{
        width: `${width}%`,
        height: `${height !== 0 ? height + '%' : ''}`,
        transform: `translate(-50%,${isStart ? ty : 200}%)`
      }"
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
        <div
          class="btn-box"
          :style="{
            justifyContent: `${useConfigStore().data.time.isOpen ? 'space-between' : 'flex-end'}`
          }"
        >
          <timeout v-if="useConfigStore().data.time.isOpen" :size="0.6" :value="timeoutValue" :report-show="false" />
          <div>
            <el-button
              v-if="isHomeFilled"
              :type="homeFilledBtn?.type"
              size="large"
              :icon="homeFilledBtn.icon"
              class="btn"
              @click="homeFilledBtn.operation"
              >{{ homeFilledBtn.label }}</el-button
            >
            <el-button
              v-if="isRefresh"
              :type="refreshBtn?.type"
              size="large"
              :icon="refreshBtn.icon"
              class="btn"
              @click="refreshBtn.operation"
              >{{ refreshBtn.label }}</el-button
            >
            <el-button
              v-for="(cItem, cIndex) in cmd"
              :key="cIndex"
              :type="cItem?.type"
              size="large"
              :icon="cItem.icon"
              class="btn"
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
import { markRaw, onMounted, PropType, ref, watch } from 'vue'
import { Refresh, SwitchButton } from '@element-plus/icons-vue'
import timeout from './timeout.vue'
import { cmdType } from '@/types'
import { useConfigStore } from '@renderer/stores/config'
import router from '@renderer/router'
import { useCmdStore } from '@renderer/stores/cmd'

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
  width: {
    type: Number,
    default: 50
  },
  height: {
    type: Number,
    default: 0
  },
  ty: {
    type: Number,
    default: -50
  },
  cmds: {
    type: Array as PropType<cmdType[]>,
    default: () => []
  },
  isRefresh: {
    tyep: Boolean,
    default: false
  },
  isHomeFilled: {
    tyep: Boolean,
    default: false
  }
})
const isStart = ref(false)
const homeFilledBtn = {
  icon: markRaw(SwitchButton),
  label: '结束(开门)',
  type: 'danger',
  operation: () => {
    goHome()
  }
}
const refreshBtn = {
  icon: markRaw(Refresh),
  type: 'warning',
  label: '重试',
  operation: () => {
    window.location.reload()
  }
}
const cmd = ref<cmdType[]>([])

const goHome = async () => {
  useCmdStore().refresh = true
  router.replace('/')
}

onMounted(() => {
  isStart.value = false
  setTimeout(() => {
    isStart.value = true
  }, 200)
  if (props.cmds.length !== 0) {
    cmd.value = props.cmds
  }
})

watch(
  () => props.cmds,
  (value) => {
    if (value.length !== 0) {
      cmd.value = value
    }
  }
)
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
  min-height: 20rem;
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
  overflow: auto;
  max-height: 75vh;
}
.btn-box {
  width: 100%;
  display: flex;
  align-items: center;
}
.btn {
  font-size: 2rem;
  height: 4rem;
}
</style>
