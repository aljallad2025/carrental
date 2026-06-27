import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private supabase: SupabaseService) {}

  async uploadImage(bucket: string, path: string, file: File): Promise<string> {
    const { error } = await this.supabase.storage(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = this.supabase.storage(bucket).getPublicUrl(path);
    return publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage(bucket).remove([path]);
    if (error) throw error;
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = this.supabase.storage(bucket).getPublicUrl(path);
    return publicUrl;
  }
}
