import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createNotificationDto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title: createNotificationDto.title,
        body: createNotificationDto.body,
      },
      select: {
        id: true,
        title: true,
        body: true,
        createdAt: true,
      },
    });

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
        createdAt: true,
      },
    });

    return {
      total: notifications.length,
      data: notifications,
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
}
