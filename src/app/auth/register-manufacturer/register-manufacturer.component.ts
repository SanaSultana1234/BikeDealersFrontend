import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ManufacturerRegister } from '../../models/auth/manufacturer-register';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-manufacturer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-manufacturer.component.html',
  styleUrl: './register-manufacturer.component.css'
})
export class RegisterManufacturerComponent {
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
      companyName: ['', Validators.required],
      registrationNumber: ['', Validators.required]
    });
  }

  
  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) return;

    const manufacturerModel: ManufacturerRegister = this.registerForm.value;

    this.authService.registerManufacturer(manufacturerModel).subscribe({
      next: (res) => {
        console.log(res);
        this.successMessage = res.message || 'Manufacturer registered successfully! Waiting for Admin Approval';
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
