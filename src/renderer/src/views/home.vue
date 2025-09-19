<script setup lang="ts">
import { audioPlayer } from '@renderer/utils/horn'
import { markRaw, onMounted, ref } from 'vue'
import { Postcard } from '@element-plus/icons-vue'
import { projectType } from '@renderer/types/project'

const cards = ref<projectType[]>([
  {
    icon: markRaw(Postcard),
    name: '项目1',
    process: [
      {
        name: '流程1',
        path: '/process/process1',
        key: 'process1',
        input: {},
        result: {},
        timeout: 30,
        des: '进行流程1'
      },
      {
        name: '流程1',
        path: '/process/process2',
        key: 'process2',
        input: {},
        result: {},
        timeout: 30,
        des: '进行流程2'
      }
    ]
  },
  {
    icon: markRaw(Postcard),
    name: '项目1',
    process: [
      {
        name: '流程1',
        path: '/process/process1',
        key: 'process1',
        input: {},
        result: {},
        timeout: 30,
        des: '进行流程1'
      },
      {
        name: '流程1',
        path: '/process/process2',
        key: 'process2',
        input: {},
        result: {},
        timeout: 30,
        des: '进行流程2'
      }
    ]
  },
  {
    icon: markRaw(Postcard),
    name: '项目1',
    process: [
      {
        name: '流程1',
        path: '/process/process1',
        key: 'process1',
        input: {},
        result: {},
        timeout: 30,
        des: '进行流程1'
      },
      {
        name: '流程1',
        path: '/process/process2',
        key: 'process2',
        input: {},
        result: {},
        timeout: 30,
        des: '进行流程2'
      }
    ]
  }
])

const clickCard = () => {
  console.log('点击项目')
}

onMounted(() => {
  audioPlayer.play('请选择你需要办理的业务')
})
</script>

<template>
  <div class="content">
    <div class="w-title1">请选择你需要办理的业务</div>
    <div class="box">
      <div v-for="(cItem, cIndex) in cards" :key="cIndex" class="card" @click="clickCard">
        <div class="logbox">
          <el-icon class="icon">
            <component :is="cItem.icon" />
          </el-icon>
        </div>
        <div class="w-label1">{{ cItem.name }}</div>
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
  margin-inline: 2.5rem;
  transition: all ease 1s;
}
.card:active {
  transform: scale(2);
}
.logbox {
  width: 70%;
  aspect-ratio: 1;
  border: 0.2rem solid var(--mian-color);
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
