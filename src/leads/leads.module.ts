import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { KommoModule } from '../kommo/kommo.module';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports: [SupabaseModule, KommoModule, ContactsModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
