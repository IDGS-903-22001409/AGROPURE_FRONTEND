import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './features/products/product-list/product-list.component'
          ).then((m) => m.ProductListComponent),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import(
            './features/products/product-detail/product-detail.component'
          ).then((m) => m.ProductDetailComponent),
      },
      {
        path: 'quotes',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/quotes/quote-form/quote-form.component').then(
            (m) => m.QuoteFormComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
  },
  {
    path: 'register',
    redirectTo: 'auth/register',
  },
  {
    path: 'dashboard',
    canActivate: [adminGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/admin/supplier-list/supplier-list.component').then(
            (m) => m.SupplierListComponent
          ),
      },
      {
        path: 'materials',
        loadComponent: () =>
          import('./features/admin/material-list/material-list.component').then(
            (m) => m.MaterialListComponent
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./features/admin/review-list/review-list.component').then(
            (m) => m.ReviewListComponent
          ),
      },
    ],
  },
  {
    path: 'customer',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'quotes',
        loadComponent: () =>
          import('./features/quotes/my-quotes/my-quotes.component').then(
            (m) => m.MyQuotesComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
