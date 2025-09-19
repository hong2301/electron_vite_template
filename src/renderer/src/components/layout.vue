<script setup lang="ts">
import { WarnTriangleFilled } from '@element-plus/icons-vue'
</script>

<template>
  <div class="overture">
    <div class="content">
      <div class="tail"></div>
      <div class="body">
        <div class="head">
          <div class="logBox">
            <img class="log" src="../assets//log.png" />
            <div class="w-title">自助拍照机</div>
          </div>
          <div class="desBox">
            <el-icon class="w-label-des" style="font-size: 1.3rem; margin-right: 0.2rem"
              ><WarnTriangleFilled
            /></el-icon>
            <div class="w-label-des">操作过程如有问题请联系引导员或到前台办理</div>
          </div>
        </div>
        <div class="page">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overture {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, rgb(37, 56, 148), rgb(43, 27, 167), rgb(37, 56, 148));
  padding: 0.4rem;
}
.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 92%;
  background-color: white;
  border-radius: 1rem 1rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.5);
}
.head {
  width: 100%;
  height: 4rem;
  background-color: rgb(246, 248, 254);
  border-radius: 1rem;
  display: flex;
}
.page {
  width: 100%;
  flex: 1;
  border-radius: 0rem 0rem 2.5rem 2.5rem;
}
.tail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
}
.logBox {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 2.5rem;
  box-sizing: border-box;
}
.desBox {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: flex-end;
  padding-right: 2rem;
}
.log {
  height: 2.5rem;
}
</style>
