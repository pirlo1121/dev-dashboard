import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isMobileMenuOpen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Close mobile menu when resizing to desktop
    if (window.innerWidth >= 1024) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  logout() {
    this.closeMobileMenu();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
