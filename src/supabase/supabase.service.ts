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

  async findContactByPhoneOrEmail(phone: string, email?: string) {
    let query = this.supabase.from('contacts').select('*');

    if (email && email.trim()) {
      // Se tem email, busca por telefone OU email
      query = query.or(`phone.eq.${phone},email.eq.${email}`);
    } else {
      // Se não tem email, busca só por telefone
      query = query.eq('phone', phone);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found
      throw error;
    }

    return data; // retorna null se não encontrar
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
