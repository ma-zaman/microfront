import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerPlugins } from '@/plugins'
import { dependencies } from './DependencyInjection'

import App from './App.vue'

console.log('Mood !')

const mount = (el) => {
  const app = createApp(App)

  registerPlugins(app)
  app.use(createPinia())
  app.use(dependencies)

  app.mount(el)
}

if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#app')

  if (devRoot) {
    mount(devRoot)
  }
}

export { mount }