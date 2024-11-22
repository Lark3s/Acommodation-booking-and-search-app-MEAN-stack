import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Validation from './utils/validation';
import { Subject, Subscription } from 'rxjs';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { EventBusService } from './shared/event-bus.service';
import { AccommodationService } from './services/accommodation.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  searchTerm: string = '';
  filteredOptions: any[] = [];

  eventBusSub?: Subscription;

  private searchTerms$ = new Subject<string>();

  constructor(private storageService: StorageService, private authService: AuthService, private eventBusService: EventBusService, private formBuilder: FormBuilder, private accommodationService: AccommodationService, private router: Router ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

    this.searchTerms$
      .pipe(
        debounceTime(300), // Delay the request
        distinctUntilChanged(), // Only trigger if the term changed
        switchMap(term => this.accommodationService.searchBarSearchByTitle(term))
      )
      .subscribe(
        results => {
          this.filteredOptions = results.slice(0, 5); // Limit to 5 results
          console.log('Filtered Options:', this.filteredOptions);
        },
        error => {
          console.error('Error during search:', error);
          this.filteredOptions = []; // Clear options on error
        }
      );
  }

  logout(): void {
    // this.authService.signOut();
    this.authService.signOut().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        this.isLoggedIn = false;
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    if (searchTerm.length >= 3) {
      this.searchTerms$.next(searchTerm);
    } else {
      this.filteredOptions = [];
      // If the user clears the input, we should also clear the searchTerms$ stream.
      if (searchTerm.length === 0) {
        this.searchTerms$.next(''); // Ensure the stream is reset.
      }
    }
  }
  
  

  navigateToAccommodation(title: string) {
    const selectedAccommodation = this.filteredOptions.find(option => option.name === title);
    if (selectedAccommodation) {
      this.router.navigate([`/accommodations/${selectedAccommodation.id}`])
        .catch(err => console.error('Navigation error:', err));
        console.log(selectedAccommodation);
    }
  }

  onSubmit(): void {
   
  }

  onReset(): void {
    
  }
}