import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="toolbar-content">
        <div class="brand">
          <a routerLink="/" class="brand-link">
            <mat-icon>water_drop</mat-icon>
            <span>AGROPURE</span>
          </a>
        </div>

        <nav class="nav-links">
          <a
            mat-button
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Inicio</a
          >
          <a mat-button routerLink="/products" routerLinkActive="active"
            >Productos</a
          >
          <a
            mat-button
            routerLink="/quotes"
            routerLinkActive="active"
            *ngIf="currentUser$ | async"
            >Cotizar</a
          >
          <a
            mat-button
            routerLink="/dashboard"
            routerLinkActive="active"
            *ngIf="(currentUser$ | async)?.role === 'Admin'"
            >Dashboard</a
          >
        </nav>

        <div class="user-menu">
          <ng-container *ngIf="currentUser$ | async as user; else guestMenu">
            <button
              mat-button
              [matMenuTriggerFor]="userMenu"
              class="user-button"
            >
              <mat-icon>account_circle</mat-icon>
              <span>{{ user.firstName }}</span>
            </button>
            <mat-menu #userMenu="matMenu">
              <a mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Mi Perfil</span>
              </a>
              <a
                mat-menu-item
                routerLink="/customer/quotes"
                *ngIf="user.role === 'Customer'"
              >
                <mat-icon>assignment</mat-icon>
                <span>Mis Cotizaciones</span>
              </a>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          </ng-container>

          <ng-template #guestMenu>
            <a mat-button routerLink="/login">Iniciar Sesión</a>
            <a mat-raised-button color="accent" routerLink="/register"
              >Registrarse</a
            >
          </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      .header-toolbar {
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .toolbar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }
      .brand-link {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .nav-links {
        display: flex;
        gap: 16px;
      }
      .nav-links a.active {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .user-menu {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .user-button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
