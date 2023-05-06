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
      path: '/cinemas/:nazwaKina/screenings',
      name: 'screenings',
      component: () => import('../views/ScreeningsView.vue')
    },
    {
      path: '/admin-panel',
      name: 'admin-panel',
      component: () => import('../views/admin-views/AdminMainView.vue')
    },
    {
      path: '/admin-panel/cinemas',
      name: 'cinemas-admin',
      component: () => import('../views/admin-views/AdminCinemaView.vue')
    },
    {
      path: '/admin-panel/employees',
      name: 'employees-admin',
      component: () => import('../views/admin-views/AdminEmployeesView.vue')
    },
    {
      path: '/admin-panel/users',
      name: 'users-admin',
      component: () => import('../views/admin-views/AdminUsersView.vue')
    },
    {
      path: '/admin-panel/settings',
      name: 'settings-admin',
      component: () => import('../views/admin-views/AdminSettingsView.vue')
    },
    {
      path: '/admin-panel/posts',
      name: 'posts-admin',
      component: () => import('../views/admin-views/AdminPostsView.vue')
    },
    {
      path: '/admin-panel/logs',
      name: 'logs-admin',
      component: () => import('../views/admin-views/AdminLogsView.vue')
    },
    {
      path: '/movie',
      name: 'movie',
      component: () => import('../views/MovieView.vue')
    },
    {
      path: '/wizard',
      name: 'wizard',
      component: () => import('../views/WizardView.vue')
    }
  ]
})

export default router
