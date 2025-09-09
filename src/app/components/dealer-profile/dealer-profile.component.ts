
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DealerModel } from '../../models/data/dealer-model';
import { DealerService } from '../../Services/dealer.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-dealer-profile',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dealer-profile.component.html',
  styleUrl: './dealer-profile.component.css'
})

export class DealerProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  dealer: DealerModel | null = null;

  constructor(
    private fb: FormBuilder,
    private dealerService: DealerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    const role = localStorage.getItem('userRole');

    if (!token || !role?.includes('Dealer')) {
      return; // Prevent unauthorized access
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Payload from dealer profile: ", payload);
    const userId = payload?.DealerId;

    this.profileForm = this.fb.group({
      dealerName: [''],
      address: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      storageCapacity: [0],
      inventory: [0]
    });

    this.dealerService.getDealerByUserId(userId).subscribe((data: DealerModel) => {
      this.dealer = data;
      this.profileForm.patchValue(data);
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    if (this.profileForm.valid && this.dealer?.dealerId) {
      const updatedDealer: DealerModel = { ...this.profileForm.value, dealerId: this.dealer.dealerId };
      this.dealerService.updateDealer(this.dealer.dealerId, updatedDealer).subscribe(() => {
        this.isEditing = false;
        alert('Profile updated successfully!');
      });
    }
  }
}
