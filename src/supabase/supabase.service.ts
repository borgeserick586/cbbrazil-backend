import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '';

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async createContact(contactData: any) {
    const { data, error } = await this.supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createLead(leadData: any) {
    const { data, error } = await this.supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
