import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "../prisma/prisma.service";
import { BasicUser, JwtPayload } from "./auth.types";
import { Role } from "./enums/role.enum";
import { NotificationService } from "../notifications/notification.service";

@Injectable()
export class AuthService {
  private static readonly ACCOUNT_NUMBER_RETRY_LIMIT = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.findUserByEmailOrCpf(loginDto.emailOuCpf);

    if (!user) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    if (!this.isUserActive(user.statusConta)) {
      throw new ForbiddenException("Usuario inativo.");
    }

    const isPasswordValid = await bcrypt.compare(loginDto.senha, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    const basicUser = this.toBasicUser(user);

    await this.notificationService.notifyLogin(user.id);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      cpf: user.cpf,
      tipo: basicUser.tipo,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: basicUser,
    };
  }

  async register(registerDto: RegisterDto): Promise<BasicUser> {
    const email = registerDto.email.toLowerCase();
    const cpf = registerDto.cpf.replace(/\D/g, "");
    const telefone = registerDto.telefone?.replace(/\D/g, "");

    await this.ensureUserDoesNotExist(email, cpf);

    const senha = await bcrypt.hash(registerDto.senha, 10);

    for (
      let attempt = 0;
      attempt < AuthService.ACCOUNT_NUMBER_RETRY_LIMIT;
      attempt++
    ) {
      try {
        const user = await this.prisma.$transaction(async (tx) => {
          const createdUser = await tx.user.create({
            data: {
              nome: registerDto.nome.trim(),
              cpf,
              email,
              telefone,
              senha,
              tipo: Role.CLIENTE,
              statusConta: "ATIVO",
            },
          });

          const conta = await tx.conta.create({
            data: {
              numero: this.generateAccountNumber(),
              userId: createdUser.id,
            },
          });

          await this.notificationService.notifyAccountCreated(
            createdUser.id,
            conta.numero,
            tx,
          );

          return createdUser;
        });

        return this.toBasicUser(user);
      } catch (error) {
        if (this.isUniqueConstraintError(error, ["cpf", "email"])) {
          throw new ConflictException("CPF ou e-mail ja cadastrado.");
        }

        if (
          this.isUniqueConstraintError(error, ["numero"]) &&
          attempt < AuthService.ACCOUNT_NUMBER_RETRY_LIMIT - 1
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new ConflictException(
      "Nao foi possivel gerar numero de conta unico.",
    );
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
    const identifierAsCpf = identifier.replace(/\D/g, "");
    const email = identifier.toLowerCase();

    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: "insensitive" } },
          { email: { equals: email, mode: "insensitive" } },
          { cpf: identifier },
          ...(identifierAsCpf !== identifier ? [{ cpf: identifierAsCpf }] : []),
        ],
      },
    });
  }

  private async ensureUserDoesNotExist(email: string, cpf: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email, mode: "insensitive" } }, { cpf }],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException("CPF ou e-mail ja cadastrado.");
    }
  }

  private isUserActive(statusConta: string): boolean {
    return ["ATIVO", "ATIVA", "ACTIVE"].includes(statusConta.toUpperCase());
  }

  private generateAccountNumber(): string {
    const numericPart = String(Math.floor(10000000 + Math.random() * 90000000));
    const checksum = Number(numericPart) % 10;
    return `${numericPart}-${checksum}`;
  }

  private isUniqueConstraintError(
    error: unknown,
    possibleTargets: string[],
  ): boolean {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== "P2002"
    ) {
      return false;
    }

    const target = error.meta?.target;
    if (!Array.isArray(target)) {
      return false;
    }

    return possibleTargets.some((field) => target.includes(field));
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
      tipo: user.tipo as Role,
      statusConta: user.statusConta,
      createdAt: user.createdAt,
    };
  }
}
