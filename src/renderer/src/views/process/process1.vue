<script setup lang="ts">
import { useProjectStore } from '@renderer/stores/project'
import { markRaw, onMounted, ref } from 'vue'
import keyboard from '@renderer/components/keyboard.vue'
import report from '@renderer/components/report.vue'
import { reportType } from '@/types/report'
import { Pointer } from '@element-plus/icons-vue'
import { cmdType } from '@/types/index'
import { audioPlayer } from '@/utils/horn'

const emit = defineEmits(['cmd'])

const keyboardText = ref('')
const isReport = ref(false)
const reportData = ref<reportType>({
  isOpen: true,
  title: '字符数量不对',
  content: '输入的字符数量不对，请输入18位身份证号码，否则即将返回首页',
  type: 'danger',
  timeout: 5
})
const cmd: cmdType[] = [
  {
    icon: markRaw(Pointer),
    label: '确定',
    operation: () => {
      keyBoardConfirm()
    }
  }
]

const keyBoardConfirm = () => {
  if (keyboardText.value.length < 18) {
    isReport.value = true
  } else {
    useProjectStore().setVlaueForNowProject('idCardNumber', keyboardText.value)
    useProjectStore().nextStep()
  }
}

onMounted(() => {
  emit('cmd', cmd)
  audioPlayer.play('请输入身份证号码')
})
</script>

<template>
  <div class="content">
    <div class="w-title-box">
      <div class="w-title1">请输入身份证号码</div>
    </div>
    <div class="w-title-bottom">
      <el-input v-model="keyboardText" size="large" class="input"></el-input>
      <keyboard
        v-model:text="keyboardText"
        :limit="18"
        type="number"
        class="keyboard"
        @confirm="keyBoardConfirm"
      />
    </div>
    <report
      v-if="isReport"
      :title="reportData.title"
      :content="reportData.content"
      :timeout-value="reportData.timeout"
      :type="reportData.type"
    />
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: black;
}
.input {
  margin-block: 2rem;
}

:deep() .el-input--large {
  font-size: 1.7rem;
  height: 4rem;
}
</style>
