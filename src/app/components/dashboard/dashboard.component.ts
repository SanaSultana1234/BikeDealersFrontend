import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Import your services
import { BikeService } from '../../Services/bike.service';
import { DealerService } from '../../Services/dealer.service';
import { AdminService } from '../../Services/admin.service';
import { DealerMasterService } from '../../Services/dealer-master.service'; // <-- add this service

// Import your models if available
import { BikeModel } from '../../models/data/bike-model';
import { DealerModel } from '../../models/data/dealer-model';
import { UserModel } from '../../models/data/user-model';
import { DealerMasterModel } from '../../models/data/dealer-master-model'; // <-- add model if exists
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Card data with initial values
  cardData = [
    {
      title: 'Manage Dealers',
      value: 0,
      description: 'Total dealerships in system',
      icon: 'fas fa-store',
      route: '/dealersTable',
      color: 'dealers',
      loading: true
    },
    {
      title: 'Manage Users',
      value: 0,
      description: 'Total system users',
      icon: 'fas fa-users',
      route: '/usersTable',
      color: 'users',
      loading: true
    },
    {
      title: 'Manage Bikes',
      value: 0,
      description: 'Total bikes in inventory',
      icon: 'fas fa-motorcycle',
      route: '/bikesTable',
      color: 'bikes',
      loading: true
    },
    {
      title: 'Manage Deliveries',
      value: 0,
      description: 'Total deliveries to dealers',
      icon: 'fas fa-truck-loading',
      route: '/dealerMasterTable',
      color: 'deliveries',
      loading: true
    }
  ];

  // Variables to store counts
  dealersCount: number = 0;
  usersCount: number = 0;
  bikesCount: number = 0;
  deliveriesCount: number = 0;

  isLoading: boolean = true;
  adminName: string | null = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private bikeService: BikeService,
    private dealerService: DealerService,
    private adminService: AdminService,
    private dealerMasterService: DealerMasterService 
  ) { }

  ngOnInit(): void {
    this.loadCounts();
    this.getUserName();
  }

  getUserName() {
    this.adminName = this.authService.getUserName();
  }

  // Method to load all counts
  loadCounts(): void {
    this.bikeService.getBikeCount().subscribe(res => this.bikesCount = res);
    this.dealerService.getDealerCount().subscribe(res => this.dealersCount = res);
    this.dealerMasterService.getDealerMasterCount().subscribe(res => this.deliveriesCount = res);
    this.adminService.getUserCount().subscribe(res => this.usersCount = res);
  }

  // Helper method to update card values
  updateCardValue(title: string, value: number): void {
    const cardIndex = this.cardData.findIndex(card => card.title === title);
    if (cardIndex !== -1) {
      this.cardData[cardIndex].value = value;
      this.cardData[cardIndex].loading = false;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
