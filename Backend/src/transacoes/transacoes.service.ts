import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TransferenciaDto } from './dto/transferencia.dto';

@Injectable()
export class TransacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async historico(userId: string) {
    const conta = await this.prisma.conta.findUnique({
      where: { userId },
      select: {
        id: true,
        numero: true,
      },
    });

    if (!conta) {
      throw new NotFoundException('Conta do usuario nao encontrada.');
    }

    const transacoes = await this.prisma.transacao.findMany({
      where: {
        OR: [{ contaOrigemId: conta.id }, { contaDestinoId: conta.id }],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      select: {
        id: true,
        tipo: true,
        valor: true,
        descricao: true,
        createdAt: true,
        contaOrigemId: true,
        contaDestinoId: true,
        contaOrigem: {
          select: {
            numero: true,
          },
        },
        contaDestino: {
          select: {
            numero: true,
          },
        },
      },
    });

    return {
      contaNumero: conta.numero,
      itens: transacoes.map((transacao) => {
        const isSaida = transacao.contaOrigemId === conta.id;
        const contaContraparte = isSaida
          ? transacao.contaDestino.numero
          : transacao.contaOrigem.numero;

        return {
          id: transacao.id,
          tipo: transacao.tipo,
          direcao: isSaida ? 'SAIDA' : 'ENTRADA',
          valor: transacao.valor.toNumber(),
          contaContraparte,
          descricao:
            transacao.descricao ??
            `${isSaida ? 'Transferencia para' : 'Transferencia recebida de'} ${contaContraparte}`,
          data: transacao.createdAt,
        };
      }),
    };
  }

  async transferir(userId: string, transferenciaDto: TransferenciaDto) {
    const valor = new Prisma.Decimal(transferenciaDto.valor);

    if (valor.lte(0)) {
      throw new BadRequestException('Valor da transferencia deve ser maior que zero.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const contaOrigem = await tx.conta.findUnique({
        where: { userId },
        select: {
          id: true,
          numero: true,
          saldo: true,
          status: true,
        },
      });

      if (!contaOrigem) {
        throw new NotFoundException('Conta de origem nao encontrada.');
      }

      if (contaOrigem.status.toUpperCase() !== 'ATIVA') {
        throw new BadRequestException('Conta de origem inativa.');
      }

      const contaDestino = await tx.conta.findUnique({
        where: { numero: transferenciaDto.contaDestinoNumero.trim() },
        select: {
          id: true,
          numero: true,
          status: true,
        },
      });

      if (!contaDestino) {
        throw new NotFoundException('Conta destino nao encontrada.');
      }

      if (contaDestino.status.toUpperCase() !== 'ATIVA') {
        throw new BadRequestException('Conta destino inativa.');
      }

      if (contaOrigem.id === contaDestino.id) {
        throw new BadRequestException('Conta destino deve ser diferente da conta de origem.');
      }

      const debitoResult = await tx.conta.updateMany({
        where: {
          id: contaOrigem.id,
          saldo: {
            gte: valor,
          },
        },
        data: {
          saldo: {
            decrement: valor,
          },
        },
      });

      if (debitoResult.count === 0) {
        throw new BadRequestException('Saldo insuficiente para transferencia.');
      }

      await tx.conta.update({
        where: { id: contaDestino.id },
        data: {
          saldo: {
            increment: valor,
          },
        },
      });

      const transacao = await tx.transacao.create({
        data: {
          tipo: 'TRANSFERENCIA',
          valor,
          contaOrigemId: contaOrigem.id,
          contaDestinoId: contaDestino.id,
          descricao: `Transferencia para conta ${contaDestino.numero}`,
        },
      });

      const contaOrigemAtualizada = await tx.conta.findUnique({
        where: { id: contaOrigem.id },
        select: {
          numero: true,
          saldo: true,
        },
      });

      return {
        transacaoId: transacao.id,
        contaOrigemNumero: contaOrigem.numero,
        contaDestinoNumero: contaDestino.numero,
        valor: valor.toNumber(),
        saldoAtualOrigem: contaOrigemAtualizada?.saldo.toNumber() ?? 0,
      };
    });

    return {
      mensagem: 'Transferencia realizada com sucesso.',
      ...result,
    };
  }
}
