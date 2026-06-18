import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
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
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

type RequestWithUser = Request & {
  user: BasicUser;
};

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENTE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retorna os dados da home do usuario autenticado.',
  })
  @ApiOkResponse({
    description: 'Dados reais do usuario autenticado e da conta vinculada.',
    type: DashboardResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  @ApiForbiddenResponse({
    description: 'Usuario sem permissao para acessar este recurso.',
  })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado.' })
  getMe(@Req() request: RequestWithUser): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboardForUser(request.user.id);
  }
}
