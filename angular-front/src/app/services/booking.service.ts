import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const baseUrl = 'http://localhost:8080/api/bookings';
const baseUrlAlt = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) {}

  // Create a new booking
  createBooking(bookingDetails: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}`, bookingDetails);
  }

  // Get all bookings
  getBookings(params: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}`, { params });
  }

  // Get bookings by accommodation ID
  getBookingsByAccommodation(accommodationId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/accommodation/${accommodationId}`);
  }

  // Get a specific booking by ID
  getBookingById(bookingId: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${bookingId}`);
  }

  // Get bookings by user ID
  getBookingsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/user/${userId}`);
  }

  // Cancel a booking
  cancelUserBooking(bookingId: string): Observable<any[]> {
    return this.http.get<any>(`${baseUrl}/user/cancel/${bookingId}`);
  }

  // Cancel a booking
  cancelOwnerBooking(bookingId: string): Observable<any[]> {
    return this.http.get<any>(`${baseUrl}/owner/cancel/${bookingId}`);
  }

  // Update a booking
  updateBooking(bookingId: string, bookingDetails: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/${bookingId}`, bookingDetails);
  }

  // Delete a booking
  deleteBooking(bookingId: string): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/${bookingId}`);
  }
}
