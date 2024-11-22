import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { StorageService } from '../../services/storage.service';
import { LeaveReviewComponent } from '../leave-review/leave-review.component';
import { MatDialog } from '@angular/material/dialog';
import { AccommodationService } from '../../services/accommodation.service';
import { environment } from '../../../environment/environment';
import { UserEditAccommodationComponent } from '../user-edit-accommodation/user-edit-accommodation.component';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrl: './board-user.component.css'
})

export class BoardUserComponent implements OnInit {
  bookings: any[] = [];
  upcomingBookings: any[] = [];
  ongoingBookings: any[] = [];
  pastBookings: any[] = [];
  cancelledBookings: any[] = [];
  userAccommodations: any[] = [];
  // currentImageIndex: number = 0;

  constructor(
    private bookingService: BookingService,
    private storageService: StorageService, 
    private dialog: MatDialog,
    private accommodationService: AccommodationService 
  ) {}

  ngOnInit(): void {
    this.loadUserBookings();
    this.loadUserAccommodations();
    
  }

  loadUserBookings(): void {
    const currentUser = this.storageService.getUser();
    if (currentUser) {
      this.bookingService.getBookingsByUser(currentUser.id).subscribe(bookings => {
        this.bookings = bookings;
        console.log(bookings);
        this.categorizeBookings();
      });
    }
  }

  categorizeBookings(): void {
    const now = new Date();
    this.cancelledBookings = this.bookings.filter(booking => booking.cancelled === 1);
    this.upcomingBookings = this.bookings.filter(booking => new Date(booking.checkInDate) > now && booking.cancelled === 0);
    this.ongoingBookings = this.bookings.filter(booking => new Date(booking.checkInDate) <= now && new Date(booking.checkOutDate) >= now && booking.cancelled === 0);
    this.pastBookings = this.bookings.filter(booking => new Date(booking.checkOutDate) < now && booking.cancelled === 0);
  }

  cancelBooking(bookingId: string): void {
    if (confirm("Are you sure you want to cancel this booking?")) {
      this.bookingService.cancelUserBooking(bookingId).subscribe(   
        response => {                                           
          alert("Booking cancelled successfully.");             
          // Remove the cancelled booking from the upcomingBookings array
          this.upcomingBookings = this.upcomingBookings.filter(booking => booking.id !== bookingId);
          // Add booking to cancelled bookings
          const cancelledBooking = this.bookings.find(booking => booking.id === bookingId);
          if (cancelledBooking) {
            cancelledBooking.cancelled = 1;
            this.cancelledBookings.push(cancelledBooking);
          }
        },
        error => {
          console.error("Error cancelling booking:", error);
          alert("There was an error cancelling the booking. Please try again.");
        }
      );
    }
  }

  loadUserAccommodations(): void {
    const currentUser = this.storageService.getUser();
    if (currentUser) {
      this.accommodationService.getAccommodationsByUser(currentUser.id).subscribe(accommodations => {
        this.userAccommodations = accommodations;
        this.userAccommodations.forEach(accommodation => {
          if (accommodation.images && accommodation.images.length > 0) {
            accommodation.images = accommodation.images.map((image: any) => `${environment.apiUrl}${image}`);
          }
        });
        this.userAccommodations.forEach((accommodation, index) => {
          accommodation.currentImageIndex = 0;
        });
        console.log('accommodtaions: ',accommodations);
      });
    }
  }

  leaveReview(bookingId: string): void {
    const dialogRef = this.dialog.open(LeaveReviewComponent, {
      width: '500px',
      data: { bookingId: bookingId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle successful password change
        console.log('Review left successfully.');
      } else {
        // Handle unsuccessful attempt
        console.log('Review submission failed or was canceled.');
      }
      window.location.reload();
    });
  }

  cancelOwnerBooking(bookingId: string): void {
    this.bookingService.cancelOwnerBooking(bookingId).subscribe(
      () => {
        this.loadUserAccommodations(); // Refresh accommodations and bookings data
      },
      err => {
        console.error(err);
      }
    );
  }

  editAccommodation(accommodation: any): void {
    const dialogRef = this.dialog.open(UserEditAccommodationComponent, {
      width: '400px',
      data: accommodation
    });
  }

  nextImage(accommodation: any): void {
    if (accommodation.images && accommodation.images.length > 0) {
      accommodation.currentImageIndex = (accommodation.currentImageIndex + 1) % accommodation.images.length;
    }
  }
  
  prevImage(accommodation: any): void {
    if (accommodation.images && accommodation.images.length > 0) {
      accommodation.currentImageIndex = (accommodation.currentImageIndex - 1 + accommodation.images.length) % accommodation.images.length;
    }
  }
}

