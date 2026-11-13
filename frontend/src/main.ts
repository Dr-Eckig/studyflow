import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugin/vuetify'
import { getJson } from './service/getJson'

import App from './App.vue'
import { router } from './router'
import 'vue3-toastify/dist/index.css'
import Vue3Toastify from 'vue3-toastify'

interface Config {
  apiRoot: string
  languages: string[]
  nextLanguage: Record<string, string>
  configBackend?: string
}

const dummyConfig: Config = {
  apiRoot: 'http://localhost:4000/api',
  languages: ['en', 'de'],
  nextLanguage: { en: 'de', de: 'en' },
}

const pinia = createPinia(),
  app = createApp(App),
  init = async (): Promise<void> => {
    try {
      const configData = await getJson('/json/config.json')
      const config = configData.data

      if (config.configBackend) {
        const backendData = await getJson(config.configBackend)
        Object.assign(config, backendData.data)
      }

      app
        .provide('config', config)
        .use(pinia)
        .use(router)
        .use(vuetify)
        .use(Vue3Toastify, {
          autoClose: 3000,
          position: 'bottom-right',
        })
        .mount('#app')
    } catch (error) {
      console.error('Error loading config:', error)

      app
        .provide('config', dummyConfig)
        .use(pinia)
        .use(router)
        .use(vuetify)
        .use(Vue3Toastify, {
          autoClose: 3000,
          position: 'bottom-right',
        })
        .mount('#app')
    }
  }
window.addEventListener('load', init)
