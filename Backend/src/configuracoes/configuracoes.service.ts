import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AlterarStatusUsuarioDto } from './dto/alterar-status-usuario.dto';
import { ConfiguracoesUsuarioDto } from './dto/configuracoes-usuario-response.dto';
import { ListarUsuariosQueryDto } from './dto/listar-usuarios-query.dto';

const usuarioSelect = {
  id: true,
  nome: true,
  cpf: true,
  email: true,
  telefone: true,
  tipo: true,
  statusConta: true,
  createdAt: true,
  conta: {
    select: {
      id: true,
      numero: true,
      saldo: true,
      status: true,
      createdAt: true,
    },
  },
} satisfies Prisma.UserSelect;

type UsuarioComConta = Prisma.UserGetPayload<{
  select: typeof usuarioSelect;
}>;

@Injectable()
export class ConfiguracoesService {
  constructor(private readonly prisma: PrismaService) {}

  async listarUsuarios(query: ListarUsuariosQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = this.buildUsuarioWhere(query);

    const [usuarios, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: usuarioSelect,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: usuarios.map((usuario) => this.mapUsuario(usuario)),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async buscarUsuarioPorId(id: string): Promise<ConfiguracoesUsuarioDto> {
    const usuario = await this.prisma.user.findUnique({
      where: { id },
      select: usuarioSelect,
    });

    if (!usuario) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return this.mapUsuario(usuario);
  }

  async alterarStatusUsuario(
    id: string,
    alterarStatusUsuarioDto: AlterarStatusUsuarioDto,
  ): Promise<ConfiguracoesUsuarioDto> {
    const usuario = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        conta: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    const contaStatus = this.getContaStatusFromUsuarioStatus(
      alterarStatusUsuarioDto.statusConta,
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          statusConta: alterarStatusUsuarioDto.statusConta,
        },
      });

      if (usuario.conta && contaStatus) {
        await tx.conta.update({
          where: { id: usuario.conta.id },
          data: {
            status: contaStatus,
          },
        });
      }
    });

    return this.buscarUsuarioPorId(id);
  }

  private buildUsuarioWhere(
    query: ListarUsuariosQueryDto,
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (query.tipo) {
      where.tipo = query.tipo;
    }

    if (query.statusConta) {
      where.statusConta = query.statusConta;
    }

    if (query.busca) {
      where.OR = [
        { nome: { contains: query.busca, mode: 'insensitive' } },
        { email: { contains: query.busca, mode: 'insensitive' } },
        { cpf: { contains: query.busca } },
      ];
    }

    return where;
  }

  private getContaStatusFromUsuarioStatus(statusConta: string): string | null {
    if (statusConta === 'ATIVO') {
      return 'ATIVA';
    }

    if (statusConta === 'BLOQUEADO') {
      return 'BLOQUEADA';
    }

    if (statusConta === 'INATIVO') {
      return 'INATIVA';
    }

    return null;
  }

  private mapUsuario(usuario: UsuarioComConta): ConfiguracoesUsuarioDto {
    return {
      id: usuario.id,
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      telefone: usuario.telefone,
      tipo: usuario.tipo,
      statusConta: usuario.statusConta,
      createdAt: usuario.createdAt,
      conta: usuario.conta
        ? {
            id: usuario.conta.id,
            numero: usuario.conta.numero,
            saldo: usuario.conta.saldo.toNumber(),
            status: usuario.conta.status,
            createdAt: usuario.conta.createdAt,
          }
        : null,
    };
  }
}
