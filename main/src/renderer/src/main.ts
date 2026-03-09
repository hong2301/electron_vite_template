// 修复 'passive' event 警告
;(function () {
  if (typeof window === 'undefined') return

  const originalAddEventListener = EventTarget.prototype.addEventListener

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EventTarget.prototype.addEventListener = function (type: string, listener: any, options?: any) {
    const passiveOptions = {
      // 将这些可能阻止滚动的事件都标记为 passive
      passive: ['touchstart', 'touchmove', 'wheel', 'mousewheel'].includes(type)
        ? true
        : typeof options === 'object'
          ? options.passive
          : undefined,
      ...(typeof options === 'object' ? options : {})
    }

    // 调用原始的方法，但使用我们修改后的 options
    return originalAddEventListener.call(this, type, listener, passiveOptions)
  }
})()

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'
import './assets/main.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
