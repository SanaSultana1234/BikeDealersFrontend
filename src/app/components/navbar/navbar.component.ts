import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service'; // adjust path if needed

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}


goToProfile() {
  const userType = this.authService.getUserRole(); // e.g., 'Dealer' or 'User'
  if (userType.includes('Dealer')) {
    this.router.navigate(['/dealerProfile']);
  } else {
    this.router.navigate(['/userProfile']);
  }
}
  toggleSidebar() {
    document.body.classList.toggle('sb-sidenav-toggled');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}

