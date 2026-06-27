export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  plate_number: string;
  vin?: string;
  category?: string;
  status: 'available' | 'rented' | 'maintenance' | 'sold' | string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  sale_price?: number;
  purchase_price?: number;
  mileage?: number;
  fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'automatic' | 'manual';
  seats?: number;
  insurance_expiry?: string;
  registration_expiry?: string;
  image_url?: string;
  features?: string[];
  notes?: string;
  location?: string;
  created_at: string;
  updated_at?: string;

  // UI-only convenience fields populated client-side (not real DB columns)
  rating?: number;
  reviews_count?: number;
  images?: string[];
}

export interface Booking {
  id: string;
  car_id: string;
  customer_id?: string;
  car?: Car;
  full_name: string;
  email?: string;
  phone?: string;
  start_date?: string;
  end_date?: string;
  pickup_location?: string;
  dropoff_location?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  dropoff_lat?: number;
  dropoff_lng?: number;
  license_image_url?: string;
  id_image_url?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | string;
  notes?: string;
  total_amount: number;
  created_at: string;
}

export interface BookingExtra {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Review {
  id: string;
  user_id: string;
  car_id: string;
  rating: number;
  comment: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

// Maps to the real `customers` table (not Supabase Auth `profiles`)
export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  phone_2?: string;
  national_id?: string;
  license_number?: string;
  license_expiry?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: string;
  rating?: number;
  notes?: string;
  cpr_number?: string;
  cpr_image_url?: string;
  license_image_url?: string;
  customer_type?: 'individual' | 'company';
  company_name?: string;
  nationality?: string;
  created_at: string;
}
