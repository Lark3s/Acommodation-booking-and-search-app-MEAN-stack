import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true 
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiURL = 'http://localhost:8080/api/auth'; // Replace with your actual API URL

  constructor(private http: HttpClient, private storageService: StorageService, private router: Router) {}

  public signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/signin`, {username, password}, { withCredentials: true }).pipe(
      tap((tokens) => {

      })
    );
  }

  clearAllCookies() {
    const cookies = document.cookie.split(';');
  
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }


  public refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/refreshtoken`, {}, { withCredentials: true });
  }  


  register(username: string, email: string, password: string, firstName: string, lastName: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
        firstName,
        lastName
      },
      httpOptions
    );
  }

  signOut(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }

}