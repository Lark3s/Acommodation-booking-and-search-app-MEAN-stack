import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AccommodationService } from '../../services/accommodation.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  accommodation: any;
  startDate: Date | undefined;
  endDate: Date | undefined;
  totalPrice: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private accommodationService: AccommodationService,
    private bookingService: BookingService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.accommodationService.getById(id).subscribe(data => {
      this.accommodation = data;
      console.log('data: ', data);
      console.log('accommodation: ', data);
    });
  } else {
    console.error('No ID provided in route');
  }
  }

  calculateTotalPrice() {
    console.log(this.accommodation.pricePerNight)
    if (this.startDate && this.endDate && this.accommodation?.pricePerNight) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const timeDiff = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.totalPrice = diffDays * this.accommodation.pricePerNight;
      console.log(this.totalPrice);
    } else {
      this.totalPrice = undefined;
      console.log('Total Price Calculation Failed:', this.startDate, this.endDate, this.accommodation?.pricePerNight);  // Debugging line
    }
  }
  
  // Call this method whenever the start or end date changes
  onDateChange() {
    this.calculateTotalPrice();
  }

  confirmBooking(): void {
    const currentUser = this.storageService.getUser();
    if (!this.startDate || !this.endDate) {
        alert('Please select both a start date and an end date.');
        return;
    }

    // Log the selected start and end dates
    console.log('start date: ', this.startDate);
    console.log('end date: ', this.endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today to the start of the day

    const userStartDate = new Date(this.startDate);
    const userEndDate = new Date(this.endDate);

    // Set user start and end dates to the start of the day
    userStartDate.setHours(0, 0, 0, 0);
    userEndDate.setHours(0, 0, 0, 0);

    if (userStartDate < today || userEndDate < today) {
        alert('The booking dates cannot be in the past.');
        return;
    }

    if (userStartDate >= userEndDate) {
        alert('The start date must be before the end date.');
        return;
    }

    const isWithinAvailability = this.accommodation.availability.some((range: { startDate: string, endDate: string }) => {
        const rangeStartDate = new Date(range.startDate);
        const rangeEndDate = new Date(range.endDate);

        // Set range start and end dates to the start of the day
        rangeStartDate.setHours(0, 0, 0, 0);
        rangeEndDate.setHours(0, 0, 0, 0);

        console.log('Checking range:', rangeStartDate, 'to', rangeEndDate);

        const startInRange = userStartDate >= rangeStartDate && userStartDate <= rangeEndDate;
        const endInRange = userEndDate >= rangeStartDate && userEndDate <= rangeEndDate;
        const startBeforeRange = userStartDate <= rangeStartDate && userEndDate >= rangeStartDate;

        return (startInRange || startBeforeRange) && endInRange;
    });

    if (!isWithinAvailability) {
        alert('The selected dates are not available for this accommodation.');
        return;
    }

    const bookingDetails = {
      username: currentUser.username,
      accommodationId: this.accommodation.id,
      checkInDate: this.startDate,
      checkOutDate: this.endDate,
      totalPrice: this.totalPrice
    };
    console.log(currentUser.username);

    this.bookingService.createBooking(bookingDetails).subscribe(response => {
        this.router.navigate(['/confirmation', response.id]);
    });
}

}
