import { createApp } from 'vue'
import App from './App.vue'
import Autobrm from './components/Autobrm.vue'
import Requests from './components/Requests.vue'
import NewRequest from './components/NewRequest.vue'
import CancelRequest from './components/CancelRequest.vue'
import EditRequest from './components/EditRequest.vue'
import EditVariable from './components/EditVariable.vue'
import VmuGap from './components/VmuGap.vue'
import HrdGap from './components/HrdGap.vue'
import Config from './components/Config.vue'
import Dashboard from './components/Dashboard.vue'
import store from './store.js'
import { createRouter, createWebHashHistory } from 'vue-router'

function commonRoutes(prefix) {
  return [
    {path: 'new', name:`${prefix}.new.request`, component: NewRequest},
    {path: ':id/cancel', name: `${prefix}.request.cancel`, component: CancelRequest},
    {path: ':id/edit', name: `${prefix}.request.priority`, component: EditRequest},
  ]
}

const routes = [
  {
    path: '/',
    name: 'view.index',
    component: App,
    redirect: {name: 'view.dashboard'},
    children: [
      {path: '/autobrm', name:'view.autobrm', component: Autobrm},
      {path: '/dashboard', name:'view.dashboard', component: Dashboard},
      {path: 'new', name: 'new.request', component: NewRequest},
      {
        path: '/requests/',
        name: 'view.requests',
        component: Requests,
        children: commonRoutes("replay"),
      },
      {
        path: '/archives/vmu/',
        name: 'view.vmu.gaps',
        component: VmuGap,
        children: commonRoutes("vmu"),
      },
      {
        path: '/archives/hrd/',
        name: 'view.hrd.gaps',
        component: HrdGap,
        children: commonRoutes("hrd"),
      },
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
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(() => {
  store.dispatch("fetch.status")
})

let app = createApp({})
app.use(store)
app.use(router)
app.mount('#app')
