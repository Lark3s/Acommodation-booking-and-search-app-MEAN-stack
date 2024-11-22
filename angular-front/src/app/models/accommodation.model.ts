export interface Accommodation {
    id?: string;
    name?: string;
    description?: string;
    location?: string;
    pricePerNight?: number;
    amenities?: string[];
    availability?: { startDate: Date; endDate: Date }[];
    owner?: string[]; // Array of User IDs
    bookings?: string[]; // Array of Booking IDs
    createdAt?: Date;
    updatedAt?: Date;
    averageRating?: Number;
    reviewCount?: Number;
    latitude?: number;
    longitude?: number;
    images?: string[];
  }
  