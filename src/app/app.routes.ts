// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth';
import { adminGuard } from './core/guards/admin';
import { guestGuard } from './core/guards/guest';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/products/product-detail/product-detail').then(
            (m) => m.ProductDetailComponent
          ),
      },
      {
        path: 'quotes',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/quotes/quote-form/quote-form').then(
            (m) => m.QuoteFormComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/profile').then((m) => m.ProfileComponent),
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
          import('./features/auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/register/register').then(
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
          import('./features/dashboard/dashboard').then(
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
          import('./features/admin/user-list/user-list').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: 'quotes',
        loadComponent: () =>
          import('./features/quotes/quote-list/quote-list').then(
            (m) => m.QuoteListComponent
          ),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/admin/supplier-list/supplier-list').then(
            (m) => m.SupplierListComponent
          ),
      },
      {
        path: 'materials',
        loadComponent: () =>
          import('./features/admin/material-list/material-list').then(
            (m) => m.MaterialListComponent
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./features/admin/review-list/review-list').then(
            (m) => m.ReviewListComponent
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/admin/inventory/inventory').then(
            (m) => m.InventoryComponent
          ),
      },
      {
        path: 'purchases',
        loadComponent: () =>
          import('./features/admin/purchase-list/purchase-list').then(
            (m) => m.PurchaseListComponent
          ),
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./features/admin/sales-dashboard/sales-dashboard').then(
            (m) => m.SalesDashboardComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/product-list/product-list').then(
            (m) => m.AdminProductListComponent
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
          import('./features/quotes/my-quotes/my-quotes').then(
            (m) => m.MyQuotesComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
