import { createApp } from 'vue'
import App from './App.vue'
import Autobrm from './components/Autobrm.vue'
import Requests from './components/Requests.vue'
import NewRequest from './components/NewRequest.vue'
import CancelRequest from './components/CancelRequest.vue'
import EditVariable from './components/EditVariable.vue'
import VmuGap from './components/VmuGap.vue'
import HrdGap from './components/HrdGap.vue'
import Config from './components/Config.vue'
import RequestDetail from './components/RequestDetail.vue'
import VmuGapDetail from './components/VmuGapDetail.vue'
import HrdGapDetail from './components/HrdGapDetail.vue'
import store from './store.js'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'view.dashboard',
    component: App,
    children: [
      {path: '/autobrm', name:'view.autobrm', component: Autobrm},
      {
        path: '/requests/',
        name: 'view.requests',
        component: Requests,
      },
      {path: '/new', name:'new.request', component: NewRequest},
      {path: '/requests/', name: 'view.requests', component: Requests},
      {path: '/requests/:id', name: 'view.request.detail', component: RequestDetail},
      {path: '/requests/:id/cancel', name: 'view.request.cancel', component: CancelRequest},
      {
        path: '/archives/vmu',
        name: 'view.vmu.gaps',
        component: VmuGap,
        children: [
          {path: '/archives/vmu/new', name:'vmu.new.request', component: NewRequest}
        ],
      },
      {path: '/archives/vmu/:id', name: 'view.vmu.detail', component: VmuGapDetail},
      {
        path: '/archives/hrd',
        name: 'view.hrd.gaps',
        component: HrdGap,
        children: [
          {path: '/archives/hrd/new', name:'hrd.new.request', component: NewRequest}
        ],
      },
      {path: '/archives/hrd/:id', name: 'view.hrd.detail', component: HrdGapDetail},
      {
        path: '/settings/',
        name: 'view.settings',
        component: Config,
        children: [
          {path: '/settings/:id', name: 'edit.variable', component: EditVariable},
        ],
      },
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
