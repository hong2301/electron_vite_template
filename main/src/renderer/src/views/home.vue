<script setup lang="ts">
import { markRaw, onMounted, ref } from 'vue'
import { View, Camera } from '@element-plus/icons-vue'
import { projectType } from '@/types/project'
import { useProjectStore } from '@renderer/stores/project'
import { useCmdStore } from '@renderer/stores/cmd'
import { useConfigStore } from '@renderer/stores/config'
import { play } from '@/utils/horn'

const processPostcard = {
  icon: markRaw(Camera),
  name: '项目',
  process: [
    {
      name: '流程1',
      path: '/process/process1',
      key: 'process1',
      timeout: Number(useConfigStore()?.data?.time?.process1??30),
      des: '流程1'
    },
    {
      name: '办理完毕',
      path: '/process/over',
      key: 'over',
      timeout: Number(useConfigStore()?.data?.time?.over??30),
      des: '流程已全部完成'
    }
  ]
}
const apiTestCard={
    icon: markRaw(View),
    name: '接口测试',
    process: [
      {
        name: '接口测试',
        path: '/api_test',
        key: 'apiTest',
        input: {},
        result: {},
        timeout: -1,
        des: '接口测试'
      }
    ]
  }
const cards = ref<projectType[]>([processPostcard])

const clickCard = (item: projectType) => {
  useProjectStore().mountProject(item)
  useProjectStore().nextStep()
}

const getPage = () => {
  if (useConfigStore()?.data?.foundation?.isTest) {
    cards.value.push(apiTestCard)
  }
}

onMounted(async () => {
  // 是否刷新
  if (useCmdStore().refresh) {
    useCmdStore().refresh = false
    window.location.reload()
  }
  getPage()
  play('请选择你需要办理的业务')
})
</script>

<template>
  <div class="content">
    <div class="w-title0">请选择你需要办理的业务</div>
    <div class="box">
      <div v-for="(cItem, cIndex) in cards" :key="cIndex" class="card" @click="clickCard(cItem)">
        <div class="logbox">
          <el-icon class="icon">
            <component :is="cItem?.icon" />
          </el-icon>
          <el-icon v-if="cItem?.icon1" class="icon1">
            <component :is="cItem?.icon1" />
          </el-icon>
        </div>
        <div class="w-label1" style="font-size: 3rem">{{ cItem?.name }}</div>
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

.report-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 100%;
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
  height: 80%;
  width: 25%;
  box-shadow: 0rem 0rem 1.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-inline: 2rem;
  transition: all ease 1s;
}

.card:active {
  transform: scale(1.2);
}

.logbox {
  width: 70%;
  aspect-ratio: 1;
  border: 0.2rem solid var(--mian-color);
  background-color: var(--bg-color);
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
}

.icon {
  filter: drop-shadow(0 0 0.3rem rgba(255, 255, 255, 0.6));
  font-size: 10rem;
}

.icon1 {
  position: absolute;
  font-size: 4rem;
  background-color: white;
  border-radius: 50%;
  background-color: var(--bg-color);
  padding: 0.5rem;
  box-sizing: border-box;
  transform: translate(75%, 75%);
  border: 0.2rem solid white;
}
:deep() .el-input__wrapper {
  font-size: 1.5rem;
  line-height: 3rem;
  height: 3rem;
}
:deep() .el-form-item__label {
  font-size: 1.5rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep() .el-checkbox__label {
  font-size: 1.5rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep() .el-checkbox__inner {
  height: 2rem;
  width: 2rem;
}
</style>
