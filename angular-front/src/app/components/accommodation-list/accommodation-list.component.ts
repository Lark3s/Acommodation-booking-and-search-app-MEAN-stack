import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../../services/accommodation.service';
import { Accommodation } from '../../models/accommodation.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrl: './accommodation-list.component.css'
})
export class AccommodationListComponent implements OnInit {
  accommodations: Accommodation[] = [];
  filters = {
    title: '',
    location: '',
    minPrice: null,
    maxPrice: null,
    startDate: null,
    endDate: null
  };
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  constructor(private accommodationService: AccommodationService) {}

  ngOnInit(): void {
    this.getAccommodations();
  }

  getAccommodations(): void {
    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize
    };
    

    this.accommodationService.getAll(params)
      .subscribe(
        response => {
          this.accommodations = response.accommodations;
          this.totalItems = response.totalItems;
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          console.log('tp', this.totalPages);
          console.log('ti', this.totalItems);
        },
        error => {
          console.log(error);
        });
  }

  searchByTitle(): void {
    if (this.filters.title) {
      this.currentPage = 1;
      this.accommodationService.findByTitle(this.filters.title, this.currentPage, this.pageSize, this.currentPage).subscribe(response => {
        console.log('response: ', response)
        this.accommodations = response.accommodations;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
      });
    } else {
      this.getAccommodations();
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.accommodationService.filterByFields(this.filters, this.currentPage, this.pageSize, this.currentPage).subscribe(response => {
      console.log('response: ', response)
      this.accommodations = response.accommodations;
      this.totalItems = response.totalPages;
      this.currentPage = response.currentPage;
    });
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      location: '',
      minPrice: null,
      maxPrice: null,
      startDate: null,
      endDate: null
    };
    this.currentPage = 0;
    this.getAccommodations();
  }

  goToPage(event: PageEvent) {
    console.log('Paginator event:', event); // For debugging
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAccommodations();
  }
}
