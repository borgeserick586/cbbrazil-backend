import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Nome completo do lead',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail do lead',
    example: 'joao.silva@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefone do lead com DDI',
    example: '5511987654321',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Origem do lead (ex: 'Website', 'Facebook Ads')",
    example: 'Website',
  })
  @IsString()
  @IsNotEmpty()
  source: string;

  // UTM Tracking Fields
  @ApiProperty({ required: false, description: 'Conteúdo da campanha UTM' })
  @IsString()
  @IsOptional()
  utm_content?: string;

  @ApiProperty({ required: false, description: 'Meio da campanha UTM' })
  @IsString()
  @IsOptional()
  utm_medium?: string;

  @ApiProperty({ required: false, description: 'Nome da campanha UTM' })
  @IsString()
  @IsOptional()
  utm_campaign?: string;

  @ApiProperty({ required: false, description: 'Origem da campanha UTM' })
  @IsString()
  @IsOptional()
  utm_source?: string;

  @ApiProperty({ required: false, description: 'Termo da campanha UTM' })
  @IsString()
  @IsOptional()
  utm_term?: string;

  @ApiProperty({ required: false, description: 'URL de referência' })
  @IsString()
  @IsOptional()
  utm_referrer?: string;

  @ApiProperty({ required: false, description: 'URL de referência' })
  @IsString()
  @IsOptional()
  referrer?: string;

  @ApiProperty({ required: false, description: 'ID de cliente do Google' })
  @IsString()
  @IsOptional()
  gclientid?: string;

  @ApiProperty({ required: false, description: 'ID de clique do Google Ads' })
  @IsString()
  @IsOptional()
  gclid?: string;

  @ApiProperty({ required: false, description: 'ID de clique do Facebook Ads' })
  @IsString()
  @IsOptional()
  fbclid?: string;

  // Business Fields
  @ApiProperty({
    required: false,
    description: 'ID do enum para o campo "Banco" no Kommo',
    example: 12345,
  })
  @IsNumber()
  @IsOptional()
  banco?: number;

  @ApiProperty({
    required: false,
    description: 'ID do enum para o campo "Produto" no Kommo',
    example: 67890,
  })
  @IsNumber()
  @IsOptional()
  produto?: number;

  @ApiProperty({ required: false, example: 'CTR-998877' })
  @IsString()
  @IsOptional()
  contrato?: string;

  @ApiProperty({ required: false, example: '5.5' })
  @IsString()
  @IsOptional()
  taxa_servico?: string;

  @ApiProperty({
    required: false,
    description: 'ID do enum para o campo "Prazo" no Kommo',
    example: 11223,
  })
  @IsNumber()
  @IsOptional()
  prazo?: number;

  @ApiProperty({ required: false, example: '1200.00' })
  @IsString()
  @IsOptional()
  prestacao_servico?: string;

  @ApiProperty({ required: false, example: '150.00' })
  @IsString()
  @IsOptional()
  comissao_banco?: string;

  @ApiProperty({ required: false, example: '100.00' })
  @IsString()
  @IsOptional()
  repasse_parceiro?: string;

  @ApiProperty({
    required: false,
    description: 'ID do enum para o campo "Associação" no Kommo',
    example: 33445,
  })
  @IsNumber()
  @IsOptional()
  associacao?: number;

  @ApiProperty({
    required: false,
    description: 'ID do enum para o campo "Regime" no Kommo',
    example: 55667,
  })
  @IsNumber()
  @IsOptional()
  regime?: number;

  @ApiProperty({ required: false, example: '850.75' })
  @IsString()
  @IsOptional()
  parcela?: string;

  @ApiProperty({ required: false, example: '300.00' })
  @IsString()
  @IsOptional()
  margem?: string;

  @ApiProperty({
    required: false,
    description: 'Status inicial do lead',
    example: 'new_lead',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Objeto para campos customizados não mapeados',
    example: { custom_field_1: 'value1' },
  })
  @IsObject()
  @IsOptional()
  custom_fields?: any;
}
