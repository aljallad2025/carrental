import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Booking } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private supabase: SupabaseService) {}

  // Writes directly to the real `bookings` table (car_id, customer_id, dates, locations, total_amount...)
  async createRentalBooking(booking: Partial<Booking>): Promise<Booking> {
    const { data, error } = await this.supabase.from('bookings').insert(booking).select().single();
    if (error) throw error;
    return data;
  }

  async getCustomerBookings(customerId: string, status?: string): Promise<Booking[]> {
    let query = this.supabase.from('bookings').select('*, cars(*)').eq('customer_id', customerId);
    if (status) query = query.eq('status', status);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const { error } = await this.supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (error) throw error;
  }

  async extendBooking(bookingId: string, newEndDate: string): Promise<void> {
    const { error } = await this.supabase.from('bookings').update({ end_date: newEndDate }).eq('id', bookingId);
    if (error) throw error;
  }

  // `payments` table is keyed on customer_id + rental_contract_id/invoice_id in the real schema,
  // not booking_id — kept best-effort here, returns customer payments generally.
  async getPayments(customerId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  calculateRentalPrice(dailyRate: number, startDate: Date, endDate: Date, extras: any[] = []): number {
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const basePrice = dailyRate * days;
    const extrasTotal = extras.reduce((sum, e) => sum + (e.price * days), 0);
    return basePrice + extrasTotal;
  }
}
