import { Role } from './enums/role.enum';

export type BasicUser = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string | null;
  tipo: Role;
  statusConta: string;
  createdAt: Date;
};

export type JwtPayload = {
  sub: string;
  email: string;
  cpf: string;
  tipo: Role;
};
