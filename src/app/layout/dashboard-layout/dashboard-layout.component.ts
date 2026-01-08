import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="dashboard-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar glass-card">
        <div class="logo">
          <span>Admin</span>Port
        </div>
        
        <nav class="nav-menu">
          <a routerLink="/dashboard/projects" routerLinkActive="active" class="nav-item">
            Projects
          </a>
          <!-- Add more menu items here -->
        </nav>

        <div class="user-footer">
          <button (click)="logout()" class="btn btn-logout">Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
    styles: [`
    .dashboard-wrapper {
      display: flex;
      min-height: 100vh;
      background: var(--bg-dark);
      padding: 1rem;
      gap: 1rem;
    }
    .sidebar {
      width: 250px;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      height: calc(100vh - 2rem);
      position: sticky;
      top: 1rem;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 3rem;
    }
    .logo span {
      color: var(--primary);
    }
    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }
    .nav-item {
      padding: 0.8rem 1rem;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all 0.2s;
      font-weight: 500;
    }
    .nav-item:hover, .nav-item.active {
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary);
    }
    .main-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    .btn-logout {
      width: 100%;
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      margin-top: auto;
    }
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.2);
    }
  `]
})
export class DashboardLayoutComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    logout() {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
