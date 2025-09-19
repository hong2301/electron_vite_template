<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // window.api.test.echo('Hello from renderer').then((response) => {
  //   console.log(response)
  // })
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
