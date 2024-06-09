import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth } from './midlwares/auth.midleware'

import Auth from '@/views/Auth.vue'
import GuestAuth from '@/views/GuestAuth.vue'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      protected: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      protected: true
    }
  },
  {
    path: '/kviz',
    name: 'Guest auth',
    component: GuestAuth,
    meta: {
      protected: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(checkAuth)

export default router
