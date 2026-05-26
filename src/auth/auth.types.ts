export type BasicUser = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string | null;
  tipo: string;
  statusConta: string;
  createdAt: Date;
};

export type JwtPayload = {
  sub: string;
  email: string;
  cpf: string;
  tipo: string;
};
