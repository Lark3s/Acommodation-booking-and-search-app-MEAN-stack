import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-admin-confirmation-dialog',
  templateUrl: './delete-admin-confirmation-dialog.component.html',
  styleUrl: './delete-admin-confirmation-dialog.component.css'
})
export class DeleteAdminConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteAdminConfirmationDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Return true when confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // Return false when canceled
  }
}
