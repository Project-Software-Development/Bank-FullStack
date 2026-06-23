import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { BasicUser } from '../auth/auth.types';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TransferenciaDto } from './dto/transferencia.dto';
import { TransacoesService } from './transacoes.service';

type RequestWithUser = Request & {
  user: BasicUser;
};

@ApiTags('Transacoes')
@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Get('historico')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENTE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retorna historico de transacoes da conta autenticada.' })
  @ApiOkResponse({
    description: 'Historico retornado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Conta do usuario nao encontrada.',
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  historico(@Req() request: RequestWithUser) {
    return this.transacoesService.historico(request.user.id);
  }

  @Post('transferir')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENTE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Realiza transferencia monetaria entre contas.' })
  @ApiOkResponse({
    description: 'Transferencia realizada com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Valor invalido, saldo insuficiente ou conta inativa.',
  })
  @ApiNotFoundResponse({
    description: 'Conta de origem ou destino nao encontrada.',
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  transferir(
    @Req() request: RequestWithUser,
    @Body() transferenciaDto: TransferenciaDto,
  ) {
    return this.transacoesService.transferir(request.user.id, transferenciaDto);
  }
}
