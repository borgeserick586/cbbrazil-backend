import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { KommoService } from '../kommo/kommo.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    private supabaseService: SupabaseService,
    private kommoService: KommoService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      // 1. Criar contato no Supabase
      const supabaseContact = await this.supabaseService.createContact({
        name: createContactDto.name,
        email: createContactDto.email,
        phone: createContactDto.phone,
        first_name: createContactDto.first_name,
        last_name: createContactDto.last_name,
      });

      // 2. Criar contato no Kommo
      const kommoContactId =
        await this.kommoService.createContact(createContactDto);

      return {
        supabase: supabaseContact,
        kommo: { id: kommoContactId },
      };
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      throw error;
    }
  }
}
