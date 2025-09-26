import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({
    description: 'Nome completo do contato',
    example: 'Maria Souza',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail do contato',
    example: 'maria.souza@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Telefone do contato com DDI',
    example: '5511912345678',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Primeiro nome do contato',
    example: 'Maria',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Sobrenome do contato',
    example: 'Souza',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name?: string;
}
