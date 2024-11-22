export interface User {
    id?: string;
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[]; // Array of Role IDs
    // bookings?: string[]; // Array of Booking IDs
  }
  