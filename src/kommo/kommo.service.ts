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

  async createContact(contactData: any): Promise<number> {
    try {
      const payload: KommoContactPayload[] = [
        {
          name: contactData.name,
          first_name: contactData.first_name,
          last_name: contactData.last_name || '',
          custom_fields_values: [
            {
              field_id: 531860, // Email field
              values: [
                {
                  value: contactData.email,
                  enum_code: 'WORK',
                },
              ],
            },
            {
              field_id: 531858, // Phone field
              values: [
                {
                  value: `+55${contactData.phone}`,
                  enum_code: 'WORK',
                },
              ],
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
        'Erro ao criar contato no Kommo:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to create contact in Kommo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createLead(leadData: any, contactId: number): Promise<any> {
    try {
      const payload: KommoLeadPayload[] = [
        {
          name: `Lead - ${leadData.name}`,
          price: 5000,
          contacts_id: [contactId],
          custom_fields_values: [
            {
              field_id: 531872, // utm_source
              values: [{ value: leadData.utm_source || 'landing_page' }],
            },
            {
              field_id: 531868, // utm_medium
              values: [{ value: leadData.utm_medium || 'website' }],
            },
            {
              field_id: 531870, // utm_campaign
              values: [{ value: leadData.utm_campaign || 'gdf_nova_vision' }],
            },
            {
              field_id: 789656, // Origem
              values: [{ enum_id: 656334 }], // "GOOGLE"
            },
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

      return response.data;
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
}
