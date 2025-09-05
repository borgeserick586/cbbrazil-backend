import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  // UTM Tracking Fields
  @IsString()
  @IsOptional()
  utm_content?: string;

  @IsString()
  @IsOptional()
  utm_medium?: string;

  @IsString()
  @IsOptional()
  utm_campaign?: string;

  @IsString()
  @IsOptional()
  utm_source?: string;

  @IsString()
  @IsOptional()
  utm_term?: string;

  @IsString()
  @IsOptional()
  utm_referrer?: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  @IsOptional()
  gclientid?: string;

  @IsString()
  @IsOptional()
  gclid?: string;

  @IsString()
  @IsOptional()
  fbclid?: string;

  // Business Fields
  @IsNumber()
  @IsOptional()
  banco?: number; // enum_id for Banco field

  @IsNumber()
  @IsOptional()
  produto?: number; // enum_id for Produto field

  @IsString()
  @IsOptional()
  contrato?: string;

  @IsString()
  @IsOptional()
  taxa_servico?: string;

  @IsNumber()
  @IsOptional()
  prazo?: number; // enum_id for Prazo field

  @IsString()
  @IsOptional()
  prestacao_servico?: string;

  @IsString()
  @IsOptional()
  comissao_banco?: string;

  @IsString()
  @IsOptional()
  repasse_parceiro?: string;

  @IsNumber()
  @IsOptional()
  associacao?: number; // enum_id for Associação field

  @IsNumber()
  @IsOptional()
  regime?: number; // enum_id for Regime field

  @IsString()
  @IsOptional()
  parcela?: string;

  @IsString()
  @IsOptional()
  margem?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  custom_fields?: any;
}
