import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/sign-up',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/cinemas/nazwa-kina',
      name: 'screenings',
      component: () => import('../views/ScreeningsView.vue')
    },
    {
      path: '/admin-panel',
      name: 'admin-panel',
      component: () => import('../views/AdminPanelView.vue')
    },
    {
      path: '/movie',
      name: 'movie',
      component: () => import('../views/MovieView.vue')
    }
  ]
})

export default router
