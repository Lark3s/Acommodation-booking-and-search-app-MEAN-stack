import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AccommodationService } from '../../services/accommodation.service';
import { BookingService } from '../../services/booking.service';
import { ReviewService } from '../../services/review.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteAdminConfirmationDialogComponent } from '../delete-admin-confirmation-dialog/delete-admin-confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditAccommodationComponent } from '../edit-accommodation/edit-accommodation.component';
import { EditReviewComponent } from '../edit-review/edit-review.component';
import { EditBookingComponent } from '../edit-booking/edit-booking.component';


@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  
  tables = [
    { value: 'users', viewValue: 'Users' },
    { value: 'accommodations', viewValue: 'Accommodations' },
    { value: 'reviews', viewValue: 'Reviews' },
    { value: 'bookings', viewValue: 'Bookings' }
  ];

  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  sortField = 'createdAt';
  sortOrder = 'desc';

  selectedTable = 'users';
  displayedColumns: string[] = [];
  allDisplayedColumns: string[] = ['id', 'createdAt', 'updatedAt']; // Fixed columns
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private accommodationService: AccommodationService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadTableData(this.selectedTable);
    console.log('sort',this.sort);
  }

  onTableChange(table: string) {
    this.currentPage = 0;
    this.pageSize = 5;
    this.totalItems = 0;
    this.totalPages = 0;
    this.loadTableData(table);
    console.log(this.dataSource.sort);
    console.log(this.sort);
  }

  loadTableData(table: string) {
    switch (table) {
      case 'users':
        this.displayedColumns = ['username', 'firstName', 'lastName', 'email'];
        break;
      case 'accommodations':
        this.displayedColumns = [ 'name', 'location', 'averageRating', 'reviewCount', 'pricePerNight', 'longitude', 'latitude'];
        break;
      case 'reviews':
        this.displayedColumns = ['rating', 'comment'];
        break;
      case 'bookings':
        this.displayedColumns = ['userId', 'accommodationId', 'totalPrice', 'checkInDate', 'checkOutDate', 'cancelled'];
        break;
      default:
        this.displayedColumns = [];
        break;
    }
    this.allDisplayedColumns = ['id', 'createdAt', 'updatedAt', ...this.displayedColumns];
    this.fetchData(table);
  }

  fetchData(table: string) {
    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };
    switch (table) {
      case 'users':
        this.userService.getUsers(params).subscribe(
          data => {
            this.totalItems = data.totalItems;
            this.currentPage = data.currentPage;
            this.totalPages = data.totalPages;

            console.log('tp', this.totalPages);
            console.log('ti', this.totalItems);

            this.initializeTable(data.users);
          },
          error => console.error('Error fetching users', error)
        );
        
        break;
      case 'accommodations':
        this.accommodationService.getAll(params).subscribe(
          data => {
            this.totalItems = data.totalItems;
            this.currentPage = data.currentPage;
            this.totalPages = data.totalPages;

            console.log('tp', this.totalPages);
            console.log('ti', this.totalItems);

            this.initializeTable(data.accommodations)
          },
          error => console.error('Error fetching accommodations', error)
        );
        break;
      case 'reviews':
        this.reviewService.getAllReviews(params).subscribe(
          data => {
            this.totalItems = data.totalItems;
            this.currentPage = data.currentPage;
            this.totalPages = data.totalPages;
            console.log('tp', this.totalPages);
            console.log('ti', this.totalItems);

            this.initializeTable(data.reviews);
          },
          error => console.error('Error fetching reviews', error)
        );
        break;
      case 'bookings':
        this.bookingService.getBookings(params).subscribe(
          data => {
            this.totalItems = data.totalItems;
            this.currentPage = data.currentPage;
            this.totalPages = data.totalPages;
            console.log('tp', this.totalPages);
            console.log('ti', this.totalItems);

            data.bookings = data.bookings.map((booking: any) => ({
              ...booking,
              userId: booking.user._id,
              accommodationId: booking.accommodation._id
            }));

            this.initializeTable(data.bookings);
          },
          error => console.error('Error fetching bookings', error)
        );
        break;
      default:
        this.initializeTable([]);
        break;
    }
  }

  initializeTable(data: any[]) {
    console.log('data: ', data);
    this.dataSource = new MatTableDataSource(data);
  }

  onSortChange(): void {
    this.sortField = this.sort.active;
    this.sortOrder = this.sort.direction;
    this.currentPage = 0;
    console.log(this.sortField);
    console.log(this.sortOrder);
    this.loadTableData(this.selectedTable);
  }

  edit(element: any): void {
    let dialogRef: MatDialogRef<any> | undefined;;
  
    switch (this.selectedTable) {
      case 'users':
        dialogRef = this.dialog.open(EditUserComponent, {
          width: '400px',
          data: element
        });
        break;
      case 'accommodations':
        dialogRef = this.dialog.open(EditAccommodationComponent, {
          width: '400px',
          data: element
        });
        break;
      case 'reviews':
        dialogRef = this.dialog.open(EditReviewComponent, {
          width: '400px',
          data: element
        });
        break;
      case 'bookings':
        dialogRef = this.dialog.open(EditBookingComponent, {
          width: '400px',
          data: element
        });
        break;
      default:
        console.error('No valid table selected');
        break;
    }
  
  
    if (dialogRef) { // Check if dialogRef is defined before using it
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Update the table data if the dialog was successful
          const index = this.dataSource.data.findIndex(item => item._id === result._id);
          if (index !== -1) {
            this.dataSource.data[index] = result;
            this.dataSource._updateChangeSubscription(); // Refresh the table
          }
        }
      });
    }
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(DeleteAdminConfirmationDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { // If confirmed
        switch (this.selectedTable) {
          case 'users':
            this.userService.deleteUser(element._id).subscribe(
              () =>{
                this.removeElementFromTable(element._id);
                this.snackBar.open('Booking deleted successfully', 'Close', {
                  duration: 3000,
                });
              } ,
              error => {console.error('Error deleting user', error);
                this.snackBar.open('Error, something went wrong', 'Close', {
                  duration: 3000,
                });
              }
            );
            break;
          case 'accommodations':
            this.accommodationService.delete(element.id).subscribe(
              () => {
                this.removeElementFromTable(element.id);
                this.snackBar.open('Booking deleted successfully', 'Close', {
                  duration: 3000,
                });
              }, 
              error => {console.error('Error deleting accommodation', error);
                this.snackBar.open('Error, something went wrong', 'Close', {
                  duration: 3000,
                });
              }
            );
            break;
          case 'reviews':
            this.reviewService.deleteReview(element.id).subscribe(
              () => {
                this.removeElementFromTable(element.id);
                this.snackBar.open('Booking deleted successfully', 'Close', {
                  duration: 3000,
                });
              },
               
              error => {console.error('Error deleting review', error);
                this.snackBar.open('Error, something went wrong', 'Close', {
                  duration: 3000,
                });
              }
            );
            break;
          case 'bookings':
            this.bookingService.deleteBooking(element.id).subscribe(
              () => {
                this.removeElementFromTable(element.id);
                this.snackBar.open('Booking deleted successfully', 'Close', {
                  duration: 3000,
                });
              }, 
              error => {console.error('Error deleting booking', error);
                this.snackBar.open('Error, something went wrong', 'Close', {
                  duration: 3000,
                });
              }
            );
            break;
          default:
            console.error('No valid table selected');
            break;
        }
      }
    });
  }

  removeElementFromTable(id: string): void {
    this.dataSource.data = this.dataSource.data.filter((item: any) => item._id !== id);
    this.dataSource._updateChangeSubscription(); // Refresh the table
  }

  formatColumnHeader(column: string): string {
    return column.replace(/([A-Z])/g, ' $1') // camelCase
                 .replace(/_/g, ' ')         // snake_case
                 .replace(/^./, str => str.toUpperCase());
  }

  goToPage(event: PageEvent) {
    console.log('Paginator event:', event); // For debugging
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.sort.active
    this.loadTableData(this.selectedTable);
  }
}