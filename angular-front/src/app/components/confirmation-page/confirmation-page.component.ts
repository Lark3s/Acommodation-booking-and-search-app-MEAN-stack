import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.css']
})
export class ConfirmationPageComponent implements OnInit {
  booking: any;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.bookingService.getBookingById(bookingId).subscribe(data => {
        this.booking = data;
      });
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
