import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BoardAdminComponent } from './components/board-admin/board-admin.component';
import { BoardUserComponent } from './components/board-user/board-user.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AddAccommodationComponent } from './components/add-accommodation/add-accommodation.component';
import { AccommodationListComponent } from './components/accommodation-list/accommodation-list.component';
import { AccommodationDetailsComponent } from './components/accommodation-details/accommodation-details.component';
import { BookingComponent } from './components/booking/booking.component';
import { ConfirmationPageComponent } from './components/confirmation-page/confirmation-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LeaveReviewComponent } from './components/leave-review/leave-review.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { NotFoundComponent } from './components/not-found/not-found.component'
import { MatRadioModule } from '@angular/material/radio';
import { EditAccommodationComponent } from './components/edit-accommodation/edit-accommodation.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { EditReviewComponent } from './components/edit-review/edit-review.component';
import { EditBookingComponent } from './components/edit-booking/edit-booking.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { DeleteAdminConfirmationDialogComponent } from './components/delete-admin-confirmation-dialog/delete-admin-confirmation-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { UserBoardBookingsComponent } from './components/user-board-bookings/user-board-bookings.component';
import { UserBoardAccommodationsComponent } from './components/user-board-accommodations/user-board-accommodations.component';
import { UserEditAccommodationComponent } from './components/user-edit-accommodation/user-edit-accommodation.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider'
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';

import { HttpRequestInterceptor } from './helpers/http.interceptor'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardUserComponent,
    AddAccommodationComponent,
    AccommodationListComponent,
    AccommodationDetailsComponent,
    BookingComponent,
    ConfirmationPageComponent,
    ChangePasswordDialogComponent,
    LeaveReviewComponent,
    ForbiddenComponent,
    NotFoundComponent,
    EditAccommodationComponent,
    EditUserComponent,
    EditReviewComponent,
    EditBookingComponent,
    DeleteAdminConfirmationDialogComponent,
    UserBoardBookingsComponent,
    UserBoardAccommodationsComponent,
    UserEditAccommodationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatDatepickerModule,
    MatTabsModule,
    MatDividerModule,
    MatSortModule,
    MatNativeDateModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
