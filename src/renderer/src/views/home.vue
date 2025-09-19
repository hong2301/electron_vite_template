<script setup lang="ts">
import { audioPlayer } from '@renderer/utils/horn'
import { onMounted } from 'vue'
import { Postcard } from '@element-plus/icons-vue'

onMounted(() => {
  audioPlayer.play('请选择你需要办理的业务')
})
</script>

<template>
  <div class="content">
    <div class="w-title1">请选择你需要办理的业务</div>
    <div class="box">
      <div class="card">
        <div class="logbox">
          <el-icon class="icon">
            <component :is="Postcard" />
          </el-icon>
        </div>
        <div class="w-label1">身份证拍照</div>
      </div>
    </div>
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
}
.box {
  margin-top: 2rem;
  height: 70%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  background-color: white;
  border-radius: 1rem;
  height: 100%;
  width: 20rem;
  box-shadow: 0px 0px 1.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logbox {
  width: 70%;
  aspect-ratio: 1;
  border: 0.5rem solid var(--mian-color);
  background-color: var(--bg-color);
  box-sizing: border-box;
  border-radius: 50%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.icon {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.6));
  font-size: 10rem;
}
</style>
