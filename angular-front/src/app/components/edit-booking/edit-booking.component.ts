import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrl: './edit-booking.component.css'
})
export class EditBookingComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService
  ) {
    this.editForm = this.fb.group({
      user: [data.userId, Validators.required],
      accommodation: [data.accommodationId, Validators.required],
      totalPrice: [data.totalPrice, [Validators.required, Validators.min(0)]],
      checkInDate: [data.checkInDate, Validators.required],
      checkOutDate: [data.checkOutDate, Validators.required],
      cancelled: [data.cancelled, Validators.required]
    });
    console.log('data:',data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedBooking = { ...this.editForm.value };
      console.log(updatedBooking);
      this.bookingService.updateBooking(this.data.id!, updatedBooking).subscribe(
        response => {
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error updating booking:', error);
        }
      );
    }
  }
}
