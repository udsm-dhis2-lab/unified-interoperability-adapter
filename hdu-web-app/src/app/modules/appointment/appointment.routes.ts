export const appointmentRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/appointment-list/appointment-list').then((m) => m.AppointmentList),
  },
  {
    path: ':appointmentId',
    loadComponent: () =>
      import('./pages/appointment-profile/appointment-detail-page.component').then(
        (m) => m.AppointmentProfile,
      ),
  },
];
