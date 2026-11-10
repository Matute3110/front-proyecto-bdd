import { Routes } from '@angular/router';
import { CourseM } from './pages/course-m/course-m';
import { PaymentsM } from './pages/payments-m/payments-m';

export const routes: Routes = [
      {
        path: 'courseM',
        loadComponent: () => import('./pages/course-m/course-m').then((m) => m.CourseM),
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/payments-m/payments-m').then((m) => m.PaymentsM),
      },
      {
        path: 'enrollment',
        loadComponent: () => import('./pages/enrollment/enrollment').then((m) => m.EnrollmentComponent),
      }
];
