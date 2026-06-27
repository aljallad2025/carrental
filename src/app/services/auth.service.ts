import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { UserProfile } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<UserProfile | null>(null);
  isLoggedIn = signal<boolean>(false);
  isGuest = signal<boolean>(false);

  constructor(private supabase: SupabaseService, private router: Router) {}

  async initialize() {
    if (localStorage.getItem('guest_mode') === 'true') {
      this.isGuest.set(true);
    }
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session?.user) {
      await this.loadOrCreateCustomer(session.user.id, session.user.email || '');
      this.isLoggedIn.set(true);
      this.isGuest.set(false);
      this.router.navigate(['/tabs/home']);
    }
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.removeItem('guest_mode');
        await this.loadOrCreateCustomer(session.user.id, session.user.email || '');
        this.isLoggedIn.set(true);
        this.isGuest.set(false);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  // Lets a visitor browse cars without an account. Booking/Favorites/Chat
  // actions should call requireAuth() first and prompt login if this is true.
  continueAsGuest() {
    localStorage.setItem('guest_mode', 'true');
    this.isGuest.set(true);
    this.isLoggedIn.set(false);
    this.router.navigate(['/tabs/home']);
  }

  // Returns true if the current visitor needs to log in before continuing
  // (i.e. is a guest or has no session at all).
  requireAuth(): boolean {
    return !this.isLoggedIn() || !this.currentUser();
  }

  async loginWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async loginWithPhone(phone: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ phone, password });
    if (error) throw error;
    return data;
  }

  // Supabase Auth still owns login/session; the `customers` table holds the actual profile data
  // (it has no auth.users foreign key, so we look it up / create it by email after signup).
  async register(email: string, password: string, fullName: string, phone: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone } }
    });
    if (error) throw error;
    if (data.user) {
      const { data: existing } = await this.supabase.from('customers').select('*').eq('email', email).maybeSingle();
      if (!existing) {
        await this.supabase.from('customers').insert({
          full_name: fullName,
          email,
          phone,
          customer_type: 'individual',
        });
      }
    }
    return data;
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async logout() {
    localStorage.removeItem('guest_mode');
    this.isGuest.set(false);
    await this.supabase.auth.signOut();
  }

  // Looks up the customer record by the logged-in user's email (created at signup).
  // Falls back to creating one if missing, so existing Supabase Auth users still work.
  async loadOrCreateCustomer(authUserId: string, email: string) {
    let customer = null;
    if (email) {
      const { data } = await this.supabase.from('customers').select('*').eq('email', email).maybeSingle();
      customer = data;
    }
    if (!customer) {
      const { data: authUser } = await this.supabase.auth.getUser();
      const fullName = authUser?.user?.user_metadata?.['full_name'] || email || 'Guest';
      const phone = authUser?.user?.user_metadata?.['phone'] || authUser?.user?.phone || '';
      const { data: created } = await this.supabase.from('customers').insert({
        full_name: fullName, email, phone, customer_type: 'individual',
      }).select().single();
      customer = created;
    }
    if (customer) this.currentUser.set(customer);
  }

  async updateProfile(updates: Partial<UserProfile>) {
    const user = this.currentUser();
    if (!user) return;
    const { error } = await this.supabase.from('customers').update(updates).eq('id', user.id);
    if (error) throw error;
    this.currentUser.set({ ...user, ...updates });
  }

  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await this.supabase.storage(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = this.supabase.storage(bucket).getPublicUrl(path);
    return publicUrl;
  }
}
