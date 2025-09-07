import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { DealerRegister } from '../../models/auth/dealer-register';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-dealer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-dealer.component.html',
  styleUrl: './register-dealer.component.css'
})
export class RegisterDealerComponent {
  registerForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      storeName: ['', Validators.required],
      storageCapacity: ['', Validators.required],
      inventory: ['', Validators.required]
    });
  }

  
  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) return;

    const dealerModel: DealerRegister = this.registerForm.value;

    this.authService.registerDealer(dealerModel).subscribe({
      next: (res) => {
        console.log(res);
        this.successMessage = res.message || 'Dealer registered successfully! Waiting for Admin Approval';
        this.registerForm.reset();
        this.submitted = false;
        //this.router.navigate(['login'])
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed!';
        console.error(err);
      }
    });
  }
}
