import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { UserRegister } from '../../models/auth/user-register';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  registerForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/) // 1 uppercase, 1 number, 1 special char
          ]
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  // Custom validator for password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) return;

    const userModel: UserRegister = this.registerForm.value;

    this.authService.registerUser(userModel).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'User registered successfully!';
        this.registerForm.reset();
        this.submitted = false;
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Username already exists!';
      }
    });
  }
}
