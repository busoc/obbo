import { createApp } from 'vue'
import App from './App.vue'
import Requests from './components/Requests.vue'
import VmuGap from './components/VmuGap.vue'
import HrdGap from './components/HrdGap.vue'
import Config from './components/Config.vue'
import store from './store.js'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'view.dashboard',
    component: App,
    children: [
      {path: '/requests/', name: 'view.requests', component: Requests},
      {path: '/requests/:id', name: 'view.request.detail'},
      {path: '/requests/', name: 'view.requests', component: Requests},
      {path: '/requests/:id/cancel', name: 'view.request.cancel'},
      {path: '/archives/vmu', name: 'view.vmu.gaps', component: VmuGap},
      {path: '/archives/vmu/:id', name: 'view.vmu.detail'},
      {path: '/archives/hrd', name: 'view.hrd.gaps', component: HrdGap},
      {path: '/archives/hrd/:id', name: 'view.hrd.detail'},
      {path: '/settings/', name: 'view.settings', component: Config},
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(() => {
  store.dispatch("fetch.status")
})

let app = createApp({})
app.use(store)
app.use(router)
app.mount('#app')
