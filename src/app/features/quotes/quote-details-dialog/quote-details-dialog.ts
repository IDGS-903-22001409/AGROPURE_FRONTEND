import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { QuoteService } from '../../../core/services/quote';
import { NotificationService } from '../../../core/services/notification';
import { Quote } from '../../../core/models/quote';
import { QuoteStatus } from '../../../core/models/enums';

@Component({
  selector: 'app-quote-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <div class="quote-details-dialog">
      <h2 mat-dialog-title>
        <div class="dialog-header">
          <div class="header-info">
            <span>Cotización #{{ data.id }}</span>
            <mat-chip [color]="getStatusColor(data.status)" selected>
              {{ getStatusText(data.status) }}
            </mat-chip>
          </div>
          <button mat-icon-button mat-dialog-close>
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </h2>

      <mat-dialog-content class="dialog-content">
        <!-- Información del Cliente -->
        <div class="info-section">
          <h3>
            <mat-icon>person</mat-icon>
            Información del Cliente
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre:</label>
              <span>{{ data.customerName }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ data.customerEmail }}</span>
            </div>
            <div class="info-item" *ngIf="data.customerPhone">
              <label>Teléfono:</label>
              <span>{{ data.customerPhone }}</span>
            </div>
            <div class="info-item" *ngIf="data.customerCompany">
              <label>Empresa:</label>
              <span>{{ data.customerCompany }}</span>
            </div>
            <div class="info-item full-width" *ngIf="data.customerAddress">
              <label>Dirección:</label>
              <span>{{ data.customerAddress }}</span>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Información del Producto -->
        <div class="info-section">
          <h3>
            <mat-icon>inventory</mat-icon>
            Producto y Precio
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Producto:</label>
              <span>{{ data.productName }}</span>
            </div>
            <div class="info-item">
              <label>Cantidad:</label>
              <span>{{ data.quantity }} unidades</span>
            </div>
            <div class="info-item">
              <label>Precio Unitario:</label>
              <span class="price"
                >\${{ data.unitPrice | number : '1.2-2' }}</span
              >
            </div>
            <div class="info-item">
              <label>Total:</label>
              <span class="total-price"
                >\${{ data.totalCost | number : '1.2-2' }}</span
              >
            </div>
          </div>

          <!-- Cálculo de descuento si aplica -->
          <div *ngIf="getDiscount() > 0" class="discount-info">
            <mat-icon>local_offer</mat-icon>
            <span
              >Descuento aplicado: \${{
                getDiscount() | number : '1.2-2'
              }}</span
            >
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Fechas importantes -->
        <div class="info-section">
          <h3>
            <mat-icon>schedule</mat-icon>
            Fechas
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Fecha de Solicitud:</label>
              <span>{{ data.requestDate | date : 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item" *ngIf="data.responseDate">
              <label>Fecha de Respuesta:</label>
              <span>{{ data.responseDate | date : 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item" *ngIf="data.expiryDate">
              <label>Fecha de Expiración:</label>
              <span [class]="isExpired() ? 'expired-date' : ''">
                {{ data.expiryDate | date : 'dd/MM/yyyy' }}
              </span>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Notas -->
        <div class="info-section" *ngIf="data.notes || data.adminNotes">
          <h3>
            <mat-icon>note</mat-icon>
            Notas
          </h3>
          <div class="notes-container">
            <div class="note-item" *ngIf="data.notes">
              <label>Notas del Cliente:</label>
              <p class="note-content">{{ data.notes }}</p>
            </div>
            <div class="note-item" *ngIf="data.adminNotes">
              <label>Notas del Administrador:</label>
              <p class="note-content admin-note">{{ data.adminNotes }}</p>
            </div>
          </div>
        </div>

        <!-- Formulario para cambiar estado (solo si está pendiente) -->
        <div class="info-section" *ngIf="canUpdateStatus()">
          <mat-divider></mat-divider>
          <h3>
            <mat-icon>edit</mat-icon>
            Cambiar Estado
          </h3>
          <form [formGroup]="statusForm" class="status-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nuevo Estado</mat-label>
              <mat-select formControlName="status">
                <mat-option value="Approved">Aprobar</mat-option>
                <mat-option value="Rejected">Rechazar</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notas del Administrador (Opcional)</mat-label>
              <textarea
                matInput
                formControlName="adminNotes"
                rows="3"
                placeholder="Agregar comentarios sobre la decisión..."
              ></textarea>
            </mat-form-field>
          </form>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <div class="actions-left">
          <!-- Acciones especiales para cotizaciones públicas pendientes -->
          <button
            mat-raised-button
            color="accent"
            (click)="approveAndCreateUser()"
            *ngIf="canCreateUser()"
            [disabled]="isLoading"
          >
            <mat-icon>person_add</mat-icon>
            Aprobar y Crear Usuario
          </button>
        </div>

        <div class="actions-right">
          <button mat-button (click)="onCancel()">Cerrar</button>

          <!-- Botones de acción rápida -->
          <button
            mat-raised-button
            color="primary"
            (click)="quickApprove()"
            *ngIf="canQuickApprove()"
            [disabled]="isLoading"
          >
            <mat-icon>check</mat-icon>
            Aprobar
          </button>

          <button
            mat-raised-button
            color="warn"
            (click)="quickReject()"
            *ngIf="canQuickReject()"
            [disabled]="isLoading"
          >
            <mat-icon>close</mat-icon>
            Rechazar
          </button>

          <!-- Botón para actualizar con formulario -->
          <button
            mat-raised-button
            color="primary"
            (click)="updateStatus()"
            *ngIf="canUpdateStatus() && statusForm.valid"
            [disabled]="isLoading"
          >
            <mat-icon>save</mat-icon>
            {{ isLoading ? 'Actualizando...' : 'Actualizar Estado' }}
          </button>
        </div>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .quote-details-dialog {
        width: 100%;
        max-width: 800px;
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .header-info {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .dialog-content {
        max-height: 70vh;
        overflow-y: auto;
      }

      .info-section {
        margin-bottom: 24px;

        h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #2e7d32;
          margin-bottom: 16px;
          font-size: 1.1rem;
        }
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 16px;

        .full-width {
          grid-column: 1 / -1;
        }
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        label {
          font-weight: 500;
          color: #666;
          font-size: 0.9rem;
        }

        span {
          font-size: 1rem;
        }
      }

      .price {
        color: #2e7d32;
        font-weight: 500;
      }

      .total-price {
        color: #2e7d32;
        font-weight: bold;
        font-size: 1.2rem;
      }

      .discount-info {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #e8f5e8;
        padding: 12px;
        border-radius: 8px;
        color: #2e7d32;
        font-weight: 500;
      }

      .expired-date {
        color: #f44336;
        font-weight: 500;
      }

      .notes-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .note-item {
        label {
          font-weight: 500;
          color: #666;
          margin-bottom: 8px;
          display: block;
        }
      }

      .note-content {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 8px;
        margin: 0;
        line-height: 1.5;

        &.admin-note {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
        }
      }

      .status-form {
        .full-width {
          width: 100%;
          margin-bottom: 16px;
        }
      }

      .dialog-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        gap: 16px;

        .actions-left,
        .actions-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }
      }

      @media (max-width: 600px) {
        .info-grid {
          grid-template-columns: 1fr;
        }

        .dialog-actions {
          flex-direction: column;
          gap: 12px;

          .actions-left,
          .actions-right {
            width: 100%;
            justify-content: center;
          }
        }
      }
    `,
  ],
})
export class QuoteDetailsDialogComponent {
  statusForm: FormGroup;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<QuoteDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quote,
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private notificationService: NotificationService
  ) {
    this.statusForm = this.fb.group({
      status: [''],
      adminNotes: [''],
    });
  }

  getStatusColor(status: string | QuoteStatus): 'primary' | 'accent' | 'warn' {
    const statusKey = String(status).toLowerCase();
    switch (statusKey) {
      case 'approved':
      case 'completed':
        return 'primary';
      case 'pending':
        return 'accent';
      case 'rejected':
        return 'warn';
      default:
        return 'accent';
    }
  }

  getStatusText(status: string | QuoteStatus): string {
    const statusKey = String(status).toLowerCase();
    switch (statusKey) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'completed':
        return 'Completada';
      default:
        return String(status);
    }
  }

  getDiscount(): number {
    if (!this.data.unitPrice || !this.data.quantity || !this.data.totalCost) {
      return 0;
    }
    const baseTotal = this.data.unitPrice * this.data.quantity;
    return Math.max(0, baseTotal - this.data.totalCost);
  }

  isExpired(): boolean {
    if (!this.data.expiryDate) return false;
    const expiryDate = new Date(this.data.expiryDate);
    return expiryDate < new Date();
  }

  canUpdateStatus(): boolean {
    return String(this.data.status).toLowerCase() === 'pending';
  }

  canQuickApprove(): boolean {
    return this.canUpdateStatus();
  }

  canQuickReject(): boolean {
    return this.canUpdateStatus();
  }

  canCreateUser(): boolean {
    return this.canUpdateStatus() && this.data.isPublicQuote;
  }

  quickApprove(): void {
    this.updateQuoteStatus(
      QuoteStatus.Approved,
      'Cotización aprobada por el administrador'
    );
  }

  quickReject(): void {
    this.updateQuoteStatus(
      QuoteStatus.Rejected,
      'Cotización rechazada por el administrador'
    );
  }

  updateStatus(): void {
    if (this.statusForm.valid) {
      const formValue = this.statusForm.value;
      this.updateQuoteStatus(
        formValue.status as QuoteStatus,
        formValue.adminNotes || undefined
      );
    }
  }

  approveAndCreateUser(): void {
    this.isLoading = true;
    this.quoteService.approveAndCreateUser(this.data.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Cotización aprobada y usuario creado exitosamente'
        );
        this.dialogRef.close('updated');
      },
      error: (error) => {
        console.error('Error:', error);
        this.notificationService.error(
          'Error al aprobar cotización y crear usuario'
        );
        this.isLoading = false;
      },
    });
  }

  private updateQuoteStatus(status: QuoteStatus, adminNotes?: string): void {
    this.isLoading = true;
    this.quoteService
      .updateQuoteStatus(this.data.id, status, adminNotes)
      .subscribe({
        next: () => {
          const statusText = this.getStatusText(status);
          this.notificationService.success(
            `Cotización ${statusText.toLowerCase()} exitosamente`
          );
          this.dialogRef.close('updated');
        },
        error: (error) => {
          console.error('Error updating quote status:', error);
          this.notificationService.error(
            'Error actualizando el estado de la cotización'
          );
          this.isLoading = false;
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
