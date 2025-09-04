import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { KommoModule } from '../kommo/kommo.module';

@Module({
  imports: [SupabaseModule, KommoModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
