import { Module } from "@nestjs/common";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PrismaModule } from "../prisma/prisma.module";
import { TransacoesController } from "./transacoes.controller";
import { TransacoesService } from "./transacoes.service";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [TransacoesController],
  providers: [TransacoesService, RolesGuard],
})
export class TransacoesModule {}
