import { Component } from '@angular/core';
import { LoginModel } from '../../models/auth/login-model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import {CommonModule} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  userLogin: LoginModel = {
    username: '',
    password: ''
  }
  role: any='';
  loginError: string | null = null;  // store error message
  
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginError = null; 
      if (this.loginForm.valid) {
        this.userLogin = this.loginForm.value;
  
        this.authService.login(this.userLogin).subscribe({
          next: (data) => {
            this.role = localStorage.getItem('userRole')?.toLowerCase();
            this.router.navigate(['/home']);
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.loginError = 'Incorrect username or password';
            } else {
              this.loginError = 'Something went wrong. Please try again later.';
            }
          }
        });
      } else {
        this.loginForm.markAllAsTouched(); // highlight errors
      }
    }

  }
  
}




