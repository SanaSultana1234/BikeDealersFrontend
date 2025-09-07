
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

  constructor(private bikeService: BikeService) {}
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      processing: true
    };

    this.getAllBikes();
    //new simpleDatatables.DataTable(datatablesSimple);
  }

  getAllBikes(): void {
    this.bikeService.getBikes()
                    .subscribe({
                        next: (bikes) => {
                          console.log("Bikes from API:", bikes); 
                          this.bikes = bikes.map((b: any) => ({ ...b, isEditing: false }));
                          // Re-render DataTable safely
                          if (this.dtElement.dtInstance) {
                            this.dtElement.dtInstance.then((dtInstance: Api) => {
                              //(dtInstance as unknown as DataTables.Api).destroy();
                              dtInstance.destroy();  // destroy old instance
                              this.dtTrigger.next(null); // re-render
                            });
                          } else {
                            this.dtTrigger.next(null);
                          }
                        },
                        error: (err) => {
                          console.error(err);
                        }
                    });
    this.dtTrigger.next(null);
  }

  toggleEdit(bike: any) {
    if (bike.isEditing) {
      // Save mode → call update API
      this.bikeService.updateBike(bike.bikeId, bike).subscribe({
        next: (res) => {
          console.log('Bike updated:', res);
          bike.isEditing = false;
          //this.getAllBikes();
        },
        error: (err) => console.error('Error updating bike:', err)
      });
    } else {
      // Switch to edit mode
      bike.isEditing = true;
    }
  }

  deleteBike(bike: any) {
    const confirmDelete = confirm(
      `Are you sure you want to delete this bike?\n\nId: ${bike.bikeId}\nModel: ${bike.modelName}\nYear: ${bike.modelYear}\nEngine: ${bike.engineCc} CC\nManufacturer: ${bike.manufacturer}`
    );

    if (confirmDelete) {
      this.bikeService.deleteBike(bike.bikeId).subscribe({
        next: () => {
          console.log('Bike deleted:', bike);
          this.bikes = this.bikes.filter(b => b.bikeId !== bike.bikeId);
          //this.getAllBikes()
        },
        error: (err) => console.error('Error deleting bike:', err)
      });
    }
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
