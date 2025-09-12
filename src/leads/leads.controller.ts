import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(
    @Body() createLeadDto: CreateLeadDto,
    @Query('waitForWhatsapp') waitForWhatsapp?: string,
  ) {
    try {
      // Converte string query param para boolean
      const shouldWaitForWhatsapp = waitForWhatsapp === 'true';

      const result = await this.leadsService.create(
        createLeadDto,
        shouldWaitForWhatsapp,
      );
      return {
        success: true,
        message: 'Lead created successfully',
        leadId: result.leadId,
        contactId: result.contactId,
        triggerDev: shouldWaitForWhatsapp,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create lead',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('with-whatsapp-trigger')
  async createWithWhatsappTrigger(@Body() createLeadDto: CreateLeadDto) {
    try {
      const result = await this.leadsService.create(createLeadDto, true);
      return {
        success: true,
        message: 'Lead creation with WhatsApp trigger initiated',
        leadId: result.leadId,
        contactId: result.contactId,
        triggerDev: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create lead with WhatsApp trigger',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
