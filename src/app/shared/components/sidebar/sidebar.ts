import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <nav class="sidebar">
      <mat-nav-list>
        <h3 matSubheader>Panel de Administración</h3>

        <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
          <mat-icon matListIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>

        <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
          <mat-icon matListIcon>people</mat-icon>
          <span matListItemTitle>Usuarios</span>
        </a>

        <a mat-list-item routerLink="/products" routerLinkActive="active">
          <mat-icon matListIcon>inventory</mat-icon>
          <span matListItemTitle>Productos</span>
        </a>

        <a
          mat-list-item
          routerLink="/admin/materials"
          routerLinkActive="active"
        >
          <mat-icon matListIcon>build</mat-icon>
          <span matListItemTitle>Materiales</span>
        </a>

        <a
          mat-list-item
          routerLink="/admin/suppliers"
          routerLinkActive="active"
        >
          <mat-icon matListIcon>local_shipping</mat-icon>
          <span matListItemTitle>Proveedores</span>
        </a>

        <a mat-list-item routerLink="/admin/reviews" routerLinkActive="active">
          <mat-icon matListIcon>reviews</mat-icon>
          <span matListItemTitle>Reseñas</span>
        </a>

        <mat-divider></mat-divider>

        <a
          mat-list-item
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <mat-icon matListIcon>home</mat-icon>
          <span matListItemTitle>Volver al Sitio</span>
        </a>
      </mat-nav-list>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        width: 250px;
        background: white;
        border-right: 1px solid #e0e0e0;
        height: 100%;
      }
      .active {
        background-color: #e8f5e8 !important;
        color: #2e7d32 !important;
      }
    `,
  ],
})
export class SidebarComponent {}
