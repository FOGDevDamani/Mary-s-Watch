import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap'
import VueTippy from "vue-tippy";
import 'tippy.js/dist/tippy.css'






const pinia = createPinia()
pinia
  .use(({ store }) => {
    store.router = markRaw(router);
  })
  .use(piniaPluginPersistedstate);

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueTippy)





app.mount('#app')
