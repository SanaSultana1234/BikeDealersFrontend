import { Routes } from '@angular/router';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { LoginComponent } from './auth/login/login.component';
import { TestComponent } from './test/test.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TableComponent } from './components/table/table.component';
import { BikesTableComponent } from './components/bikes-table/bikes-table.component';
import { DealersTableComponent } from './components/dealers-table/dealers-table.component';
import { DealerMasterTableComponent } from './components/dealer-master-table/dealer-master-table.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { RegisterDealerComponent } from './auth/register-dealer/register-dealer.component';
import { RegisterManufacturerComponent } from './auth/register-manufacturer/register-manufacturer.component';
import { AddBikeComponent } from './components/add-bike/add-bike.component';
import { AddDMComponent } from './components/add-dm/add-dm.component';

export const routes: Routes = [
    {path: "registerUser", component: RegisterUserComponent},
    {path: "registerDealer", component: RegisterDealerComponent},
    {path: "registerManufacturer", component: RegisterManufacturerComponent},
    {path: "login", component: LoginComponent},
    {path: "dashboard", component: DashboardComponent},
    {path: "table", component: TableComponent},
    {path: "usersTable", component: UsersTableComponent},
    {path: "bikesTable", component: BikesTableComponent},
    {path: "dealersTable", component: DealersTableComponent},
    {path: "dmTable", component: DealerMasterTableComponent},
    {path: "addBike", component: AddBikeComponent},
    {path: "addDM", component: AddDMComponent},
    {path: "test", component: TestComponent, canActivate: [authGuard], data: {roles: ['Admin']}},
    {path: "error", component: DashboardComponent}
];


