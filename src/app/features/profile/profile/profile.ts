import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal</p>
      </div>

      <mat-card class="profile-card" *ngIf="user">
        <mat-card-header>
          <div class="profile-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <mat-card-title
            >{{ user.firstName }} {{ user.lastName }}</mat-card-title
          >
          <mat-card-subtitle>
            <mat-chip
              [color]="user.role === 'Admin' ? 'primary' : 'accent'"
              selected
            >
              {{ user.role === 'Admin' ? 'Administrador' : 'Cliente' }}
            </mat-chip>
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="firstName" required />
                <mat-error
                  *ngIf="profileForm.get('firstName')?.hasError('required')"
                >
                  El nombre es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="lastName" required />
                <mat-error
                  *ngIf="profileForm.get('lastName')?.hasError('required')"
                >
                  El apellido es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                Ingresa un email válido
              </mat-error>
            </mat-form-field>

            <div class="profile-info">
              <div class="info-item">
                <mat-icon>calendar_today</mat-icon>
                <div>
                  <strong>Fecha de registro:</strong>
                  <span>{{ user.createdAt | date : 'dd/MM/yyyy' }}</span>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>update</mat-icon>
                <div>
                  <strong>Última actualización:</strong>
                  <span>{{ user.updatedAt | date : 'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>

              <div class="info-item">
                <mat-icon [color]="user.isActive ? 'primary' : 'warn'">
                  {{ user.isActive ? 'check_circle' : 'cancel' }}
                </mat-icon>
                <div>
                  <strong>Estado:</strong>
                  <span
                    [class]="
                      user.isActive ? 'status-active' : 'status-inactive'
                    "
                  >
                    {{ user.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="
                  profileForm.invalid || !profileForm.dirty || isLoading
                "
              >
                <mat-icon>save</mat-icon>
                {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>

              <button
                mat-stroked-button
                type="button"
                (click)="resetForm()"
                [disabled]="!profileForm.dirty"
              >
                <mat-icon>refresh</mat-icon>
                Descartar Cambios
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .profile-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .profile-header {
        margin-bottom: 32px;
      }
      .profile-header h1 {
        color: #2e7d32;
        margin-bottom: 8px;
      }
      .profile-card {
        padding: 24px;
      }
      .profile-avatar {
        display: flex;
        align-items: center;
        margin-right: 16px;
      }
      .profile-avatar mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #4caf50;
      }
      .form-row {
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
      .profile-info {
        margin: 32px 0;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
      }
      .info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      .info-item:last-child {
        margin-bottom: 0;
      }
      .info-item mat-icon {
        color: #666;
      }
      .status-active {
        color: #4caf50;
        font-weight: 500;
      }
      .status-inactive {
        color: #f44336;
        font-weight: 500;
      }
      .form-actions {
        display: flex;
        gap: 16px;
        margin-top: 24px;
      }
      @media (max-width: 600px) {
        .form-row {
          flex-direction: column;
          gap: 0;
        }
        .form-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        this.profileForm.markAsPristine();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.profileForm.dirty) {
      this.isLoading = true;
      this.userService.updateProfile(this.profileForm.value).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.profileForm.markAsPristine();
          this.isLoading = false;
          this.notificationService.success('Perfil actualizado exitosamente');
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  resetForm(): void {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
      });
      this.profileForm.markAsPristine();
    }
  }
}
