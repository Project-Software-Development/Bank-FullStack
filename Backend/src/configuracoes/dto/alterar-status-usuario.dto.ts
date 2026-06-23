import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const STATUS_USUARIO = ['ATIVO', 'BLOQUEADO', 'INATIVO'] as const;

export type StatusUsuario = (typeof STATUS_USUARIO)[number];

export class AlterarStatusUsuarioDto {
  @ApiProperty({
    enum: STATUS_USUARIO,
    example: 'BLOQUEADO',
    description: 'Novo status administrativo do usuario.',
  })
  @IsIn(STATUS_USUARIO)
  statusConta: StatusUsuario;
}
