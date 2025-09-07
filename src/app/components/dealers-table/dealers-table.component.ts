import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { DealerModel } from '../../models/data/dealer-model';
import { Subject } from 'rxjs';
import { DealerService } from '../../Services/dealer.service';
import { FormsModule } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'datatables.net';

@Component({
  selector: 'app-dealers-table',
  standalone: true,
  imports: [DataTablesModule, CommonModule, FormsModule],
  templateUrl: './dealers-table.component.html',
  styleUrl: './dealers-table.component.css'
})
export class DealersTableComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dealers: any[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private dealerService: DealerService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      processing: true
    };

    this.getAllDealers();
  }

  getAllDealers(): void {
    this.dealerService.getDealers().subscribe({
      next: (dealers) => {
        // Add isEditing flag to each dealer
        this.dealers = dealers.map((d: any) => ({ ...d, isEditing: false }));

        if (this.dtElement?.dtInstance) {
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
    this.dtTrigger.next(null);
  }

  toggleEdit(dealer: any) {
    if (dealer.isEditing) {
      // Save changes
      this.dealerService.updateDealer(dealer.dealerId, dealer).subscribe({
        next: (res) => {
          console.log('Dealer updated:', res);
          dealer.isEditing = false;
        },
        error: (err) => console.error('Error updating dealer:', err)
      });
    } else {
      dealer.isEditing = true;
    }
  }

  deleteDealer(dealer: any) {
    const confirmDelete = confirm(
      `Are you sure you want to delete this dealer?\n\nId: ${dealer.dealerId}\nName: ${dealer.dealerName}\nCity: ${dealer.city}\nState: ${dealer.state}`
    );

    if (confirmDelete) {
      this.dealerService.deleteDealer(dealer.dealerId).subscribe({
        next: () => {
          console.log('Dealer deleted:', dealer);
          this.dealers = this.dealers.filter((d) => d.dealerId !== dealer.dealerId);
        },
        error: (err) => console.error('Error deleting dealer:', err)
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
