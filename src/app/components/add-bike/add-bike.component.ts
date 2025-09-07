import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BikeModel } from '../../models/data/bike-model';
import { BikeService } from '../../Services/bike.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-bike',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-bike.component.html',
  styleUrl: './add-bike.component.css'
})

export class AddBikeComponent {
  addBikeForm: FormGroup;
  constructor(private fb: FormBuilder, private bikeService: BikeService, private router: Router) {
    this.addBikeForm = this.fb.group({
      modelName: ['', Validators.required],
      modelYear: ['', [Validators.required]],
      engineCC: ['', [Validators.required]],
      manufacturer: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.addBikeForm.valid) {
      
      let bikeModel: any = this.addBikeForm.value;

      this.bikeService.addBike(bikeModel).subscribe({
        next: (res) => {
          console.log('Bike added successfully', res, bikeModel);
         // alert('Bike added successfully!');
          this.addBikeForm.reset();
          this.router.navigate(['/bikesTable']);  
        },
        error: (err) => {
          console.error('Error adding bike:', err);
          alert('Failed to add bike. Try again later.');
        }
      });
    }
  }

  onCancelAdd() {
    this.router.navigate(['/bikesTable']);
  }
}
