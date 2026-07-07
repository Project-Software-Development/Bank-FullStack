import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

type NotificationClient = PrismaService | Prisma.TransactionClient;
type SystemNotification = {
  userId: string;
  title: string;
  body: string;
};

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createNotificationDto: CreateNotificationDto) {
    const notification = await this.createSystemNotification(
      userId,
      createNotificationDto.title,
      createNotificationDto.body,
    );

    return {
      message: "Notificacao criada com sucesso.",
      data: notification,
    };
  }

  async findAll(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        body: true,
        lida: true,
        createdAt: true,
      },
    });

    return {
      total: notifications.length,
      data: notifications,
    };
  }

  async updateReadStatus(userId: string, notificationId: string, lida: boolean) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        lida,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException("Notificacao nao encontrada.");
    }

    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
      select: {
        id: true,
        title: true,
        body: true,
        lida: true,
        createdAt: true,
      },
    });

    return {
      message: lida
        ? "Notificacao marcada como lida."
        : "Notificacao marcada como nao lida.",
      data: notification,
    };
  }

  async deleteOne(userId: string, notificationId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException("Notificacao nao encontrada.");
    }

    return {
      message: "Notificacao excluida com sucesso.",
      deletedId: notificationId,
    };
  }

  async deleteAll(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        userId,
      },
    });

    return {
      message: "Notificacoes excluidas com sucesso.",
      deletedCount: result.count,
    };
  }

  async notifyAccountCreated(
    userId: string,
    accountNumber: string,
    tx?: Prisma.TransactionClient,
  ) {
    return this.createSystemNotification(
      userId,
      "Conta criada",
      `Sua conta ${accountNumber} foi criada com sucesso.`,
      tx,
    );
  }

  async notifyLogin(userId: string, tx?: Prisma.TransactionClient) {
    return this.createSystemNotification(
      userId,
      "Login realizado",
      "Um novo acesso foi realizado na sua conta.",
      tx,
    );
  }

  async notifyTransferCompleted(
    params: {
      senderUserId: string;
      receiverUserId: string;
      senderAccountNumber: string;
      receiverAccountNumber: string;
      amount: Prisma.Decimal | number | string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const formattedAmount = this.formatCurrency(params.amount);

    return this.createManySystemNotifications(
      [
        {
          userId: params.senderUserId,
          title: "Transferencia enviada",
          body: `Voce enviou ${formattedAmount} para a conta ${params.receiverAccountNumber}.`,
        },
        {
          userId: params.receiverUserId,
          title: "Transferencia recebida",
          body: `Voce recebeu ${formattedAmount} da conta ${params.senderAccountNumber}.`,
        },
      ],
      tx,
    );
  }

  async notifyAccountStatusChanged(
    userId: string,
    statusConta: string,
    tx?: Prisma.TransactionClient,
  ) {
    return this.createSystemNotification(
      userId,
      "Status da conta alterado",
      `O status da sua conta foi alterado para ${statusConta}.`,
      tx,
    );
  }

  private async createSystemNotification(
    userId: string,
    title: string,
    body: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = this.getClient(tx);

    return client.notification.create({
      data: {
        userId,
        title,
        body,
      },
      select: {
        id: true,
        title: true,
        body: true,
        lida: true,
        createdAt: true,
      },
    });
  }

  private async createManySystemNotifications(
    notifications: SystemNotification[],
    tx?: Prisma.TransactionClient,
  ) {
    if (notifications.length === 0) {
      return { count: 0 };
    }

    const client = this.getClient(tx);

    return client.notification.createMany({
      data: notifications,
    });
  }

  private getClient(tx?: Prisma.TransactionClient): NotificationClient {
    return tx ?? this.prisma;
  }

  private formatCurrency(value: Prisma.Decimal | number | string): string {
    const numericValue =
      typeof value === "number" ? value : Number(value.toString());

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  }
}
