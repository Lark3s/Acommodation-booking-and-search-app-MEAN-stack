import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { AccommodationService } from '../../services/accommodation.service';

@Component({
  selector: 'app-add-accommodation',
  templateUrl: './add-accommodation.component.html',
  styleUrl: './add-accommodation.component.css'
})
export class AddAccommodationComponent implements OnInit {
  accommodationForm!: FormGroup;
  selectedFiles: File[] = [];
  selectedFileNames: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private accommodationService: AccommodationService,
    private router: Router,
    private storageService: StorageService
  ){}
  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }

    this.accommodationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      pricePerNight: ['', [Validators.required, Validators.min(0)]],
      amenities: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      availability: this.formBuilder.array([this.createAvailabilityGroup()]),
      images: [null]
    });
  }

  createAvailabilityGroup(): FormGroup {
    return this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  get availability(): FormArray {
    return this.accommodationForm.get('availability') as FormArray;
  }

  addAvailability(): void {
    this.availability.push(this.createAvailabilityGroup());
  }

  removeAvailability(index: number): void {
    this.availability.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileNames = Array.from(input.files).map(file => file.name).join(', ');
    } else {
      this.selectedFileNames = '';
    }
  }

  onSubmit(): void {
    if (this.accommodationForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.accommodationForm.get('name')?.value);
    formData.append('description', this.accommodationForm.get('description')?.value);
    formData.append('location', this.accommodationForm.get('location')?.value);
    formData.append('pricePerNight', this.accommodationForm.get('pricePerNight')?.value);
    formData.append('amenities', this.accommodationForm.get('amenities')?.value);
    formData.append('latitude', this.accommodationForm.get('latitude')?.value);
    formData.append('longitude', this.accommodationForm.get('longitude')?.value);

    // Add the availability array
    formData.append('availability', JSON.stringify(this.availability.value));
    console.log('availability', JSON.stringify(this.availability.value))

    // Add the owner field
    const user = this.storageService.getUser();
    formData.append('username', user.username);
    console.log(user)

    this.selectedFiles.forEach(file => {
      formData.append('images', file, file.name);
    });

    this.accommodationService.create(formData).subscribe(
      response => {
        this.router.navigate(['/accommodations']);
      },
      error => {
        console.error('Error creating accommodation:', error);
      }
    );
  }
}
