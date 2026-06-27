import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private supabase: SupabaseService, private auth: AuthService) {}

  async initialize() {
    // Only register push notifications on native platforms
    if (!Capacitor.isNativePlatform()) return;

    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');

      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') return;

      await PushNotifications.register();

      await PushNotifications.addListener('registration', async (token) => {
        const user = this.auth.currentUser();
        if (user) {
          await this.supabase.from('profiles')
            .update({ push_token: token.value })
            .eq('id', user.id);
        }
      });

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Push registration error:', err);
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification.title);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Push action:', action.actionId);
      });

    } catch (error) {
      console.warn('Push notifications not available:', error);
    }
  }

  async removeAllListeners() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      await PushNotifications.removeAllListeners();
    } catch (e) {}
  }
}
