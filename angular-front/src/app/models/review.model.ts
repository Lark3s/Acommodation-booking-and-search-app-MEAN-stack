export interface Review {
    id?: string;
    user?: any; // User ID
    accommodation?: string; // Accommodation ID
    rating?: number; // Between 1 and 5
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  