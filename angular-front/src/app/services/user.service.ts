import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

const API_URL = 'http://localhost:8080/api/users/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  // Create a new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(API_URL, user);
  }

  // Get all users
  getUsers(params: any): Observable<any> {
    return this.http.get<any>(API_URL, {params});
  }

  // Get a user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/id/${id}`, { withCredentials: true });
  }

  // Update a user
  updateUser(user: User): Observable<any> {
    return this.http.put(`${API_URL}$/id/{user.id}`, user);
  }

  // Delete a user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${API_URL}id/${id}`);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put('/api/users/change-password', { currentPassword, newPassword });
  }
}