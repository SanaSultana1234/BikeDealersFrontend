import { Component } from '@angular/core';
import { LoginModel } from '../../models/auth/login-model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
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

  
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userLogin = this.loginForm.value;  
      console.log('Form submitted:', this.loginForm.value);
      
      //Call your authentication API here
      this.authService.login(this.userLogin).subscribe((data) => {
        console.log(data);
        console.log(localStorage.getItem('userRole'));
        this.role = localStorage.getItem('userRole')?.toLowerCase;
      });
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnInit(): void {}

  // login() {
  //   this.authService.login(this.userLogin).subscribe((data) => {
  //     console.log(localStorage.getItem('userRole'));
  //     this.role = localStorage.getItem('userRole')?.toLowerCase;
  //   });
  // }

  
}




