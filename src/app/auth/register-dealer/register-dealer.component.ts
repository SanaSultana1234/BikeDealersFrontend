import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required],
        storeName: ['', Validators.required],
        storageCapacity: ['', [Validators.required, Validators.min(1)]],
        inventory: ['', [Validators.required, Validators.min(0)]]
      },
      {
        validators: [this.passwordMatchValidator(), this.inventoryValidator()]
      }
    );
  }

  // ✅ Passwords must match
  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }

  // ✅ Inventory <= Storage Capacity
  inventoryValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const storage = Number(form.get('storageCapacity')?.value);
      const inventory = Number(form.get('inventory')?.value);
      return inventory > storage ? { inventoryExceeds: true } : null;
    };
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) return;

    const dealerModel: DealerRegister = this.registerForm.value;

    this.authService.registerDealer(dealerModel).subscribe({
      next: (res) => {
        this.successMessage =
          res.message || 'Dealer registered successfully! Waiting for Admin Approval';
        this.registerForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed! Username already exists';
        console.error(err);
      }
    });
  }

  // helper for cleaner HTML
  get f() {
    return this.registerForm.controls;
  }
}
