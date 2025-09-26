import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  KommoContactPayload,
  KommoContactResponse,
} from './interfaces/kommo-contact.interface';
import {
  KommoLeadPayload,
  KommoLeadResponse,
} from './interfaces/kommo-lead.interface';

@Injectable()
export class KommoService {
  private readonly apiUrl: string;
  private readonly accessToken: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('KOMMO_API_URL') || '';
    this.accessToken =
      this.configService.get<string>('KOMMO_ACCESS_TOKEN') || '';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  /**
   * Procura por um contato existente no Kommo usando e-mail ou telefone.
   * @param query - O e-mail ou telefone a ser pesquisado.
   * @returns O ID do contato se encontrado, caso contrário, null.
   */
  private async findContactByQuery(query: string): Promise<number | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<KommoContactResponse>(
          `${this.apiUrl}/api/v4/contacts`,
          {
            headers: this.getHeaders(),
            params: { query },
          },
        ),
      );
      // Retorna o ID do primeiro contato encontrado
      return response.data._embedded?.contacts?.[0]?.id || null;
    } catch (error) {
      // Se a busca falhar (ex: 404 - Not Found), consideramos que não encontrou.
      if (error.response?.status === 404) {
        return null;
      }
      console.error(
        'Erro ao buscar contato no Kommo:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to search for contact in Kommo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Busca um contato existente no Kommo por telefone ou email.
   * @param phone - Número de telefone (opcional).
   * @param email - Email (opcional).
   * @returns O contato encontrado com ID, caso contrário null.
   */
  async findContactByPhoneOrEmail(
    phone?: string,
    email?: string,
  ): Promise<{ id: string } | null> {
    try {
      // Tenta encontrar pelo e-mail primeiro, se disponível
      if (email) {
        const contactId = await this.findContactByQuery(email);
        if (contactId) {
          return { id: contactId.toString() };
        }
      }

      // Se não encontrou pelo e-mail, tenta pelo telefone
      if (phone) {
        const phoneWithCountryCode = `+55${phone}`;
        const contactId = await this.findContactByQuery(phoneWithCountryCode);
        if (contactId) {
          return { id: contactId.toString() };
        }
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar contato no Kommo:', error);
      return null;
    }
  }

  /**
   * Cria um novo contato no Kommo, mas primeiro verifica se já existe.
   * @param contactData - Dados do contato (nome, e-mail, telefone).
   * @returns O ID do contato (novo ou existente).
   */
  async createOrFindContact(contactData: any): Promise<number> {
    // Tenta encontrar pelo e-mail primeiro, se disponível
    if (contactData.email) {
      const existingContactId = await this.findContactByQuery(
        contactData.email,
      );
      if (existingContactId) {
        console.log(
          `Contato existente encontrado pelo e-mail: ${existingContactId}`,
        );
        return existingContactId;
      }
    }
    // Se não encontrou pelo e-mail, tenta pelo telefone
    if (contactData.phone) {
      const phoneWithCountryCode = `+55${contactData.phone}`;
      const existingContactId =
        await this.findContactByQuery(phoneWithCountryCode);
      if (existingContactId) {
        console.log(
          `Contato existente encontrado pelo telefone: ${existingContactId}`,
        );
        return existingContactId;
      }
    }

    // Se não encontrou, cria um novo contato
    console.log('Nenhum contato existente encontrado. Criando um novo.');
    try {
      const payload: KommoContactPayload[] = [
        {
          name: contactData.name,
          first_name: contactData.first_name,
          last_name: contactData.last_name || '',
          custom_fields_values: [
            {
              field_id: 531860, // Email field
              values: [{ value: contactData.email, enum_code: 'WORK' }],
            },
            {
              field_id: 531858, // Phone field
              values: [{ value: `+55${contactData.phone}`, enum_code: 'WORK' }],
            },
          ],
        },
      ];

      const response = await firstValueFrom(
        this.httpService.post<KommoContactResponse>(
          `${this.apiUrl}/api/v4/contacts`,
          payload,
          { headers: this.getHeaders() },
        ),
      );

      const contactId = response.data._embedded?.contacts?.[0]?.id;
      if (!contactId) {
        throw new HttpException(
          'Contact ID not returned by Kommo',
          HttpStatus.BAD_REQUEST,
        );
      }
      return contactId;
    } catch (error) {
      console.error(
        'Erro ao criar novo contato no Kommo:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to create contact in Kommo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Cria um novo lead e o associa a um contato.
   * @param leadData - Dados do lead.
   * @param contactId - ID do contato a ser vinculado.
   * @returns O ID do lead criado.
   */
  async createLead(
    leadData: any,
    contactId: number,
  ): Promise<{ leadId: number }> {
    try {
      const payload: KommoLeadPayload[] = [
        {
          name: `Lead - ${leadData.name}`,
          price: 0,
          _embedded: {
            contacts: [{ id: contactId }],
          },
          custom_fields_values: [
            {
              field_id: 531872,
              values: [{ value: leadData.utm_source || 'landing_page' }],
            },
            {
              field_id: 531868,
              values: [{ value: leadData.utm_medium || 'website' }],
            },
            {
              field_id: 531870,
              values: [{ value: leadData.utm_campaign || 'gdf_nova_vision' }],
            },
            { field_id: 789656, values: [{ enum_id: 656334 }] },
          ],
          tags: [
            { name: 'google' },
            { name: 'Landing Page' },
            { name: 'CB Brazil GDF' },
          ],
        },
      ];

      const response = await firstValueFrom(
        this.httpService.post<KommoLeadResponse>(
          `${this.apiUrl}/api/v4/leads`,
          payload,
          { headers: this.getHeaders() },
        ),
      );

      const leadId = response.data._embedded?.leads?.[0]?.id;
      if (!leadId) {
        throw new HttpException(
          'Lead ID not returned by Kommo',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Retorna um objeto com o leadId para facilitar o uso
      return { leadId };
    } catch (error) {
      console.error(
        'Erro ao criar lead no Kommo:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to create lead in Kommo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Adiciona nota a uma entidade do Kommo
   */
  async addNote(
    entity: 'leads' | 'contacts' | 'companies',
    entityId: number,
    text: string,
  ) {
    const url = `${this.apiUrl}/api/v4/${entity}/notes`;
    const body = [
      {
        entity_id: entityId,
        note_type: 'common',
        params: { text },
      },
    ];

    try {
      const response = await this.httpService.axiosRef.post(url, body, {
        headers: {
          Authorization: `Bearer ${process.env.KOMMO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao adicionar nota no ${entity} ${entityId}:`, error);
      throw error;
    }
  }
}
