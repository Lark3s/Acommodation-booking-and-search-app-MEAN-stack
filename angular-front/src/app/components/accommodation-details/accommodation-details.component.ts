import { Component, OnInit } from '@angular/core';
import { Accommodation } from '../../models/accommodation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../services/accommodation.service';
import * as L from 'leaflet';
import { StorageService } from '../../services/storage.service';
import { BookingService } from '../../services/booking.service';
import { environment } from '../../../environment/environment';
import { NguCarouselConfig } from '@ngu/carousel';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-accommodation-details',
  templateUrl: './accommodation-details.component.html',
  styleUrl: './accommodation-details.component.css'
})
export class AccommodationDetailsComponent implements OnInit {
  accommodation: Accommodation | undefined;
  isLoggedIn = false;
  isOwner: boolean = false;
  currentImageIndex: number = 0;
  reviews: Review[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 1;
  

  constructor(
    private route: ActivatedRoute,
    private accommodationService: AccommodationService,
    private storageService: StorageService,
    private bookingService: BookingService,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.getAccommodationDetails();
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.checkUserOwnership();
  }
  
  getAccommodationDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accommodationService.getById(id).subscribe(
        (data: Accommodation) => {
          console.log('Accommodation data:', data); // Confirm data is received
          this.accommodation = data;
           // Check if images are defined and then modify the URLs
           if (this.accommodation.images && this.accommodation.images.length > 0) {
            this.accommodation.images = this.accommodation.images.map(image => `${environment.apiUrl}${image}`);
          }
      
          this.initializeMap(); // Initialize the map here after data is set
          this.getReviews(this.accommodation.id!);
        },
        (error) => {
          console.error('Error fetching accommodation details:', error);
        }
      );
    }
  }

  checkUserOwnership(): void {
    const currentUser = this.storageService.getUser();
    if (currentUser && this.accommodation) {
      this.isOwner = currentUser.id === this.accommodation.owner; 
    }
  }
  
  initializeMap() {
    if (
      this.accommodation &&
      typeof this.accommodation.latitude === 'number' &&
      typeof this.accommodation.longitude === 'number' &&
      !isNaN(this.accommodation.latitude) &&
      !isNaN(this.accommodation.longitude)
    ) {
      const map = L.map('map', { attributionControl: false }).setView([this.accommodation.latitude, this.accommodation.longitude], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
  
      L.marker([this.accommodation.latitude, this.accommodation.longitude]).addTo(map)
        .bindPopup('Accommodation Location')
        .openPopup();
    } else {
      console.error('Latitude or Longitude is undefined, invalid, or not a number.');
    }
  }

  redirectToLogin(): void {
    window.location.href = '/login'; 
  }

  bookAccommodation(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/booking', this.accommodation!.id]);
    } else {
      this.redirectToLogin();
    }
  }

  nextImage() {
    if (this.accommodation!.images && this.accommodation!.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.accommodation!.images.length;
    }
  }

  prevImage() {
    if (this.accommodation!.images && this.accommodation!.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.accommodation!.images.length) % this.accommodation!.images.length;
    }
  }

  getReviews(accommodationId: string): void {
    this.reviewService.getReviewsByAccommodationId(accommodationId, this.currentPage).subscribe(
      (data) => {
        this.reviews = data.reviews;
        console.log(this.reviews);
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.totalItems = data.totalItems;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

}
