import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  username: string | null = null;
  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUserName();
      this.role = this.authService.getUserRole();
    }
  }

  getRole() {
    if(this.role.includes('Admin')) return 'Admin';
    else if(this.role.includes('Dealer') && ('Manufacturer')) return 'DM';
    else if(this.role.includes('Dealer')) return 'Dealer';
    else if(this.role.includes('Manufacturer')) return 'Manufacturer';
    else return 'User';
  }
}
