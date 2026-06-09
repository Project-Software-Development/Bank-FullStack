import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Maria Silva',
    description: 'Nome completo do usuario.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: '12345678900',
    description: 'CPF do usuario. Pode ser enviado com ou sem pontuacao.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 digitos.' })
  cpf: string;

  @ApiProperty({
    example: 'maria@email.com',
    description: 'E-mail do usuario.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '98999999999',
    description: 'Telefone do usuario. Pode ser enviado com ou sem pontuacao.',
  })
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    const telefone = value.replace(/\D/g, '');
    return telefone.length > 0 ? telefone : undefined;
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 digitos.',
  })
  telefone?: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuario.',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;
}
