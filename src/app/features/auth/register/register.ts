import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="register-icon">water_drop</mat-icon>
            <mat-card-title>Únete a AGROPURE</mat-card-title>
            <mat-card-subtitle
              >Crea tu cuenta y comienza a optimizar tu riego</mat-card-subtitle
            >
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="name-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="firstName" required />
                <mat-icon matSuffix>person</mat-icon>
                <mat-error
                  *ngIf="registerForm.get('firstName')?.hasError('required')"
                >
                  El nombre es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="lastName" required />
                <mat-icon matSuffix>person</mat-icon>
                <mat-error
                  *ngIf="registerForm.get('lastName')?.hasError('required')"
                >
                  El apellido es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-icon matSuffix>email</mat-icon>
              <mat-error
                *ngIf="registerForm.get('email')?.hasError('required')"
              >
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
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
                *ngIf="registerForm.get('password')?.hasError('required')"
              >
                La contraseña es requerida
              </mat-error>
              <mat-error
                *ngIf="registerForm.get('password')?.hasError('minlength')"
              >
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar Contraseña</mat-label>
              <input
                matInput
                [type]="hideConfirmPassword ? 'password' : 'text'"
                formControlName="confirmPassword"
                required
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hideConfirmPassword = !hideConfirmPassword"
                type="button"
              >
                <mat-icon>{{
                  hideConfirmPassword ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
              <mat-error
                *ngIf="
                  registerForm.get('confirmPassword')?.hasError('required')
                "
              >
                Confirma tu contraseña
              </mat-error>
              <mat-error
                *ngIf="
                  registerForm
                    .get('confirmPassword')
                    ?.hasError('passwordMismatch')
                "
              >
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width register-button"
              [disabled]="registerForm.invalid || isLoading"
            >
              {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="login-link">
            ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 20px;
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      }
      .register-card {
        width: 100%;
        max-width: 500px;
        padding: 20px;
      }
      .header-content {
        text-align: center;
        width: 100%;
      }
      .register-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #4caf50;
        margin-bottom: 16px;
      }
      .name-row {
        display: flex;
        gap: 16px;
      }
      .half-width {
        flex: 1;
      }
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }
      .register-button {
        height: 48px;
        font-size: 16px;
        margin: 24px 0;
      }
      .login-link {
        text-align: center;
        margin: 0;
      }
      .login-link a {
        color: #4caf50;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .name-row {
          flex-direction: column;
          gap: 0;
        }
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword;

      this.authService.register(formData).subscribe({
        next: () => {
          this.notificationService.success(
            '¡Cuenta creada exitosamente! Bienvenido a AGROPURE'
          );
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
