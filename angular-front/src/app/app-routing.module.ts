import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BoardUserComponent } from './components/board-user/board-user.component';
import { BoardAdminComponent } from './components/board-admin/board-admin.component';
import { AccommodationListComponent } from './components/accommodation-list/accommodation-list.component';
import { AccommodationDetailsComponent } from './components/accommodation-details/accommodation-details.component';
import { BookingComponent } from './components/booking/booking.component';
import { ConfirmationPageComponent } from './components/confirmation-page/confirmation-page.component';
import { AddAccommodationComponent } from './components/add-accommodation/add-accommodation.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
  { path: 'accommodations', component: AccommodationListComponent },
  { path: 'add-accommodation', component: AddAccommodationComponent },
  { path: 'accommodations/:id', component: AccommodationDetailsComponent },
  { path: 'booking/:id', component: BookingComponent },
  { path: 'confirmation/:id', component: ConfirmationPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '403', component: ForbiddenComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }  // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
