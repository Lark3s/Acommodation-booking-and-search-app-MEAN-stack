import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { AccommodationService } from '../../services/accommodation.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrl: './leave-review.component.css'
})
export class LeaveReviewComponent implements OnInit {
  reviewForm: FormGroup | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    public dialogRef: MatDialogRef<LeaveReviewComponent>,
    private bookingService: BookingService,
    private accommodationService: AccommodationService,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: string }
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      rating: [null, Validators.required],
      comment: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reviewForm!.valid) {
      // Get the user ID from storage service
      const user = this.storageService.getUser();
      const username = user?.username;

      // Get the booking by ID to extract the accommodation ID
      this.bookingService.getBookingById(this.data.bookingId).subscribe({
        next: (booking) => {
          const accommodationId = booking.accommodation._id;
          console.log('booking',booking);

          // Prepare the review data
          const review = {
            username: username,
            accommodationId: accommodationId,
            rating: this.reviewForm!.value.rating,
            comment: this.reviewForm!.value.comment,
            bookingId: this.data.bookingId
          };
          console.log(review);

          // Submit the review
          this.reviewService.createReview(review).subscribe({
            next: (response) => {
              console.log('Review created successfully', response);
              this.dialogRef.close(true);  // Close dialog and return success
            },
            error: (error) => {
              console.error('Error creating review', error);
            }
          });
        },
        error: (error) => {
          console.error('Error fetching booking', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
    // window.location.reload();
  }
}
