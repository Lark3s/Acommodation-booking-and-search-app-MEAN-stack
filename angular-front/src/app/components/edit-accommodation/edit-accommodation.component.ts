import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Accommodation } from '../../models/accommodation.model';
import { AccommodationService } from '../../services/accommodation.service';

@Component({
  selector: 'app-edit-accommodation',
  templateUrl: './edit-accommodation.component.html',
  styleUrl: './edit-accommodation.component.css'
})
export class EditAccommodationComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAccommodationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Accommodation,
    private accommodationService: AccommodationService
  ) {
    this.editForm = this.fb.group({
      location: [data.location, Validators.required],
      price: [data.pricePerNight, [Validators.required, Validators.min(0)]],
      longitude: [data.longitude, Validators.required],
      latitude: [data.latitude, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedAccommodation = { ...this.data, ...this.editForm.value };
      this.accommodationService.update(this.data.id!, updatedAccommodation).subscribe(
        response => {
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error updating accommodation:', error);
        }
      );
    }
  }
}
