export default [
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
];