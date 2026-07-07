import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ConfiguracoesController } from "./configuracoes.controller";
import { ConfiguracoesService } from "./configuracoes.service";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [ConfiguracoesController],
  providers: [ConfiguracoesService],
})
export class ConfiguracoesModule {}
