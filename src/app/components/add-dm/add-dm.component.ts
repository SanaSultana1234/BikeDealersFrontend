
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DealerMasterService } from '../../Services/dealer-master.service';
import { BikeService } from '../../Services/bike.service';
import { DealerService } from '../../Services/dealer.service';
import { DealerMasterModel } from '../../models/data/dealer-master-model';

@Component({
  selector: 'app-add-dm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-dm.component.html',
  styleUrl: './add-dm.component.css'
})
export class AddDMComponent {
  addDMForm: FormGroup;
  today: string = '';

  bikes: any[] = [];   // will store list of bikes
  dealers: any[] = []; // will store list of dealers
  selectedDealer: any | null = null; // store selected dealer

  constructor(
    private fb: FormBuilder,
    private dmService: DealerMasterService,
    private bikeService: BikeService,
    private dealerService: DealerService,
    private router: Router
  ) {
    this.addDMForm = this.fb.group({
      dealerId: ['', Validators.required],
      bikeId: ['', Validators.required],
      bikesDelivered: ['', Validators.required],
      deliveryDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBikes();
    this.loadDealers();

    const now = new Date();
    this.today = now.toISOString().split('T')[0];

     // Watch dealerId selection and update selectedDealer
     this.addDMForm.get('dealerId')?.valueChanges.subscribe((dealerId) => {
      this.selectedDealer = this.dealers.find(d => d.dealerId == dealerId) || null;
      this.addDMForm.get('bikesDelivered')?.updateValueAndValidity();
    });

    // Custom validator for bikesDelivered (depends on selected dealer)
    this.addDMForm.get('bikesDelivered')?.setValidators([
      Validators.required,
      Validators.min(1),
      (control: AbstractControl): ValidationErrors | null => {
        if (!this.selectedDealer) return null;
        const maxAllowed = this.selectedDealer.storageCapacity - this.selectedDealer.inventory;
        return control.value > maxAllowed ? { exceedCapacity: true } : null;
      }
    ]);
  }

  loadBikes() {
    this.bikeService.getBikes().subscribe({
      next: (res) => {
        this.bikes = res;
      },
      error: (err) => {
        console.error('Error fetching bikes:', err);
      }
    });
  }

  loadDealers() {
    this.dealerService.getDealers().subscribe({
      next: (res) => {
        this.dealers = res;
      },
      error: (err) => {
        console.error('Error fetching dealers:', err);
      }
    });
  }

  onSubmit() {
    if (this.addDMForm.valid) {
      let dmModel: DealerMasterModel = this.addDMForm.value;

      this.dmService.addDM(dmModel).subscribe({
        next: (res) => {
          console.log('Dealer Master (Delivery) added successfully', res, dmModel);
          this.addDMForm.reset();
          this.router.navigate(['/dmTable']);  // redirect back to DM table
        },
        error: (err) => {
          console.error('Error adding Dealer Master:', err);
          alert('Failed to deliver bikes. Try again later.');
        }
      });
    }
  }

  onCancelAdd() {
    this.router.navigate(['/dmTable']);
  }
}
