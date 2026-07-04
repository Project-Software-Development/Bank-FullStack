import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNotificationDot } from "./dto/create-notification.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createNotificationDot: CreateNotificationDot) {
    return this.prisma.notification.create({
      data: {
        userId,
        title: createNotificationDot.title,
        body: createNotificationDot.body,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteOne(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException("Notificação não encontrada.");
    }

    await this.prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });
  }

  async deleteAll(userId: string) {
    await this.prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  }
}
