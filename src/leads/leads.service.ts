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

  async create(createLeadDto: CreateLeadDto, waitForWhatsapp = false) {
    try {
      console.log(
        `[LeadsService] Iniciando criação de lead. waitForWhatsapp: ${waitForWhatsapp}`,
      );

      // Trigger dev: aguarda até 3 minutos para ver se o contato foi criado via WhatsApp (Kommo)
      let kommoContactId: string | undefined = undefined;
      let contactResult: any = undefined;
      let supabaseContactId: string | undefined = undefined;

      if (waitForWhatsapp) {
        console.log(
          '[LeadsService] Trigger dev ativado! Aguardando até 3 minutos para verificar contato no Kommo...',
        );
        const maxWaitMs = 3 * 60 * 1000; // 3 minutos 3 * 60 * 1000
        const intervalMs = 25 * 1000; // checa a cada 25s
        const start = Date.now();
        let found = false;
        let attempts = 0;

        while (Date.now() - start < maxWaitMs && !found) {
          attempts++;
          console.log(
            `[LeadsService] Tentativa ${attempts}: Buscando contato no Kommo...`,
          );

          // Tenta buscar contato no Kommo pelo telefone (WhatsApp) e email se disponível
          const kommoContact =
            await this.kommoService.findContactByPhoneOrEmail(
              createLeadDto.phone,
              createLeadDto.email,
            );
          if (kommoContact && kommoContact.id) {
            console.log(
              `[LeadsService] Contato encontrado no Kommo! ID: ${kommoContact.id}`,
            );
            kommoContactId = kommoContact.id;
            found = true;
            break;
          }

          const elapsed = Date.now() - start;
          console.log(
            `[LeadsService] Contato não encontrado. Aguardando 25s... (${Math.round(elapsed / 1000)}s/${Math.round(maxWaitMs / 1000)}s)`,
          );
          await new Promise((res) => setTimeout(res, intervalMs));
        }

        if (kommoContactId) {
          console.log(
            '[LeadsService] Contato encontrado no Kommo (via WhatsApp). Verificando se já existe no Supabase...',
          );

          // ✅ CORREÇÃO: Usa findOrCreate ao invés de create para evitar duplicatas
          const supabaseContact = await this.contactsService.findOrCreate({
            name: createLeadDto.name,
            phone: createLeadDto.phone,
            email: createLeadDto.email || '',
            first_name: createLeadDto.name.split(' ')[0],
            last_name:
              createLeadDto.name.split(' ').slice(1).join(' ') || undefined,
          });

          supabaseContactId = supabaseContact.supabase.id;

          console.log(
            `[LeadsService] ${supabaseContact.isNew ? 'Novo contato criado' : 'Contato existente encontrado'} no Supabase. ID: ${supabaseContactId}`,
          );

          // Cria lead no Supabase
          const supabaseLead = await this.supabaseService.createLead({
            contact_id: supabaseContactId,
            name: createLeadDto.name,
            phone: createLeadDto.phone,
            email: createLeadDto.email || '',
            source: createLeadDto.source,
            utm_source: createLeadDto.utm_source,
            utm_medium: createLeadDto.utm_medium,
            utm_campaign: createLeadDto.utm_campaign,
            status: createLeadDto.status || 'new_lead',
            metadata: createLeadDto.custom_fields,
          });

          return {
            contactId: kommoContactId,
            leadId: null,
            supabaseContact: supabaseContact.supabase,
            supabaseLead,
            info: `Lead já existia no Kommo (WhatsApp). Contato ${supabaseContact.isNew ? 'criado' : 'encontrado'} no Supabase.`,
          };
        } else {
          console.log(
            '[LeadsService] Tempo limite esgotado. Contato não encontrado no Kommo. Seguindo fluxo normal...',
          );
        }
        // Se não encontrou, segue fluxo normal
      }

      console.log(
        '[LeadsService] Executando fluxo normal: criando contato e lead...',
      );

      // 1. Criar contato primeiro (fluxo normal) - também usa findOrCreate para consistência
      const contactData = {
        name: createLeadDto.name,
        email: createLeadDto.email || '',
        phone: createLeadDto.phone,
        first_name: createLeadDto.name.split(' ')[0],
        last_name:
          createLeadDto.name.split(' ').slice(1).join(' ') || undefined,
      };

      contactResult = await this.contactsService.findOrCreate(contactData);
      supabaseContactId = contactResult.supabase.id;
      kommoContactId = contactResult.kommo.id;

      console.log(
        `[LeadsService] Contato ${contactResult.isNew ? 'criado' : 'encontrado'}. Supabase ID: ${supabaseContactId}, Kommo ID: ${kommoContactId}`,
      );

      // 2. Criar lead no Supabase
      const supabaseLead = await this.supabaseService.createLead({
        contact_id: supabaseContactId,
        name: createLeadDto.name,
        email: createLeadDto.email || '',
        phone: createLeadDto.phone,
        source: createLeadDto.source,
        utm_source: createLeadDto.utm_source,
        utm_medium: createLeadDto.utm_medium,
        utm_campaign: createLeadDto.utm_campaign,
        status: createLeadDto.status || 'new_lead',
        metadata: createLeadDto.custom_fields,
      });

      // 3. Criar lead no Kommo (só se o contato existir no Kommo)
      let kommoLead: { leadId: number } | null = null;
      if (kommoContactId) {
        const kommoContactIdNumber = Number(kommoContactId);
        if (!kommoContactIdNumber) {
          throw new Error('ID do contato do Kommo inválido para criar lead.');
        }
        kommoLead = await this.kommoService.createLead(
          createLeadDto,
          kommoContactIdNumber,
        );
      } else {
        console.log(
          '[LeadsService] Contato não existe no Kommo, pulando criação de lead no Kommo.',
        );
      }

      const kommoLeadId = kommoLead?.leadId || null;

      return {
        contactId: kommoContactId,
        leadId: kommoLeadId,
        supabaseContact: contactResult.supabase,
        supabaseLead,
      };
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  }
}
