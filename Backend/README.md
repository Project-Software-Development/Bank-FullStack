# API Banco Digital

Backend em NestJS com TypeScript, Prisma, PostgreSQL, JWT, bcrypt e Swagger.

Esta versao entrega os fluxos necessarios para o frontend implementar:

- Cadastro de usuarios clientes.
- Login por e-mail ou CPF.
- Consulta do usuario autenticado pelo token JWT.

## Tecnologias

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Passport
- bcrypt
- Swagger/OpenAPI

## Como Rodar o Projeto

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Configure as variaveis de ambiente:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/api_banco_digital?schema=public"
JWT_SECRET="troque-este-segredo-em-producao"
FRONTEND_ORIGIN="http://localhost:5173"
```

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Sincronize o schema Prisma com o banco local:

```bash
npx prisma db push
```

Inicie a aplicacao em desenvolvimento:

```bash
npm run start:dev
```

A API fica disponivel em:

```text
http://localhost:3000
```

A documentacao Swagger fica em:

```text
http://localhost:3000/api/docs
```

## CORS

O backend esta com CORS habilitado para permitir chamadas do frontend em outra porta, por exemplo:

```text
http://localhost:5173
http://localhost:3001
```

## Modelo de Usuario
Tabela `User` usada pelo Prisma:
| Campo           | Tipo      | Observacao                                      |
| --------------- | --------- | ----------------------------------------------- |
| `id`            | `String`  | UUID gerado automaticamente.                    |
| `nome`          | `String`  | Nome do usuario.                                |
| `cpf`           | `String`  | Unico. Usado tambem no login.                   |
| `email`         | `String`  | Unico. Usado tambem no login.                   |
| `telefone`      | `String?` | Opcional.                                       |
| `senha`         | `String`  | Salva criptografada com bcrypt.                 |
| `tipo`          | `String`  | Novos cadastros recebem `CLIENTE`.              |
| `statusConta`   | `String`  | Novos cadastros recebem `ATIVO`.                |
| `createdAt`     | `DateTime`| Data de criacao.                                |

Importante: o campo `senha` nunca e retornado nas respostas da API.

## Endpoints Para o Frontend

### POST `/auth/register`

Cadastra um novo usuario cliente.

Body:

```json
{
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "email": "maria@email.com",
  "telefone": "98999999999",
  "senha": "senha123"
}
```

Regras:

- `nome` e obrigatorio.
- `cpf` e obrigatorio e deve ter 11 digitos.
- `cpf` pode ser enviado com ou sem pontuacao.
- `email` e obrigatorio e deve ser valido.
- `email` e salvo em letras minusculas.
- `telefone` e opcional.
- `telefone` pode ser enviado com ou sem pontuacao.
- `senha` e obrigatoria e deve ter pelo menos 6 caracteres.
- CPF e e-mail nao podem estar cadastrados.
- A senha e criptografada antes de salvar.
- O usuario criado recebe `tipo: "CLIENTE"` e `statusConta: "ATIVO"`.

Resposta de sucesso, status `201`:

```json
{
  "id": "0f13db49-44a9-4cc8-b90f-5655489263aa",
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "email": "maria@email.com",
  "telefone": "98999999999",
  "tipo": "CLIENTE",
  "statusConta": "ATIVO",
  "createdAt": "2026-05-26T20:00:00.000Z"
}
```

Erros esperados:

| Status | Quando acontece                         |
| ------ | --------------------------------------- |
| `400`  | Campos invalidos ou faltando.           |
| `409`  | CPF ou e-mail ja cadastrado.            |
| `500`  | Erro inesperado no servidor ou banco.   |

Exemplo para o frontend:

```ts
const response = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome: 'Maria Silva',
    cpf: '12345678900',
    email: 'maria@email.com',
    telefone: '98999999999',
    senha: 'senha123',
  }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message ?? 'Erro ao cadastrar usuario.');
}
```

### POST `/auth/login`

Autentica um usuario por e-mail ou CPF.

Body:

```json
{
  "emailOuCpf": "cliente@email.com",
  "senha": "senha123"
}
```

Resposta de sucesso, status `200`:

```json
{
  "accessToken": "token.jwt.aqui",
  "user": {
    "id": "0f13db49-44a9-4cc8-b90f-5655489263aa",
    "nome": "Maria Silva",
    "cpf": "12345678900",
    "email": "maria@email.com",
    "telefone": "98999999999",
    "tipo": "CLIENTE",
    "statusConta": "ATIVO",
    "createdAt": "2026-05-26T20:00:00.000Z"
  }
}
```

Erros esperados:

| Status | Quando acontece              |
| ------ | ---------------------------- |
| `400`  | Body invalido.               |
| `401`  | E-mail/CPF ou senha invalidos. |
| `403`  | Usuario existe, mas esta inativo. |

Exemplo para o frontend:

```ts
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    emailOuCpf: 'cliente@email.com',
    senha: 'senha123',
  }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message ?? 'Erro ao fazer login.');
}

localStorage.setItem('accessToken', data.accessToken);
```

### GET `/auth/me`

Retorna os dados do usuario autenticado.

Header obrigatorio:

```http
Authorization: Bearer seu_token_jwt
```

Resposta de sucesso, status `200`:

```json
{
  "id": "0f13db49-44a9-4cc8-b90f-5655489263aa",
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "email": "maria@email.com",
  "telefone": "98999999999",
  "tipo": "CLIENTE",
  "statusConta": "ATIVO",
  "createdAt": "2026-05-26T20:00:00.000Z"
}
```

Erro esperado:

| Status | Quando acontece           |
| ------ | ------------------------- |
| `401`  | Token ausente ou invalido. |

Exemplo para o frontend:

```ts
const token = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const user = await response.json();
```

## Observacoes Para a Tela de Cadastro

Fluxo recomendado:

1. Usuario preenche nome, CPF, e-mail, telefone opcional e senha.
2. Frontend chama `POST /auth/register`.
3. Se receber `201`, mostrar sucesso e redirecionar para login.
4. Se receber `409`, mostrar que CPF ou e-mail ja esta cadastrado.
5. Se receber `400`, mostrar erro de validacao.
6. Depois do cadastro, o usuario pode fazer login em `POST /auth/login`.

O cadastro nao faz login automaticamente. A tela de login continua sendo responsavel por obter e salvar o token JWT.

## Scripts Disponiveis

| Script                    | Descricao                                             |
| ------------------------- | ----------------------------------------------------- |
| `npm run start`           | Inicia a aplicacao.                                   |
| `npm run start:dev`       | Inicia a aplicacao em modo desenvolvimento com watch. |
| `npm run build`           | Compila o projeto.                                    |
| `npm run start:prod`      | Executa a versao compilada em `dist`.                 |
| `npm run prisma:generate` | Gera o Prisma Client.                                 |
| `npm run format`          | Formata arquivos TypeScript e Prisma com Prettier.    |
