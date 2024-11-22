import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Accommodation } from '../models/accommodation.model';
import { Form } from '@angular/forms';

const baseUrl = 'http://localhost:8080/api/accommodations';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {

  constructor(private http: HttpClient) {}

  // CRUD Operations
  getAll(params: any): Observable<any> {
    return this.http.get<any>(baseUrl, { params });
  }

  getById(id: string): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${baseUrl}/${id}`);
  }

  create(accommodation: FormData): Observable<any> {
    return this.http.post<Accommodation>(baseUrl, accommodation);
  }

  update(id: string, accommodation: Accommodation): Observable<Accommodation> {
    return this.http.put<Accommodation>(`${baseUrl}/${id}`, accommodation);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  // Find by title
  findByTitle(title: string, currentPage: number, pageSize: number, totalItems: number): Observable<any> {
    const params = new HttpParams().set('title', title).set('currentPage', currentPage).set('pageSize', pageSize).set('totalItems', totalItems);
    return this.http.get<Accommodation[]>(baseUrl, { params });
  }

  // Find by title
  searchByTitle(title: string, currentPage: number, pageSize: number, totalItems: number): Observable<any> {
    const params = new HttpParams().set('title', title).set('currentPage', currentPage).set('pageSize', pageSize).set('totalItems', totalItems);
    return this.http.get<Accommodation[]>(baseUrl, { params });
  }

  searchBarSearchByTitle(title: string): Observable<any> {
    if (title.trim().length === 0) {
      return of([]); // Return an empty observable array if the title is empty
    }

    const params = new HttpParams().set('title', title);
    return this.http.get<any[]>(`${baseUrl}/title`, { params });
  }

  // Filter by multiple fields
  filterByFields(filters: any, currentPage: number, pageSize: number, totalItems: number): Observable<any> {
    let params = new HttpParams().set('currentPage', currentPage).set('pageSize', pageSize).set('totalItems', totalItems);
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<any>(baseUrl, { params });
  }

  //find by owner
  getAccommodationsByUser(userId: string): Observable<any> {
    return this.http.get(`${baseUrl}/user/${userId}`);
  }
}
