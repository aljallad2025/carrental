import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ChatMessage } from '../models/car.model';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private channel: RealtimeChannel | null = null;

  constructor(private supabase: SupabaseService) {}

  async getMessages(customerId: string): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase.from('chat_messages').select('*').eq('customer_id', customerId).order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async sendMessage(customerId: string, message: string): Promise<void> {
    const { error } = await this.supabase.from('chat_messages').insert({ customer_id: customerId, message, is_admin: false });
    if (error) throw error;
  }

  subscribeToMessages(customerId: string, callback: (msg: ChatMessage) => void) {
    this.channel = this.supabase.client.channel(`chat:${customerId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `customer_id=eq.${customerId}` }, (payload) => callback(payload.new as ChatMessage))
      .subscribe();
  }

  unsubscribe() {
    if (this.channel) this.channel.unsubscribe();
  }
}
