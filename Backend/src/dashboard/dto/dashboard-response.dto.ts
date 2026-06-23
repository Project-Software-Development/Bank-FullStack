import { ApiProperty } from '@nestjs/swagger';

export class DashboardUsuarioDto {
  @ApiProperty({ example: '0f13db49-44a9-4cc8-b90f-5655489263aa' })
  id: string;

  @ApiProperty({ example: 'Maria Silva' })
  nome: string;

  @ApiProperty({ example: 'maria@email.com' })
  email: string;

  @ApiProperty({ example: '12345678900' })
  cpf: string;

  @ApiProperty({ example: 'CLIENTE' })
  tipo: string;

  @ApiProperty({ example: 'ATIVO' })
  statusConta: string;
}

export class DashboardContaDto {
  @ApiProperty({ example: '00012345-6' })
  numero: string;

  @ApiProperty({ example: 1250.75 })
  saldo: number;

  @ApiProperty({ example: 'ATIVA' })
  status: string;

  @ApiProperty({ example: '2026-05-26T20:00:00.000Z' })
  dataCriacao: Date;
}

export class DashboardResponseDto {
  @ApiProperty({ type: DashboardUsuarioDto })
  usuario: DashboardUsuarioDto;

  @ApiProperty({
    type: DashboardContaDto,
    nullable: true,
    description:
      'Dados da conta vinculada ao usuario. Retorna null enquanto nao houver conta cadastrada para o usuario.',
  })
  conta: DashboardContaDto | null;
}
