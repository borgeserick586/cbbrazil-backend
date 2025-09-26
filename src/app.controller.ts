import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/')
  root() {
    return {
      message: 'CB Brazil Backend API',
      version: '1.0.0',
      status: 'running',
      docs: '/docs',
    };
  }
}
