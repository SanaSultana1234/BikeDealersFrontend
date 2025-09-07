
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DealerMasterService } from '../../Services/dealer-master.service';
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

  constructor(
    private fb: FormBuilder,
    private dmService: DealerMasterService,
    private router: Router
  ) {
    this.addDMForm = this.fb.group({
      dealerId: ['', Validators.required],
      bikeId: ['', Validators.required],
      bikesDelivered: ['', Validators.required],
      deliveryDate: ['', Validators.required]
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
