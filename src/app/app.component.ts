import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { RegisterUserComponent } from "./auth/register-user/register-user.component";
import { LoginComponent } from "./auth/login/login.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AuthService } from './Services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, RegisterUserComponent, LoginComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  constructor(public authService: AuthService) {}
}
