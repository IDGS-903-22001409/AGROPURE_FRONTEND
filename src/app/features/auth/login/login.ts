import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="login-icon">water_drop</mat-icon>
            <mat-card-title>AGROPURE</mat-card-title>
            <mat-card-subtitle>Sistema de Monitoreo de Agua</mat-card-subtitle>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Ingresa un email válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                required
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword"
                type="button"
              >
                <mat-icon>{{
                  hidePassword ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
              <mat-error
                *ngIf="loginForm.get('password')?.hasError('required')"
              >
                La contraseña es requerida
              </mat-error>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width login-button"
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>

          <div class="demo-credentials">
            <h4>Credenciales de Demo:</h4>
            <div class="credential-item">
              <strong>Admin:</strong> admin@agropure.com / admin123
              <button
                mat-stroked-button
                (click)="fillCredentials('admin')"
                class="demo-btn"
              >
                Usar
              </button>
            </div>
            <div class="credential-item">
              <strong>Cliente:</strong> juan@example.com / customer123
              <button
                mat-stroked-button
                (click)="fillCredentials('customer')"
                class="demo-btn"
              >
                Usar
              </button>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <p class="register-link">
            ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 20px;
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      }
      .login-card {
        width: 100%;
        max-width: 400px;
        padding: 20px;
      }
      .header-content {
        text-align: center;
        width: 100%;
      }
      .login-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #4caf50;
        margin-bottom: 16px;
      }
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }
      .login-button {
        height: 48px;
        font-size: 16px;
        margin: 24px 0;
      }
      .demo-credentials {
        margin-top: 24px;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 8px;
      }
      .demo-credentials h4 {
        margin: 0 0 12px 0;
        color: #666;
        font-size: 14px;
      }
      .credential-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 12px;
      }
      .demo-btn {
        padding: 4px 12px;
        min-width: auto;
        height: 28px;
        line-height: 20px;
        font-size: 11px;
      }
      .register-link {
        text-align: center;
        margin: 0;
      }
      .register-link a {
        color: #4caf50;
        text-decoration: none;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.notificationService.success('¡Bienvenido a AGROPURE!');
          const redirectUrl =
            response.user.role === UserRole.Admin ? '/dashboard' : '/';
          this.router.navigate([redirectUrl]);
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  fillCredentials(type: 'admin' | 'customer'): void {
    if (type === 'admin') {
      this.loginForm.patchValue({
        email: 'admin@agropure.com',
        password: 'admin123',
      });
    } else {
      this.loginForm.patchValue({
        email: 'juan@example.com',
        password: 'customer123',
      });
    }
  }
}
