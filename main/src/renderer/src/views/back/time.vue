<script setup lang="ts">
import { cmdType } from '@/types/index'
import { Back, Pointer } from '@element-plus/icons-vue'
import { markRaw, onMounted, onUnmounted, reactive, ref, computed } from 'vue'
import router from '@renderer/router'
import { useConfigStore } from '@renderer/stores/config'
import { timeConfigType } from '@/types/config'
import { CloseBold } from '@element-plus/icons-vue'
import { reportType } from '@/types/report'
import report from '@renderer/components/report.vue'

const emit = defineEmits(['cmd'])
const isReport = ref(false)
const reportData = ref<reportType>({
  isOpen: true,
  title: '基础设置保存',
  content: '保存成功',
  type: 'primary',
  timeout: 30
})
const CloseBoldButtonBtn = {
  icon: markRaw(CloseBold),
  label: '关闭',
  type: 'primary',
  operation: async () => {
    isReport.value = false
  }
}
const reportCmds = ref<cmdType[]>([CloseBoldButtonBtn])
const data = reactive<timeConfigType>({
  isOpen: 0,
  over: 0,
  process1: 0
})

// 配置项定义 - 只需要在这里添加或修改
const configItems:{label:string,key:string,type:string}[] = [
  { label: '办理完毕', key: 'over', type: 'number' },
  { label: '流程1', key: 'process1', type: 'number' },
  { label: '计时开关', key: 'isOpen', type: 'switch' }
]

// 计算属性：将配置项分成三列
const columns = computed(() => {
  const result:{label:string,key:string,type:string}[][]= [[], [], []]
  configItems.forEach((item, index) => {
    result[index % 3].push(item)
  })
  return result
})

const BackBtn = {
  icon: markRaw(Back),
  label: '返回',
  dir: 'left',
  operation: () => {
    router.go(-1)
  }
}
const PointerBtn = {
  icon: markRaw(Pointer),
  label: '保存',
  operation: async () => {
    Object.assign(useConfigStore().data.time, data)
    const configData = JSON.parse(JSON.stringify(useConfigStore().data))
    const configSetResult = await window?.api?.config?.set(configData)
    isReport.value = true
    console.log(configSetResult)
  }
}

const cmd: cmdType[] = [BackBtn as cmdType, PointerBtn]

const getData = async () => {
  if(!useConfigStore()?.data?.time){
    useConfigStore().data.time={  
      isOpen: 0,
      over: 0,
      process1: 0
    }
  }
  Object.assign(data, useConfigStore().data.time)
}

onMounted(async () => {
  emit('cmd', cmd)
  getData()
})
onUnmounted(() => {})
</script>

<template>
  <div class="content">
    <div ref="bottomRef" class="w-title-bottom bottom">
      <!-- 循环渲染三列 -->
      <div v-for="(column, colIndex) in columns" :key="colIndex" class="item">
        <div v-for="item in column" :key="item.key" class="row">
          <div class="w-title3" style="margin-bottom: 1rem">{{ item.label }}</div>
          
          <!-- 根据类型渲染不同的组件 -->
          <el-input-number
            v-if="item.type === 'number'"
            v-model="data[item.key]"
            :min="1"
            :max="999"
            size="large"
          />
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="data[item.key]"
            size="large"
          />
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
  color: black;
}

.bottom {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  position: relative;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.item {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
}

.row :deep(.el-input-number) {
  width: 100%;
  max-width: 200px;
}

.textarea {
  font-size: 1.5rem;
}
</style>