import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'cliente@email.com',
    description: 'E-mail ou CPF do usuario.',
  })
  @IsString()
  @IsNotEmpty()
  emailOuCpf: string;

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
