import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
   // Navigate to the respective management page
   showLoginModal = false;
    loggedIn: boolean = false;
   constructor(
    private router: Router,
    private authService: AuthService) {}
 
    ngOnInit() {
      this.loggedIn = this.authService.isLoggedIn();
    }
   // Called when user clicks restricted feature
   showLoginRequired(): void {
     this.showLoginModal = true;
   }
 
   closeModal(): void {
     this.showLoginModal = false;
   }
 
   // Navigation with login check (replace with actual auth check)
   navigateTo(route: string): void {
      this.loggedIn = this.authService.isLoggedIn(); // simple check
     if (this.loggedIn) {
       this.router.navigate([route]);
     } else {
       this.showLoginRequired();
     }
   }

  formData = { name: '', email: '', message: '' };

  sendMail(event: Event) {
    event.preventDefault();
    const subject = encodeURIComponent(`Message from ${this.formData.name}`);
    const body = encodeURIComponent(`From: ${this.formData.name} (${this.formData.email})\n\n${this.formData.message}`);
    window.location.href = `mailto:admin@bikedekho.com?subject=${subject}&body=${body}`;
  }

}
