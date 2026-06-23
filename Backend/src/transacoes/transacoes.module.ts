import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransacoesController],
  providers: [TransacoesService, RolesGuard],
})
export class TransacoesModule {}
