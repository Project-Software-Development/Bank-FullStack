import { ApiProperty } from '@nestjs/swagger';

export class ConfiguracoesContaDto {
  @ApiProperty({ example: '0f13db49-44a9-4cc8-b90f-5655489263bb' })
  id: string;

  @ApiProperty({ example: '00012345-6' })
  numero: string;

  @ApiProperty({ example: 1250.75 })
  saldo: number;

  @ApiProperty({ example: 'ATIVA' })
  status: string;

  @ApiProperty({ example: '2026-05-26T20:00:00.000Z' })
  createdAt: Date;
}

export class ConfiguracoesUsuarioDto {
  @ApiProperty({ example: '0f13db49-44a9-4cc8-b90f-5655489263aa' })
  id: string;

  @ApiProperty({ example: 'Maria Silva' })
  nome: string;

  @ApiProperty({ example: '12345678900' })
  cpf: string;

  @ApiProperty({ example: 'maria@email.com' })
  email: string;

  @ApiProperty({ example: '98999999999', nullable: true })
  telefone: string | null;

  @ApiProperty({ example: 'CLIENTE' })
  tipo: string;

  @ApiProperty({ example: 'ATIVO' })
  statusConta: string;

  @ApiProperty({ example: '2026-05-26T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({
    type: ConfiguracoesContaDto,
    nullable: true,
    description: 'Conta vinculada ao usuario, quando existir.',
  })
  conta: ConfiguracoesContaDto | null;
}

export class ConfiguracoesUsuariosMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 25 })
  total: number;
}

export class ListarUsuariosResponseDto {
  @ApiProperty({ type: [ConfiguracoesUsuarioDto] })
  data: ConfiguracoesUsuarioDto[];

  @ApiProperty({ type: ConfiguracoesUsuariosMetaDto })
  meta: ConfiguracoesUsuariosMetaDto;
}
