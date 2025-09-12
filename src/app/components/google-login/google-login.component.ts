import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-google-login',
  standalone: true,
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements AfterViewInit {

  constructor(private auth: AuthService, private router: Router) {}

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: '601842001012-v3ugssoee0nikb5f45i3gehvoplvcrnv.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any) {
    const idToken = response.credential;

    this.auth.loginWithGoogle(idToken).subscribe({
      next: (res) => {
        const token = res.token || res.Token;
        if (token) {
          this.auth.saveToken(token);
  
          // decode payload
          const tokenPart = token.split('.');
          const payload = JSON.parse(atob(tokenPart[1]));
  
          // save role + username/email
          const role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          localStorage.setItem('userRole', role);
          this.auth['bSubject'].next(role);  // update BehaviorSubject
  
          console.log("Google login payload:", payload);
        }
  
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Google login failed');
      }
    });
  }
}
