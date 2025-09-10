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
import { RegisterComponent } from './auth/register/register.component';
import { DealerProfileComponent } from './components/dealer-profile/dealer-profile.component';
import { HomeComponent } from './components/home/home.component';
import { UnauthorizedComponentComponent } from './auth/unauthorized-component/unauthorized-component.component';
import { GetBikesByDealersComponent } from './components/get-bikes-by-dealers/get-bikes-by-dealers.component';
import { GetDealersByBikesComponent } from './components/get-dealers-by-bikes/get-dealers-by-bikes.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EditDMComponent } from './components/edit-dm/edit-dm.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },  // default redirect
    { 
        path: "userProfile", 
        component: UserProfileComponent, 
        canActivate: [authGuard], 
        data: { roles: ['User', 'Manufacturer', 'Admin'] } 
      },
      
    {path: "dashboard", component: DashboardComponent, canActivate: [authGuard], data: {roles: ['Admin']}},
    {path: "home", component: HomeComponent},
    {path: "getBikesByDealer", component: GetBikesByDealersComponent},
    {path: "getDealersByBike", component: GetDealersByBikesComponent},
    
    {path: "register", component: RegisterComponent},
    {path: "registerUser", component: RegisterUserComponent},
    {path: "registerDealer", component: RegisterDealerComponent},
    {path: "registerManufacturer", component: RegisterManufacturerComponent},
    {path: "login", component: LoginComponent},
 
    {path: "table", component: TableComponent},
    {path: "usersTable", component: UsersTableComponent, canActivate: [authGuard], data: {roles: ['Admin']}},
    {path: "bikesTable", component: BikesTableComponent, canActivate: [authGuard], data: {roles: ['Admin', 'Manufacturer']}},
    {path: "dealersTable", component: DealersTableComponent, canActivate: [authGuard], data: {roles: ['Admin', 'Dealer']}},
    {path: "dmTable", component: DealerMasterTableComponent, canActivate: [authGuard], data: {roles: ['Admin', 'Manufacturer']}},
    {path: "addBike", component: AddBikeComponent, canActivate: [authGuard], data: {roles: ['Admin', 'Manufacturer']}},
    {path: "addDM", component: AddDMComponent, canActivate: [authGuard], data: {roles: ['Admin', 'Manufacturer']}},
    { path: 'editDM/:id', component: EditDMComponent },
    {path: "dealerProfile", component: DealerProfileComponent, canActivate: [authGuard], data: {roles: ['Dealer']}},
    {path: "test", component: TestComponent, canActivate: [authGuard], data: {roles: ['Admin']}},
    {path: "unauthorized", component: UnauthorizedComponentComponent},
    { path: '**', component: NotFoundComponent }
   
];


