import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MaterialService } from '../../../core/services/material.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Material } from '../../../core/models/material.model';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="material-list-container">
      <div class="list-header">
        <h1>Gestión de Materiales</h1>
        <p>Administra el inventario de materiales</p>
        <button mat-raised-button color="primary" (click)="openMaterialForm()">
          <mat-icon>add</mat-icon>
          Nuevo Material
        </button>
      </div>

      <mat-card *ngIf="materials.length > 0; else noMaterials">
        <mat-card-content>
          <table mat-table [dataSource]="materials" class="materials-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let material">{{ material.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Material</th>
              <td mat-cell *matCellDef="let material">
                <div>
                  <strong>{{ material.name }}</strong><br>
                  <small>{{ material.description }}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="cost">
              <th mat-header-cell *matHeaderCellDef>Costo</th>
              <td mat-cell *matCellDef="let material">
                ${{ material.unitCost | number:'1.2-2' }} / {{ material.unit }}
              </td>
            </ng-container>

            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef>Proveedor</th>
              <td mat-cell *matCellDef="let material">{{ material.supplierName }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let material">
                <mat-chip [color]="material.isActive ? 'primary' : 'warn'" selected>
                  {{ material.isActive ? 'Disponible' : 'No Disponible' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let material">
                <button mat-icon-button color="primary" (click)="editMaterial(material)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteMaterial(material)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noMaterials>
        <mat-card>
          <mat-card-content>
            <div class="no-materials">
              <mat-icon>build</mat-icon>
              <h2>No hay materiales registrados</h2>
              <p>Agrega materiales para crear productos del sistema.</p>
              <button mat-raised-button color="primary" (click)="openMaterialForm()">
                <mat-icon>add</mat-icon>
                Agregar Primer Material
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .material-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .list-header h1 {
      color: #2e7d32;
      margin: 0;
    }
    .materials-table {
      width: 100%;
    }
    .no-materials {
      text-align: center;
      padding: 64px 32px;
    }
    .no-materials mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 24px;
    }
    .no-materials h2 {
      color: #666;
      margin-bottom: 16px;
    }
  `]
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  displayedColumns: string[] = ['id', 'name', 'cost', 'supplier', 'status', 'actions'];

  constructor(
    private materialService: MaterialService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  private loadMaterials(): void {
    this.materialService.getMaterials().subscribe({
      next: (materials) => {
        this.materials = materials;
      },
      error: (error) => {
        console.error('Error loading materials:', error);
      }
    });
  }

  openMaterialForm(material?: Material): void {
    this.notificationService.info('Función de formulario en desarrollo');
  }

  editMaterial(material: Material): void {
    this.openMaterialForm(material);
  }

  deleteMaterial(material: Material): void {
    if (confirm(`¿Eliminar material ${material.name}?`)) {
      this.materialService.deleteMaterial(material.id).subscribe({
        next: () => {
          this.materials = this.materials.filter(m => m.id !== material.id);
          this.notificationService.success('Material eliminado exitosamente');
        }
      });
    }
  }
}
