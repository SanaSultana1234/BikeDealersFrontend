import { Component, OnInit } from '@angular/core';
import { BikeService } from '../../Services/bike.service';
import { DealerMasterService } from '../../Services/dealer-master.service';
import { BikeModel } from '../../models/data/bike-model';
import { DealerModel } from '../../models/data/dealer-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-get-dealers-by-bikes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './get-dealers-by-bikes.component.html',
  styleUrl: './get-dealers-by-bikes.component.css'
})

export class GetDealersByBikesComponent implements OnInit {
  bikes: BikeModel[] = [];
  filteredBikes: BikeModel[] = [];
  selectedBike: BikeModel | null = null;
  bikeDealers: DealerModel[] = [];
  searchText: string = '';
  showModal: boolean = false;

  constructor(
    private bikeService: BikeService,
    private dealerMasterService: DealerMasterService
  ) {}

  ngOnInit(): void {
    this.loadBikes();
  }

  loadBikes() {
    this.bikeService.getBikes().subscribe({
      next: (data) => {
        this.bikes = data;
        this.filteredBikes = data;
      },
      error: (err) => console.error('Error fetching bikes:', err)
    });
  }

  searchBikes() {
    if (!this.searchText.trim()) {
      this.filteredBikes = this.bikes;
      return;
    }

    this.bikeService.getBikesByName(this.searchText).subscribe({
      next: (data) => this.filteredBikes = data,
      error: (err) => console.error('Error searching bikes:', err)
    });
  }

  openBikeDealers(bike: BikeModel) {
    this.selectedBike = bike;

    this.dealerMasterService.getDealersByBike(bike.modelName).subscribe({
      next: (dealers) => {
        this.bikeDealers = dealers;
        this.showModal = true;
      },
      error: (err) => console.error('Error fetching dealers for bike:', err)
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedBike = null;
    this.bikeDealers = [];
  }
}

