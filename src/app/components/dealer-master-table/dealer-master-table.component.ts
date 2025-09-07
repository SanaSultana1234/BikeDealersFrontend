import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { DealerMasterModel } from '../../models/data/dealer-master-model';
import { Subject } from 'rxjs';
import { DealerMasterService } from '../../Services/dealer-master.service';
import { FormsModule } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'datatables.net';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dealer-master-table',
  standalone: true,
  imports: [DataTablesModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './dealer-master-table.component.html',
  styleUrl: './dealer-master-table.component.css'
})
export class DealerMasterTableComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  DMs: any[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private dmService: DealerMasterService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      processing: true
    };

    this.getAllDMs();
  }

  getAllDMs(): void {
    this.dmService.getDMs()
                      .subscribe({
                        next: (DMs) => {
                          this.DMs = DMs.map((d: any) => ({ ...d, isEditing: false }));
                          
                          if (this.dtElement?.dtInstance) {
                            this.dtElement.dtInstance.then((dtInstance: Api) => {
                              dtInstance.destroy();
                              this.dtTrigger.next(null);
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

  onEdit(dm: any): void {
    dm.isEditing = true;
  }

  onSave(dm: any): void {
    this.dmService.updateDM(dm.dealerMasterId, dm)
      .subscribe({
        next: (res) => {
          console.log('Dealer updated:', res);
          dm.isEditing = false;
        },
        error: (err) => {
          console.error('Error updating DM:', err);
        }
      });
  }

  onDelete(dm: any): void {
    if (confirm(`Are you sure you want to delete DM ${dm.dealerMasterId} (Dealer: ${dm.dealerId}, Bike: ${dm.bikeId})?`)) {
      this.dmService.deleteDM(dm.dealerMasterId)
        .subscribe({
          next: () => {
            this.DMs = this.DMs.filter(x => x.dealerMasterId !== dm.dealerMasterId);
          },
          error: (err) => {
            console.error('Error deleting DM:', err);
          }
        });
    }
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
