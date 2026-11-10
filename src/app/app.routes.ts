import { Routes } from '@angular/router';
import { CourseM } from './pages/course-m/course-m';
import { PaymentsM } from './pages/payments-m/payments-m';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
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
