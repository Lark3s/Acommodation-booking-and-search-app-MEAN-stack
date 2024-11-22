import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any = {};
  editMode: boolean = false;
  user: any = {};
  profileForm!: FormGroup;

  constructor(private userService: UserService, private storageService: StorageService, private formBuilder: FormBuilder, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.userService.getUserById(this.currentUser.id).subscribe(
      data => {
        this.user = data;
        console.log(data);
      },
      err => {
        console.error('Error getting user ', err);
      }
    )

    this.profileForm = this.formBuilder.group({
      firstName: [{ value: this.user?.firstName || '', disabled: true }, Validators.required],
      lastName: [{ value: this.user?.lastName || '', disabled: true }, Validators.required],
      username: [{ value: this.currentUser?.username || '', disabled: true }, Validators.required],
      email: [{ value: this.currentUser?.email || '', disabled: true }, [Validators.required, Validators.email]],
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.profileForm.enable(); // Enable form controls for editing
    } else {
      this.profileForm.disable(); // Disable form controls after editing
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      // Save the updated user data to the backend
      console.log('Saving changes:', this.profileForm.value);
    this.userService.updateUser(this.currentUser).subscribe(
      data => {
        console.log('Profile updated successfully!', data);
        this.toggleEditMode(); // Exit edit mode after saving changes
      },
      err => {
        console.error('Error updating profile', err);
      });
    }
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle successful password change
        console.log('Password changed successfully.');
      } else {
        // Handle unsuccessful attempt
        console.log('Password change failed or was canceled.');
      }
    })
  }
}
