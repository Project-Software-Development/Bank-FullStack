import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { BasicUser } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type RequestWithUser = Request & {
  user: BasicUser;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autentica usuario por e-mail ou CPF.' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login realizado com sucesso.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '0f13db49-44a9-4cc8-b90f-5655489263aa',
          nome: 'Maria Silva',
          cpf: '12345678900',
          email: 'maria@email.com',
          telefone: '98999999999',
          tipo: 'CLIENTE',
          statusConta: 'ATIVO',
          createdAt: '2026-05-26T20:00:00.000Z',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais invalidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retorna os dados do usuario autenticado.' })
  @ApiOkResponse({
    description: 'Dados do usuario autenticado.',
    schema: {
      example: {
        id: '0f13db49-44a9-4cc8-b90f-5655489263aa',
        nome: 'Maria Silva',
        cpf: '12345678900',
        email: 'maria@email.com',
        telefone: '98999999999',
        tipo: 'CLIENTE',
        statusConta: 'ATIVO',
        createdAt: '2026-05-26T20:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  me(@Req() request: RequestWithUser) {
    return request.user;
  }
}
