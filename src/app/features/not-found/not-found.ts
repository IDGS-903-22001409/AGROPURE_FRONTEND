import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <mat-icon class="not-found-icon">error_outline</mat-icon>
        <h1>404</h1>
        <h2>Página No Encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <div class="actions">
          <a mat-raised-button color="primary" routerLink="/">
            <mat-icon>home</mat-icon>
            Volver al Inicio
          </a>
          <a mat-stroked-button routerLink="/products">
            <mat-icon>inventory</mat-icon>
            Ver Productos
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px;
      }
      .not-found-content {
        max-width: 500px;
      }
      .not-found-icon {
        font-size: 120px;
        height: 120px;
        width: 120px;
        color: #ccc;
        margin-bottom: 24px;
      }
      h1 {
        font-size: 4rem;
        margin: 0;
        color: #2e7d32;
        font-weight: 300;
      }
      h2 {
        color: #666;
        margin: 16px 0;
      }
      p {
        color: #999;
        margin-bottom: 32px;
        line-height: 1.6;
      }
      .actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class NotFoundComponent {}
