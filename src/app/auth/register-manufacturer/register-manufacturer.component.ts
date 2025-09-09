import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required],
        companyName: ['', Validators.required],
        registrationNumber: ['', Validators.required]
      },
      {
        validators: [this.passwordMatchValidator()]
      }
    );
  }

  // ✅ Custom validator for matching passwords
  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) return;

    const manufacturerModel: ManufacturerRegister = this.registerForm.value;

    this.authService.registerManufacturer(manufacturerModel).subscribe({
      next: (res) => {
        this.successMessage =
          res.message ||
          'Manufacturer registered successfully! Waiting for Admin Approval';
        this.registerForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Registration failed! Username may already exist.';
      }
    });
  }
}
