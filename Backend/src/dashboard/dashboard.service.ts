import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardForUser(userId: string): Promise<DashboardResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        statusConta: true,
        conta: {
          select: {
            numero: true,
            saldo: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return {
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        tipo: user.tipo,
        statusConta: user.statusConta,
      },
      conta: user.conta
        ? {
            numero: user.conta.numero,
            saldo: user.conta.saldo.toNumber(),
            status: user.conta.status,
            dataCriacao: user.conta.createdAt,
          }
        : null,
    };
  }
}
