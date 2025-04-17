import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarOpen = false;
  isMobileScreen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }



  toggleSidebar() {
    if (this.isMobile()) {
      this.isSidebarOpen = !this.isSidebarOpen;
      console.log('Sidebar status:', this.isSidebarOpen);
    }
  }

  isMobile(): boolean {
    return this.isMobileScreen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  checkScreenSize() {
    this.isMobileScreen = window.innerWidth < 1024;
  }

  closeSidebar() {
    if (this.isMobile()) {
      this.isSidebarOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
