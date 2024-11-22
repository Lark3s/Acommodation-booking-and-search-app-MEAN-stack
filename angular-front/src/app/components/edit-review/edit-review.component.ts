import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.css'
})
export class EditReviewComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Review,
    private reviewService: ReviewService
  ) {
    this.editForm = this.fb.group({
      rating: [data.rating, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [data.comment]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedReview = { ...this.data, ...this.editForm.value };
      this.reviewService.updateReview(this.data.id!, updatedReview).subscribe(
        response => {
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error updating review:', error);
        }
      );
    }
  }
}
