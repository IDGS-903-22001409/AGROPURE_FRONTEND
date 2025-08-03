import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="admin-layout">
      <app-header></app-header>
      <div class="admin-content">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .admin-content {
        flex: 1;
        display: flex;
      }
      .main-content {
        flex: 1;
        padding: 24px;
        background: #f5f5f5;
      }
    `,
  ],
})
export class AdminLayoutComponent {}
