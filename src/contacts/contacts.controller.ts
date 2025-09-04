import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    try {
      const result = await this.contactsService.create(createContactDto);
      return {
        success: true,
        message: 'Contact created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create contact',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
