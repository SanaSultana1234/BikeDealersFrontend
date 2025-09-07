import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import DataTables from 'datatables.net';
import { CommonModule, CurrencyPipe } from '@angular/common';


export interface Employee {
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: number;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DataTablesModule, CommonModule, CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      processing: true
    };

    this.getData();
    //new simpleDatatables.DataTable(datatablesSimple);
  }

  getData(): void {
    this.employees = [
      { name: "Sana", position: "CEO", office: "Google", age: 22, startDate: "14/07/2027", salary: 20000 },
      { name: "Alex", position: "Developer", office: "London", age: 30, startDate: "12/02/2023", salary: 15000 },
      { name: "Maya", position: "Manager", office: "New York", age: 28, startDate: "10/05/2021", salary: 18000 },
      { name: "Ravi", position: "Intern", office: "Delhi", age: 21, startDate: "01/01/2024", salary: 5000 },
      { name: "John", position: "CTO", office: "San Francisco", age: 40, startDate: "05/11/2020", salary: 30000 }
    ];

    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
