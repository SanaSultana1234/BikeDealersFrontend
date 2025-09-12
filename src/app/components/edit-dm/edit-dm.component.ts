import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DealerMasterService } from '../../Services/dealer-master.service';
import { BikeService } from '../../Services/bike.service';
import { DealerService } from '../../Services/dealer.service';
import { DealerMasterModel } from '../../models/data/dealer-master-model';

@Component({
  selector: 'app-edit-dm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-dm.component.html',
  styleUrl: './edit-dm.component.css'
})
export class EditDMComponent implements OnInit {
  editDMForm: FormGroup;

  bikes: any[] = [];
  dealers: any[] = [];
  selectedDealer: any | null = null;
  dmId!: number;

  constructor(
    private fb: FormBuilder,
    private dmService: DealerMasterService,
    private bikeService: BikeService,
    private dealerService: DealerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editDMForm = this.fb.group({
      dealerId: ['', Validators.required],
      bikeId: ['', Validators.required],
      bikesDelivered: ['', Validators.required],
      deliveryDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get DM id from route
    this.dmId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBikes();
    this.loadDealers();
    this.loadDM();

    // Watch dealerId selection
    this.editDMForm.get('dealerId')?.valueChanges.subscribe(dealerId => {
      this.selectedDealer = this.dealers.find(d => d.dealerId == dealerId) || null;
      this.editDMForm.get('bikesDelivered')?.updateValueAndValidity();
    });

    // Custom validator for bikesDelivered
    this.editDMForm.get('bikesDelivered')?.setValidators([
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
      next: (res) => this.bikes = res,
      error: (err) => console.error('Error fetching bikes:', err)
    });
  }

  loadDealers() {
    this.dealerService.getDealers().subscribe({
      next: (res) => this.dealers = res,
      error: (err) => console.error('Error fetching dealers:', err)
    });
  }

  loadDM() {
    this.dmService.getDMById(this.dmId).subscribe({
      next: (dm) => {
        this.editDMForm.patchValue({
          dealerId: dm.dealerId,
          bikeId: dm.bikeId,
          bikesDelivered: dm.bikesDelivered,
          deliveryDate: dm.deliveryDate
        });
        this.selectedDealer = this.dealers.find(d => d.dealerId == dm.dealerId) || null;
      },
      error: (err) => console.error('Error loading DM:', err)
    });
  }

  onSubmit() {
    if (this.editDMForm.valid) {
      const dm: DealerMasterModel = this.editDMForm.value;
      const payload = {
        dealerMasterId: this.dmId,  // MUST match the id in URL
        dealerId: dm.dealerId,
        bikeId: dm.bikeId,
        bikesDelivered: dm.bikesDelivered,
        deliveryDate: new Date(dm.deliveryDate) // convert string to Date
      };
      // this.dmService.updateDM(dm.dealerMasterId, payload).subscribe({ ... });
      
     
      this.dmService.updateDM(this.dmId, payload).subscribe({
        next: (res) => {
          console.log('DM updated successfully', res);
          this.router.navigate(['/dmTable']);
        },
        error: (err) => {
          console.error('Error updating DM:', err);
          if (err.status === 403) {
            alert('❌ You do not have permission to update this Dealer Master.');
          } else {
            alert('⚠️ Something went wrong while updating Dealer Master.');
          }
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dmTable']);
  }
}
