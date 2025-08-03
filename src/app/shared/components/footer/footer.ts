import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="brand">
            <mat-icon>water_drop</mat-icon>
            <span>AGROPURE</span>
          </div>
          <p>
            Sistema Inteligente de Monitoreo y Tratamiento de Agua para Riego
          </p>
        </div>

        <div class="footer-section">
          <h3>Contacto</h3>
          <p>📧 info@agropure.com</p>
          <p>📞 +52 (477) 123-4567</p>
          <p>📍 León, Guanajuato, México</p>
        </div>

        <div class="footer-section">
          <h3>Síguenos</h3>
          <div class="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 AGROPURE. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: #2e7d32;
        color: white;
        margin-top: auto;
      }
      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 32px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .footer-section h3 {
        margin-bottom: 16px;
        color: #a5d6a7;
      }
      .social-links {
        display: flex;
        gap: 12px;
      }
      .social-links a {
        font-size: 1.5rem;
        text-decoration: none;
      }
      .footer-bottom {
        text-align: center;
        padding: 16px;
        border-top: 1px solid #4caf50;
        background: #1b5e20;
      }
    `,
  ],
})
export class FooterComponent {}
