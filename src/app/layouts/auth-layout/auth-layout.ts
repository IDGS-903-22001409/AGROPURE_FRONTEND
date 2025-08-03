import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .auth-layout {
        min-height: 100vh;
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class AuthLayoutComponent {}
