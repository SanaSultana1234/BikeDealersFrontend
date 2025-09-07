import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  toggleSidebar() {
    // If you're using SB Admin's JS, this toggles a CSS class on body
    document.body.classList.toggle('sb-sidenav-toggled');
  }
}

