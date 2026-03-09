import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@renderer/views/home.vue'
import Layout from '@renderer/components/layout.vue'
// 后台
import BackHomeView from '@renderer/views/back_home.vue'
import BackFoundationView from '@renderer/views/back/foundation.vue'
import BackTimeView from '@renderer/views/back/time.vue'
// 流程
import OverView from '@renderer/views/process/over.vue'
import Process1View from '@renderer/views/process/process1.vue'
// 测试
import ApiTestView from '@renderer/views/api_test.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: '业务',
      component: Layout,
      children: [
        {
          path: '',
          name: '首页',
          component: HomeView
        },
        {
          path: '/process/over',
          name: '办理完毕',
          component: OverView
        },
        {
          path: '/process/process1',
          name: '流程1',
          component: Process1View
        },
        {
          path: '/api_test',
          name: '接口测试',
          component: ApiTestView
        }
      ]
    },
    {
      path: '/back',
      name: '后台',
      component: Layout,
      children: [
        {
          path: '/back',
          name: '后台设置',
          component: BackHomeView
        },
        {
          path: '/back/foundation',
          name: '基础设置',
          component: BackFoundationView
        },
        {
          path: '/back/time',
          name: '时间设置',
          component: BackTimeView
        }
      ]
    }
  ]
})

export default router
