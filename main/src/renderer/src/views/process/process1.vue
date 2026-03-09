<script setup lang="ts">
import {  onMounted, onUnmounted, ref } from 'vue'
import { play } from '@/utils/horn'
import { cmdType } from '@/types'

const emit = defineEmits(['cmd'])
const title=ref('标题')
let cmd: cmdType[] = []

onMounted(async () => {
  emit('cmd', cmd)
  play(title.value)
})
onUnmounted(() => {
})
</script>

<template>
  <div  class="w-content">
    <div class="w-title-box">
      <div class="w-title0">{{ title }}</div>
    </div>
    <div class="w-title-bottom bottom" style="height: 60%">
    </div>
  </div>
</template>

<style scoped>
.keyboard {
  flex: 1;
}
.input {
  margin-block: 2rem;
}
.bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.img-box {
  width: 50%;
  height: 100%;
  background-color: var(--mian-color);
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}
.img {
  height: 100%;
  width: auto;
}
.report-box {
  width: 100%;
  height: 100%;
}
.line {
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.1rem solid var(--mian-color);
  border-bottom: none;
}
.line-left {
  padding-right: 2rem;
  box-sizing: border-box;
  width: 40%;
  height: 100%;
  background-color: var(--mian-color);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: white;
}
.line-right {
  padding-left: 2rem;
  box-sizing: border-box;
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: black;
}

:deep() .el-input--large {
  font-size: 1.7rem;
  height: 4rem;
  line-height: 4rem;
}
</style>
