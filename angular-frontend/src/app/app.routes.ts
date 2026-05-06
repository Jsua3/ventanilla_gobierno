import { Routes } from '@angular/router';
import { authGuard, funcionarioGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'tramites', loadComponent: () => import('./pages/tramites/tramites.component').then(m => m.TramitesComponent) },
      { path: 'tramites/nuevo', loadComponent: () => import('./pages/nuevo-tramite/nuevo-tramite.component').then(m => m.NuevoTramiteComponent) },
      { path: 'tramites/:id', loadComponent: () => import('./pages/detalle-tramite/detalle-tramite.component').then(m => m.DetalleTramiteComponent) },
      { path: 'funcionario', loadComponent: () => import('./pages/funcionario/funcionario.component').then(m => m.FuncionarioComponent), canActivate: [funcionarioGuard] },
    ]
  },
  { path: '**', redirectTo: '' }
];
