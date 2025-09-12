
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import DataTables from 'datatables.net';
import { BikeModel } from '../../models/data/bike-model';
import { BikeService } from '../../Services/bike.service';
import { RouterLink } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'datatables.net';   // <-- import Api type

@Component({
  selector: 'app-bikes-table',
  standalone: true,
  imports: [DataTablesModule, CommonModule, CurrencyPipe, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './bikes-table.component.html',
  styleUrl: './bikes-table.component.css'
})

export class BikesTableComponent {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  bikes: any[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  selectedBikeIds: number[] = [];
  showBulkAdd: boolean = false;
  selectedFile: File | null = null;

  constructor(private bikeService: BikeService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      processing: true
    };
    this.getAllBikes();
  }

  getAllBikes(): void {
    this.bikeService.getBikes().subscribe({
      next: (bikes) => {
        this.bikes = bikes.map((b: any) => ({ ...b, isEditing: false }));
        if (this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then((dtInstance: Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(null);
          });
        } else {
          this.dtTrigger.next(null);
        }
      },
      error: (err) => console.error(err)
    });
    //this.dtTrigger.next(null);
  }

  // Bulk selection
  toggleSelection(bikeId: number) {
    if (this.selectedBikeIds.includes(bikeId)) {
      this.selectedBikeIds = this.selectedBikeIds.filter(id => id !== bikeId);
    } else {
      this.selectedBikeIds.push(bikeId);
    }
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedBikeIds = this.bikes.map(b => b.bikeId);
    } else {
      this.selectedBikeIds = [];
    }
  }

  bulkDelete() {
    if (confirm(`Are you sure you want to delete ${this.selectedBikeIds.length} bikes?`)) {
      this.bikeService.bulkDeleteBikes(this.selectedBikeIds).subscribe({
        next: (res) => {
          console.log(res);
          this.bikes = this.bikes.filter(b => !this.selectedBikeIds.includes(b.bikeId));
          this.selectedBikeIds = [];
        },
        error: (err) => {
          alert("⚠️ Unable to delete all bikes. Some bikes are linked with deliveries in DealerMaster.")
          console.error('Bulk delete error:', err)
        }
      });
    }
  }

  // Bulk Add (Excel upload)
  toggleBulkAdd() {
    this.showBulkAdd = !this.showBulkAdd;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel() {
    if (this.selectedFile) {
      this.bikeService.bulkAddBikes(this.selectedFile).subscribe({
        next: (res) => {
          alert(`${res.message}, Total: ${res.total}`);
          this.getAllBikes();
          this.selectedFile = null;
          this.showBulkAdd = false;
        },
        error: (err) => {
          console.error('Bulk add error:', err);
          alert('Error uploading file. Please check the Excel format.');
        }
      });
    }
  }

  // Edit/Delete single bike (unchanged)
  toggleEdit(bike: any) { 
    if (bike.isEditing) { // Save mode → call update API 
      this.bikeService.updateBike(bike.bikeId, bike)
      .subscribe({ 
        next: (res) => { 
          console.log('Bike updated:', res); 
          bike.isEditing = false; 
          //this.getAllBikes(); 
        }, error: (err) => {
          console.error('Error updating bike:', err) 
          // 👇 Specific error handling
          if (err.status === 404) {
            alert(`❌ Bike Not Found`);
          } else {
            alert('An unexpected error occurred while deleting the bike.');
          }
        }
      }); } else { 
        // Switch to edit mode 
        bike.isEditing = true; 
      } 
    } 
    deleteBike(bike: any) {
      const confirmDelete = confirm(`Are you sure you want to delete this bike?
      
    Id: ${bike.bikeId}
    Model: ${bike.modelName}
    Year: ${bike.modelYear}
    Engine: ${bike.engineCc} CC
    Manufacturer: ${bike.manufacturer}`);
    
      if (confirmDelete) {
        this.bikeService.deleteBike(bike.bikeId).subscribe({
          next: () => {
            console.log('Bike deleted:', bike);
            this.bikes = this.bikes.filter(b => b.bikeId !== bike.bikeId);
          },
          error: (err) => {
            console.error('Error deleting bike:', err);
    
            // 👇 Specific error handling
            if (err.status === 400 || err.status === 409) {
              alert(`❌ Cannot delete bike "${bike.modelName}" as it is already assigned to a dealer store in Dealer Master.`);
            } else {
              alert('An unexpected error occurred while deleting the bike.');
            }
          }
        });
      }
    }
    


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
