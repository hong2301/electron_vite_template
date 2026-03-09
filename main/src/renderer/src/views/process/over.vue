<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { markRaw, onMounted } from 'vue'
import { play } from '@/utils/horn'
import { CircleCheck, HomeFilled } from '@element-plus/icons-vue'
import { useCmdStore } from '@renderer/stores/cmd'
import router from '@renderer/router'

const emit = defineEmits(['cmd'])

const homeFilledBtn = {
  icon: markRaw(HomeFilled),
  label: '返回首页',
  operation: () => {
    useCmdStore().refresh = true
    router.replace('/')
  }
}

onMounted(async () => {
  emit('cmd', [homeFilledBtn])
  play('业务流程完毕，即将返回首页')
})
</script>

<template>
  <div class="content">
    <div class="w-title0" style="font-size: 5rem">业务流程完毕</div>
    <el-icon class="cg"><CircleCheck /></el-icon>
    <div class="w-title2" style="font-size: 3rem">即将返回首页</div>
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
.cg {
  font-size: 15rem;
  font-weight: 800;
  color: var(--mian-color-sucess);
  margin-block: 2rem;
}
</style>
