import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <mat-icon class="hero-icon">water_drop</mat-icon>
            AGROPURE
          </h1>
          <p class="hero-subtitle">
            Sistema Inteligente de Monitoreo y Tratamiento de Agua para Riego
          </p>
          <p class="hero-description">
            Optimiza la calidad del agua de riego con nuestra tecnología IoT
            avanzada. Monitoreo en tiempo real, análisis predictivo y
            tratamiento automatizado.
          </p>

          <div
            class="hero-actions"
            *ngIf="!(currentUser$ | async); else loggedInActions"
          >
            <a
              mat-raised-button
              color="primary"
              routerLink="/register"
              class="cta-button"
            >
              Comenzar Ahora
            </a>
            <a
              mat-stroked-button
              routerLink="/products"
              class="secondary-button"
            >
              Ver Productos
            </a>
          </div>

          <ng-template #loggedInActions>
            <div class="hero-actions">
              <a
                mat-raised-button
                color="primary"
                routerLink="/products"
                class="cta-button"
              >
                Explorar Productos
              </a>
              <a
                mat-stroked-button
                routerLink="/quotes"
                class="secondary-button"
              >
                Solicitar Cotización
              </a>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">Características Principales</h2>
          <div class="features-grid">
            <mat-card class="feature-card">
              <mat-icon class="feature-icon">sensors</mat-icon>
              <mat-card-header>
                <mat-card-title>Sensores IoT</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>
                  Monitoreo continuo de pH, conductividad, turbidez y otros
                  parámetros críticos del agua.
                </p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-icon class="feature-icon">analytics</mat-icon>
              <mat-card-header>
                <mat-card-title>Análisis Predictivo</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>
                  IA que predice problemas y optimiza el tratamiento del agua
                  antes de que afecten tus cultivos.
                </p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-icon class="feature-icon">automation</mat-icon>
              <mat-card-header>
                <mat-card-title>Automatización</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>
                  Sistema automatizado de dosificación de químicos y ajuste de
                  parámetros en tiempo real.
                </p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-icon class="feature-icon">mobile_friendly</mat-icon>
              <mat-card-header>
                <mat-card-title>Control Remoto</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>
                  Accede y controla tu sistema desde cualquier lugar con nuestra
                  app móvil y web.
                </p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits-section">
        <div class="container">
          <h2 class="section-title">Beneficios para tu Cultivo</h2>
          <div class="benefits-grid">
            <div class="benefit-item">
              <mat-icon>trending_up</mat-icon>
              <h3>Incrementa el Rendimiento</h3>
              <p>Hasta 30% más de productividad con agua optimizada</p>
            </div>
            <div class="benefit-item">
              <mat-icon>water_drop</mat-icon>
              <h3>Ahorra Agua</h3>
              <p>Reduce el consumo hasta en 25% con riego inteligente</p>
            </div>
            <div class="benefit-item">
              <mat-icon>eco</mat-icon>
              <h3>Agricultura Sostenible</h3>
              <p>Minimiza el impacto ambiental y químicos</p>
            </div>
            <div class="benefit-item">
              <mat-icon>attach_money</mat-icon>
              <h3>Reduce Costos</h3>
              <p>Optimiza recursos y reduce pérdidas de cultivos</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <h2>¿Listo para Revolucionar tu Sistema de Riego?</h2>
          <p>Únete a más de 500 agricultores que ya confían en AGROPURE</p>
          <div class="cta-actions">
            <a
              mat-raised-button
              color="accent"
              routerLink="/quotes"
              class="cta-button"
            >
              Solicitar Cotización
            </a>
            <a
              mat-stroked-button
              routerLink="/products"
              class="secondary-button"
            >
              Ver Catálogo
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-container {
        min-height: 100vh;
      }

      .hero-section {
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
        color: white;
        padding: 80px 20px;
        text-align: center;
      }

      .hero-content {
        max-width: 800px;
        margin: 0 auto;
      }

      .hero-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        font-size: 3.5rem;
        margin-bottom: 16px;
        font-weight: 300;
      }

      .hero-icon {
        font-size: 3.5rem;
        height: 3.5rem;
        width: 3.5rem;
      }

      .hero-subtitle {
        font-size: 1.5rem;
        margin-bottom: 24px;
        opacity: 0.9;
      }

      .hero-description {
        font-size: 1.1rem;
        margin-bottom: 40px;
        opacity: 0.8;
        line-height: 1.6;
      }

      .hero-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .cta-button {
        padding: 12px 32px;
        font-size: 1.1rem;
      }

      .secondary-button {
        padding: 12px 32px;
        font-size: 1.1rem;
        color: white;
        border-color: white;
      }

      .features-section {
        padding: 80px 20px;
        background: #f8f9fa;
      }

      .benefits-section {
        padding: 80px 20px;
      }

      .cta-section {
        padding: 80px 20px;
        background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
        color: white;
        text-align: center;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .section-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 48px;
        color: #2e7d32;
      }

      .cta-section .section-title,
      .cta-section h2 {
        color: white;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 32px;
      }

      .feature-card {
        text-align: center;
        padding: 24px;
        height: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .feature-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #4caf50;
        margin-bottom: 16px;
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 32px;
      }

      .benefit-item {
        text-align: center;
        padding: 24px;
      }

      .benefit-item mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #4caf50;
        margin-bottom: 16px;
      }

      .benefit-item h3 {
        color: #2e7d32;
        margin-bottom: 12px;
      }

      .cta-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 32px;
      }

      .cta-section .secondary-button {
        color: white;
        border-color: white;
      }

      @media (max-width: 768px) {
        .hero-title {
          font-size: 2.5rem;
          flex-direction: column;
          gap: 8px;
        }

        .hero-icon {
          font-size: 2.5rem;
          height: 2.5rem;
          width: 2.5rem;
        }

        .features-grid,
        .benefits-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}
}
