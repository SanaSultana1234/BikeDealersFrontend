import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import DataTables from 'datatables.net';
import { UserModel } from '../../models/data/user-model';
import { AdminService } from '../../Services/admin.service';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'datatables.net';   // <-- import Api type


@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [DataTablesModule, CommonModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})




export class UsersTableComponent {
  users: UserModel[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  constructor(private adminService: AdminService) {
    //this.getUsers();
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      processing: true
    };

    this.getUsers();
    //new simpleDatatables.DataTable(datatablesSimple);
  }

  getUsers(): void {
    this.adminService.getAllUsers()
                    .subscribe({
                        next: (users) => {
                          this.users = users;

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

  toggleDealer(user: UserModel): void {
    if (!user.isDealerVerified) {
      this.adminService.approveDealer(user.id).subscribe({
        next: () => {
          user.isDealerVerified = true; // toggle locally
          //this.getUsers();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.adminService.removeRole(user.id, "Dealer").subscribe({
        next: () => {
          user.isDealerVerified = false;
          //this.getUsers();
        },
        error: (err) => console.log(err)
      });
    }
  }
  
  toggleManufacturer(user: UserModel): void {
    if (!user.isManufacturerVerified) {
      this.adminService.approveManufacturer(user.id).subscribe({
        next: () => {
          user.isManufacturerVerified = true;
          //this.getUsers();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.adminService.removeRole(user.id, "Manufacturer").subscribe({
        next: () => {
          user.isManufacturerVerified = false;
          //this.getUsers();
        },
        error: (err) => console.error(err)
      });
    }
  }
  
  toggleAdmin(user: UserModel): void {
    if (!user.roles.includes('Admin')) {
      this.adminService.assignAdmin(user.id).subscribe({
        next: () => {
          user.roles.push('Admin');
          //this.getUsers();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.adminService.removeRole(user.id, "Admin").subscribe({
        next: () => {
          user.roles = user.roles.filter(r => r !== 'Admin');
          //this.getUsers();
        },
        error: (err) => console.error(err)
      });
    }
  }
  
  deleteUser(user: UserModel): void {
    this.adminService.deleteUser(user.id).subscribe({
      next: (response) => {
        console.log(response);
        //this.getUsers();
        this.users = this.users.filter(u => u.id !== user.id);
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
