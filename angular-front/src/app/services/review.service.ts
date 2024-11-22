import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) { }

  // Create a review
  createReview(review: { username: string, accommodationId: string, rating: number, comment: string, bookingId: string }): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, review);
  }

  // Retrieve all reviews
  getAllReviews(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl, {params});
  }

  // Retrieve a single review by ID
  getReviewById(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/${id}`);
  }

  // Retrieve a single review by accommodation ID
  getReviewsByAccommodationId(id: string, page: any): Observable<any> {
    const params = new HttpParams().set('page', page)
    return this.http.get<any>(`${this.baseUrl}/accommodations/${id}`, { params });
  }

  // Update a review
  updateReview(id: string, review: Partial<Review>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, review);
  }

  // Delete a review
  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Delete all reviews
  deleteAllReviews(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }
}
