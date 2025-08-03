import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
  ],
  template: `
    <div class="user-list-container">
      <div class="list-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra todos los usuarios del sistema</p>
      </div>

      <mat-card *ngIf="users.length > 0; else noUsers">
        <mat-card-content>
          <table mat-table [dataSource]="users" class="users-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let user">{{ user.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let user">
                {{ user.firstName }} {{ user.lastName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rol</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip
                  [color]="user.role === 'Admin' ? 'primary' : 'accent'"
                  selected
                >
                  {{ user.role === 'Admin' ? 'Administrador' : 'Cliente' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip [color]="user.isActive ? 'primary' : 'warn'" selected>
                  {{ user.isActive ? 'Activo' : 'Inactivo' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Registro</th>
              <td mat-cell *matCellDef="let user">
                {{ user.createdAt | date : 'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let user">
                <button
                  mat-icon-button
                  [color]="user.isActive ? 'warn' : 'primary'"
                  (click)="toggleUserStatus(user)"
                  [title]="
                    user.isActive ? 'Desactivar usuario' : 'Activar usuario'
                  "
                >
                  <mat-icon>{{
                    user.isActive ? 'block' : 'check_circle'
                  }}</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteUser(user)"
                  title="Eliminar usuario"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              [class]="!row.isActive ? 'inactive-row' : ''"
            ></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noUsers>
        <mat-card>
          <mat-card-content>
            <div class="no-users">
              <mat-icon>people</mat-icon>
              <h2>No hay usuarios registrados</h2>
              <p>
                Los usuarios aparecerán aquí cuando se registren en el sistema.
              </p>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>

      <!-- Statistics -->
      <div class="stats-grid" *ngIf="users.length > 0">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon total">people</mat-icon>
              <div>
                <h3>{{ getTotalUsers() }}</h3>
                <p>Total Usuarios</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon active">check_circle</mat-icon>
              <div>
                <h3>{{ getActiveUsers() }}</h3>
                <p>Usuarios Activos</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon admin">admin_panel_settings</mat-icon>
              <div>
                <h3>{{ getAdminUsers() }}</h3>
                <p>Administradores</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .user-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .list-header {
        margin-bottom: 32px;
      }
      .list-header h1 {
        color: #2e7d32;
        margin-bottom: 8px;
      }
      .users-table {
        width: 100%;
      }
      .inactive-row {
        opacity: 0.6;
        background-color: #f5f5f5;
      }
      .no-users {
        text-align: center;
        padding: 64px 32px;
      }
      .no-users mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #ccc;
        margin-bottom: 24px;
      }
      .no-users h2 {
        color: #666;
        margin-bottom: 16px;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
        margin-top: 32px;
      }
      .stat-card {
        height: 100px;
      }
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
        height: 100%;
      }
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      .stat-icon.total {
        background: #2196f3;
      }
      .stat-icon.active {
        background: #4caf50;
      }
      .stat-icon.admin {
        background: #9c27b0;
      }
      .stat-content h3 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
      }
      .stat-content p {
        margin: 4px 0 0 0;
        color: #666;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'role',
    'status',
    'createdAt',
    'actions',
  ];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  toggleUserStatus(user: User): void {
    const action = user.isActive ? 'desactivar' : 'activar';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Usuario`,
        message: `¿Estás seguro de que deseas ${action} a ${user.firstName} ${user.lastName}?`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        type: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.toggleUserStatus(user.id).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex((u) => u.id === user.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
            this.notificationService.success(
              `Usuario ${action}do exitosamente`
            );
          },
        });
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar a ${user.firstName} ${user.lastName}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        type: 'danger',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter((u) => u.id !== user.id);
            this.notificationService.success('Usuario eliminado exitosamente');
          },
        });
      }
    });
  }

  getTotalUsers(): number {
    return this.users.length;
  }

  getActiveUsers(): number {
    return this.users.filter((u) => u.isActive).length;
  }

  getAdminUsers(): number {
    return this.users.filter((u) => u.role === 'Admin').length;
  }
}
