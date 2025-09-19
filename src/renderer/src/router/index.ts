import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@renderer/views/home.vue'
import Layout from '@renderer/components/layout.vue'
import Process1View from '@renderer/views/process/process1.vue'
import Process2View from '@renderer/views/process/process2.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '',
          name: '首页',
          component: HomeView
        },
        {
          path: '/process/process1',
          name: '流程1',
          component: Process1View
        },
        {
          path: '/process/process2',
          name: '流程2',
          component: Process2View
        }
      ]
    }
  ]
})

export default router
