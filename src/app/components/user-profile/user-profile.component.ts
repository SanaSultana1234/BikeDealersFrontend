
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../models/data/user-model';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: UserModel | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    if (!token) {
      return; // Not logged in
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Payload from user profile: ", payload);
    const userId = payload?.id; // depends on your JWT claims

    this.adminService.getUserById(userId).subscribe({
      next: (data: UserModel) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
      }
    });
  }
}
