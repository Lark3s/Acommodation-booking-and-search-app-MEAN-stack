export interface Booking {
    id?: string;
    user?: string; // User ID
    accommodation?: string; // Accommodation ID
    checkInDate?: Date;
    checkOutDate?: Date;
    totalPrice?: number;
    createdAt?: Date;
    updatedAt?: Date;
    cancelled?: number;
    reviewLeft: boolean;
  }
  