export default [
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
      // Screenings
      {
        path: '/admin-panel/screenings',
        name: 'screenings-admin',
        component: () => import('../views/admin-views/AdminScreeningsViewPro.vue')
      },
      {
        path: '/admin-panel/screenings/',
        name: 'screenings-admin',
        component: () => import('../views/admin-views/AdminScreeningsViewPro.vue')
      },
      // Users
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
      }
];