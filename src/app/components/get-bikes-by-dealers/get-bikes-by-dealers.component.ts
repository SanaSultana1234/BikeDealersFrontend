import { Component, OnInit } from '@angular/core';
import { DealerService } from '../../Services/dealer.service';
import { DealerMasterService } from '../../Services/dealer-master.service';
import { BikeService } from '../../Services/bike.service';
import { DealerModel } from '../../models/data/dealer-model';
import { BikeModel } from '../../models/data/bike-model';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-get-bikes-by-dealers',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './get-bikes-by-dealers.component.html',
  styleUrl: './get-bikes-by-dealers.component.css'
})

export class GetBikesByDealersComponent implements OnInit {
  dealers: DealerModel[] = [];
  filteredDealers: DealerModel[] = [];
  selectedDealer: DealerModel | null = null;
  dealerBikes: BikeModel[] = [];
  searchText: string = '';
  showModal: boolean = false;

  constructor(
    private dealerService: DealerService,
    private dealerMasterService: DealerMasterService
  ) {}

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers() {
    this.dealerService.getDealers().subscribe({
      next: (data) => {
        this.dealers = data;
        this.filteredDealers = data;
      },
      error: (err) => {
        console.error('Error fetching dealers:', err);
      }
    });
  }

  searchDealers() {
    if (!this.searchText.trim()) {
      this.filteredDealers = this.dealers;
      return;
    }

    this.dealerService.getDealersByName(this.searchText).subscribe({
      next: (data) => {
        this.filteredDealers = data;
      },
      error: (err) => {
        console.error('Error searching dealers:', err);
      }
    });
  }

  openDealerBikes(dealer: DealerModel) {
    this.selectedDealer = dealer;

    this.dealerMasterService.getBikesByDealer(dealer.dealerName).subscribe({
      next: (bikes) => {
        this.dealerBikes = bikes;
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error fetching bikes by dealer:', err);
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedDealer = null;
    this.dealerBikes = [];
  }
}
