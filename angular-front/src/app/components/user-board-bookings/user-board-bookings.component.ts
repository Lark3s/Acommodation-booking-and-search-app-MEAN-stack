import { Component, OnInit } from '@angular/core';
import { LeaveReviewComponent } from '../leave-review/leave-review.component';
import { BookingService } from '../../services/booking.service';
import { StorageService } from '../../services/storage.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-board-bookings',
  templateUrl: './user-board-bookings.component.html',
  styleUrl: './user-board-bookings.component.css'
})
export class UserBoardBookingsComponent implements OnInit {
  bookings: any[] = [];
  upcomingBookings: any[] = [];
  ongoingBookings: any[] = [];
  pastBookings: any[] = [];
  cancelledBookings: any[] = [];

  constructor(
    private bookingService: BookingService,
    private storageService: StorageService, 
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    this.loadUserBookings();
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

}
