import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MaterialService } from '../../../core/services/material';
import { NotificationService } from '../../../core/services/notification';
import { Material } from '../../../core/models/material';
import { MaterialFormComponent } from '../material-form/material-form';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './material-list.html',
  styleUrls: ['./material-list.scss'],
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'cost',
    'supplier',
    'status',
    'actions',
  ];

  constructor(
    private materialService: MaterialService,
    private notificationService: NotificationService,
    private dialog: MatDialog
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
      },
    });
  }

  openMaterialForm(material?: Material): void {
    const dialogRef = this.dialog.open(MaterialFormComponent, {
      width: '600px',
      data: material || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMaterials();
      }
    });
  }

  editMaterial(material: Material): void {
    this.openMaterialForm(material);
  }

  deleteMaterial(material: Material): void {
    if (confirm(`¿Eliminar material ${material.name}?`)) {
      this.materialService.deleteMaterial(material.id).subscribe({
        next: () => {
          this.materials = this.materials.filter((m) => m.id !== material.id);
          this.notificationService.success('Material eliminado exitosamente');
        },
      });
    }
  }
}
