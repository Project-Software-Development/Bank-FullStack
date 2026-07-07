import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ConfiguracoesModule } from './configuracoes/configuracoes.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    NotificationsModule,
    ConfiguracoesModule,
    DashboardModule,
    TransacoesModule,
  ],
})
export class AppModule {}
