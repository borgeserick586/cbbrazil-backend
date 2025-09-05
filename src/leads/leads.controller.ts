import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    try {
      const result = await this.leadsService.create(createLeadDto);
      return {
        success: true,
        message: 'Lead created successfully',
        leadId: result.leadId,
        contactId: result.contactId,
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
}
