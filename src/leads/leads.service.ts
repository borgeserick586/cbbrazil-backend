import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { KommoService } from '../kommo/kommo.service';
import { ContactsService } from '../contacts/contacts.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private supabaseService: SupabaseService,
    private kommoService: KommoService,
    private contactsService: ContactsService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    try {
      // 1. Criar contato primeiro
      const contactData = {
        name: createLeadDto.name,
        email: createLeadDto.email,
        phone: createLeadDto.phone,
        first_name: createLeadDto.name.split(' ')[0],
        last_name:
          createLeadDto.name.split(' ').slice(1).join(' ') || undefined,
      };

      const contactResult = await this.contactsService.create(contactData);
      const supabaseContactId = contactResult.supabase.id;
      const kommoContactId = contactResult.kommo.id;

      // 2. Criar lead no Supabase
      const supabaseLead = await this.supabaseService.createLead({
        contact_id: supabaseContactId,
        name: createLeadDto.name,
        email: createLeadDto.email,
        phone: createLeadDto.phone,
        source: createLeadDto.source,
        utm_source: createLeadDto.utm_source,
        utm_medium: createLeadDto.utm_medium,
        utm_campaign: createLeadDto.utm_campaign,
        status: createLeadDto.status || 'new_lead',
        metadata: createLeadDto.custom_fields,
      });

      // 3. Criar lead no Kommo
      const kommoLead = await this.kommoService.createLead(
        createLeadDto,
        kommoContactId,
      );

      return {
        contact: contactResult,
        lead: {
          supabase: supabaseLead,
          kommo: kommoLead,
        },
      };
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  }
}
