import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import adminRoutes from './admin-routes.js';
import wizardRoutes from './wizard-routes.js';

const baseRoutes = [
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
    path: '/movies/:nazwaFilmu',
    name: 'movies',
    component: () => import('../views/MovieView.vue')
  },
  {
    path: '/checkout/success',
    name: 'checkout-success',
    component: () => import('../views/ThankYouView.vue')
  },
  {
    path: '/regulations',
    name: 'regulations',
    component: () => import('../views/RegulationsView.vue')
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('../views/PrivacyView.vue')
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('../views/QuestionsView.vue')
  }
];

const routes = baseRoutes.concat(adminRoutes, wizardRoutes);

const router = createRouter({
history: createWebHistory(import.meta.env.BASE_URL),
routes
});


router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('accessToken');

  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    next('/');
  } else {
    next();
  }
});

export default router
