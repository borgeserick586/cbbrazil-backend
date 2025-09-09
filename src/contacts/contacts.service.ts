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
        await this.kommoService.createOrFindContact(createContactDto);

      return {
        supabase: supabaseContact,
        kommo: { id: kommoContactId },
      };
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      throw error;
    }
  }

  // ✅ NOVO: Método para buscar ou criar contato (evita duplicatas)
  async findOrCreate(createContactDto: CreateContactDto) {
    try {
      console.log(
        '[ContactsService] Verificando se contato já existe no Supabase...',
      );

      // 1. Primeiro, tenta encontrar contato existente no Supabase
      const existingContact =
        await this.supabaseService.findContactByPhoneOrEmail(
          createContactDto.phone,
          createContactDto.email,
        );

      if (existingContact) {
        console.log(
          `[ContactsService] Contato já existe no Supabase! ID: ${existingContact.id}`,
        );

        // 2. Busca o ID do Kommo (pode não existir ainda)
        const kommoContact = await this.kommoService.findContactByPhoneOrEmail(
          createContactDto.phone,
          createContactDto.email,
        );

        return {
          supabase: existingContact,
          kommo: { id: kommoContact?.id || null },
          isNew: false,
        };
      }

      console.log('[ContactsService] Contato não existe. Criando novo...');

      // 3. Se não existe, cria novo (fluxo normal)
      const result = await this.create(createContactDto);
      return {
        ...result,
        isNew: true,
      };
    } catch (error) {
      console.error('Erro ao buscar/criar contato:', error);
      throw error;
    }
  }
}
