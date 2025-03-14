import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize(); // Solo ejecuta esto en el navegador
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
}
