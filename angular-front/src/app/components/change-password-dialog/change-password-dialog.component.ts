import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.css'
})
export class ChangePasswordDialogComponent {
  changePasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      this.userService.changePassword(currentPassword, newPassword).subscribe(
        response => {
          this.snackBar.open('Password changed successfully!', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBar.open('Failed to change password. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close dialog without saving
  }
}
