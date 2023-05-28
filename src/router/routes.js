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
      path: '/admin-panel/movies',
      name: 'movies-admin',
      component: () => import('../views/admin-views/AdminMoviesView.vue')
    },
    {
      path: '/admin-panel/movies/add-movie',
      name: 'add-movie',
      component: () => import('../views/admin-views/AdminAddMovieView.vue')
    },
    {
      path: '/admin-panel/screenings',
      name: 'screenings-admin',
      component: () => import('../views/admin-views/AdminScreeningsView.vue')
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
      path: '/admin-panel/users/edit-user/:id_user',
      name: 'edit-user',
      component: () => import('../views/admin-views/AdminEditUserView.vue')
    },
    {
      path: '/admin-panel/users/reset-password/:id_user',
      name: 'reset-password',
      component: () => import('../views/admin-views/AdminResetUserPasswordView.vue')
    },
    {
      path: '/movies/:nazwaFilmu',
      name: 'movies',
      component: () => import('../views/MovieView.vue')
    },
    {
      path: '/wizard/tickets',
      name: 'wizard-tickets',
      component: () => import('../views/wizard-views/WizardTickets2View.vue')
    },
    {
      path: '/wizard/seats',
      name: 'wizard-seats',
      component: () => import('../views/wizard-views/WizardSeatsView.vue')
    },
    {
      path: '/wizard/payments',
      name: 'wizard-payments',
      component: () => import('../views/wizard-views/WizardPaymentsView.vue')
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
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('accessToken');

  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    next('/');
  } else {
    next();
  }
});

export default router
