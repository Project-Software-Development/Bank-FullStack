import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class ListarUsuariosQueryDto {
  @ApiPropertyOptional({
    example: 'maria',
    description: 'Busca por nome, e-mail ou CPF.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  busca?: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.CLIENTE,
    description: 'Filtra usuarios pelo tipo de perfil.',
  })
  @IsOptional()
  @IsIn(Object.values(Role))
  tipo?: Role;

  @ApiPropertyOptional({
    enum: ['ATIVO', 'INATIVO'],
    example: 'ATIVO',
    description: 'Filtra usuarios pelo status da conta.',
  })
  @IsOptional()
  @IsIn(['ATIVO', 'INATIVO'])
  statusConta?: string;

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    default: 1,
    description: 'Pagina desejada.',
  })
  @Transform(({ value }) => Number(value ?? 1))
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    description: 'Quantidade de usuarios por pagina.',
  })
  @Transform(({ value }) => Number(value ?? 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
