import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KommoService } from './kommo.service';

@Module({
  imports: [HttpModule],
  providers: [KommoService],
  exports: [KommoService],
})
export class KommoModule {}
