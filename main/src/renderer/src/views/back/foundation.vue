<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { cmdType } from '@/types/index'
import { Back, Pointer } from '@element-plus/icons-vue'
import { markRaw, onMounted, onUnmounted, reactive, ref } from 'vue'
import router from '@renderer/router'
import { useConfigStore } from '@renderer/stores/config'
import { foundationConfigType } from '@/types/config'
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
const data = reactive<foundationConfigType>({
  fontSize: 0,
  isTest: '',
  backPassword: '',
  dataPath: ''
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
    Object.assign(useConfigStore().data.foundation, data)
    const configData = JSON.parse(JSON.stringify(useConfigStore().data))
    const configSetResult = await window?.api?.config?.set(configData)
    isReport.value = true
    console.log(configSetResult)
  }
}

const cmd: cmdType[] = [BackBtn as cmdType, PointerBtn]

const getData = async () => {
  if(!useConfigStore()?.data?.foundation){
    useConfigStore().data.foundation={  
      fontSize: 0,
      isTest: '',
      backPassword: '',
      dataPath: ''
    }
  }
  Object.assign(data, useConfigStore()?.data?.foundation)
}

const fontSizeChange = (value: number) => {
  document.documentElement.style.fontSize = `${value}px`
}

onMounted(async () => {
  emit('cmd', cmd)
  getData()
})
onUnmounted(() => {})
</script>

<template>
  <div class="content1">
    <div ref="bottomRef" class="w-title-bottom bottom">
      <div class="item" style="margin-right: 4rem">

        <div class="row">
          <div class="w-title3" style="margin-bottom: 1rem">测试开关(下一步上一步等按钮)</div>
          <el-switch v-model="data.isTest" size="large" />
        </div>
      </div>

      <div class="item">
        <div class="row">
          <div class="w-title3" style="margin-bottom: 1rem">文字大小</div>
          <el-input-number
            v-model="data.fontSize"
            :min="1"
            :max="999"
            size="large"
            @change="fontSizeChange"
          />
        </div>
        <div class="row">
          <div class="w-title3" style="margin-bottom: 1rem">数据存储位置</div>
          <el-input
            v-model="data.dataPath"
            class="textarea"
            placeholder="请填写数据存储位置"
            size="large"
            clearable
          />
        </div>
      </div>
      <div class="item">
        <div class="row">
          <div class="w-title3" style="margin-bottom: 1rem">后台密码</div>
          <el-input
            v-model="data.backPassword"
            class="textarea"
            placeholder="请填写后台密码"
            size="large"
            clearable
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
.content1 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  overflow: auto;
}
.head {
  margin-bottom: 2rem;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  flex-direction: row;
  height: 100%;
  overflow: auto;
}
.item {
  width: 30%;
  height: 100%;
}
.row {
  width: 100%;
  padding-block: 1rem;
}
.textarea {
  font-size: 1.5rem;
}

:deep() .el-input__wrapper {
  font-size: 2rem;
  line-height: 5rem;
  height: 5rem;
}

:deep() .el-select__wrapper {
  font-size: 2rem;
  line-height: 5rem;
  height: 5rem;
}
</style>
