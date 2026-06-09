import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BasicUser, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.findUserByEmailOrCpf(loginDto.emailOuCpf);

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    if (!this.isUserActive(user.statusConta)) {
      throw new ForbiddenException('Usuario inativo.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.senha, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const basicUser = this.toBasicUser(user);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      cpf: user.cpf,
      tipo: user.tipo,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: basicUser,
    };
  }

  async register(registerDto: RegisterDto): Promise<BasicUser> {
    const email = registerDto.email.toLowerCase();
    const cpf = registerDto.cpf.replace(/\D/g, '');
    const telefone = registerDto.telefone?.replace(/\D/g, '');

    await this.ensureUserDoesNotExist(email, cpf);

    const senha = await bcrypt.hash(registerDto.senha, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          nome: registerDto.nome.trim(),
          cpf,
          email,
          telefone,
          senha,
          tipo: 'CLIENTE',
          statusConta: 'ATIVO',
        },
      });

      return this.toBasicUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('CPF ou e-mail ja cadastrado.');
      }

      throw error;
    }
  }

  async findById(id: string): Promise<BasicUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || !this.isUserActive(user.statusConta)) {
      return null;
    }

    return this.toBasicUser(user);
  }

  private async findUserByEmailOrCpf(emailOuCpf: string) {
    const identifier = emailOuCpf.trim();
    const identifierAsCpf = identifier.replace(/\D/g, '');
    const email = identifier.toLowerCase();

    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: 'insensitive' } },
          { email: { equals: email, mode: 'insensitive' } },
          { cpf: identifier },
          ...(identifierAsCpf !== identifier ? [{ cpf: identifierAsCpf }] : []),
        ],
      },
    });
  }

  private async ensureUserDoesNotExist(email: string, cpf: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email, mode: 'insensitive' } }, { cpf }],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException('CPF ou e-mail ja cadastrado.');
    }
  }

  private isUserActive(statusConta: string): boolean {
    return ['ATIVO', 'ATIVA', 'ACTIVE'].includes(statusConta.toUpperCase());
  }

  private toBasicUser(user: {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    telefone: string | null;
    tipo: string;
    statusConta: string;
    createdAt: Date;
  }): BasicUser {
    return {
      id: user.id,
      nome: user.nome,
      cpf: user.cpf,
      email: user.email,
      telefone: user.telefone,
      tipo: user.tipo,
      statusConta: user.statusConta,
      createdAt: user.createdAt,
    };
  }
}
