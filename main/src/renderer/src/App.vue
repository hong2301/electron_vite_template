<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConfigStore } from './stores/config'

const load = ref(true)
const loadConfig = async () => {
  load.value = true

  const configGetResult = await window?.api?.config?.get()
  if (configGetResult?.code === 500) return
  
  useConfigStore().data = configGetResult?.data
  console.log('配置信息:', JSON.stringify(useConfigStore()?.data, null, 2))

  loadFontSize()

  load.value = false
  return
}
const loadFontSize = () => {
  document.documentElement.style.fontSize = `${(useConfigStore()?.data?.foundation?.fontSize >= 5 && useConfigStore()?.data?.foundation?.fontSize) ?? 16}px`
}

onMounted(async () => {
  await loadConfig()
})
</script>

<template>
  <router-view v-if="!load"></router-view>
  <div v-else style="width: 100vw; height: 100vh; background-color: white"></div>
</template>

<style scoped></style>
