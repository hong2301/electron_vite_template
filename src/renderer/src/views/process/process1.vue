<script setup lang="ts">
import { useProjectStore } from '@renderer/stores/project'
import { onMounted } from 'vue'

onMounted(() => {
  console.log(useProjectStore().getNowStepInput())
})
</script>

<template>
  <div class="content">流程1</div>
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
</style>
