# Backend - API Banco Digital

API desenvolvida em NestJS para autenticar usuários, gerenciar contas, executar transferências internas, registrar transações, emitir notificações e oferecer rotas administrativas de usuários.

## Stack

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Passport
- bcrypt
- Swagger/OpenAPI
- class-validator

## Requisitos

- Node.js compatível com o projeto
- npm
- PostgreSQL em execução

## Configuração

Instale as dependências:

```bash
npm install
```

Crie o `.env` a partir do exemplo:

```bash
copy .env.example .env
```

Variáveis esperadas:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/BancoDigital"
JWT_SECRET="change-this-secret"
FRONTEND_ORIGIN="http://localhost:5173"
PORT=3000
```

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão com o PostgreSQL. |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT. |
| `FRONTEND_ORIGIN` | Origem liberada no CORS para o frontend. |
| `PORT` | Porta da API. O padrão usado pelo projeto é `3000`. |

## Banco de dados

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Aplique as migrations no banco local:

```bash
npm run prisma:updatedb
```

As migrations ficam em:

```text
prisma/migrations
```

## Como rodar

Desenvolvimento com watch:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Produção local após build:

```bash
npm run start:prod
```

API:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api/docs
```

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run start` | Inicia a aplicação NestJS. |
| `npm run start:dev` | Inicia a aplicação em modo desenvolvimento com watch. |
| `npm run build` | Compila o projeto. |
| `npm run start:prod` | Executa `dist/main`. |
| `npm run prisma:generate` | Gera o Prisma Client. |
| `npm run prisma:updatedb` | Executa `prisma migrate dev`. |
| `npm run format` | Formata arquivos TypeScript e Prisma com Prettier. |

## Modelos Prisma

| Modelo | Responsabilidade |
| --- | --- |
| `User` | Dados de autenticação, perfil, CPF, e-mail, telefone e status da conta. |
| `Conta` | Número único, saldo, status e vínculo 1:1 com usuário. |
| `Transacao` | Registro de transferências entre conta de origem e conta de destino. |
| `Notification` | Notificações do usuário, com status `lida` ou `não lida`. |

## Perfis e autenticação

Os perfis usados pelo backend são:

- `CLIENTE`
- `ADMINISTRADOR`

O cadastro público cria usuários do tipo `CLIENTE` com `statusConta` igual a `ATIVO`. Durante o cadastro, o backend também cria uma `Conta` vinculada ao usuário.

Rotas protegidas exigem:

```http
Authorization: Bearer seu_token_jwt
```

## Endpoints

### Auth

#### `POST /auth/register`

Cadastra um cliente.

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

Regras principais:

- `cpf` deve ter 11 dígitos.
- `email` deve ser válido e único.
- `senha` deve ter pelo menos 6 caracteres.
- `telefone` é opcional e deve ter 10 ou 11 dígitos quando informado.

#### `POST /auth/login`

Autentica por e-mail ou CPF.

Body:

```json
{
  "emailOuCpf": "maria@email.com",
  "senha": "senha123"
}
```

A resposta inclui `accessToken` e dados básicos do usuário.

#### `GET /auth/me`

Retorna o usuário autenticado pelo token JWT.

### Dashboard

#### `GET /dashboard/me`

Retorna dados do usuário e da conta vinculada.

Exemplo de resposta:

```json
{
  "usuario": {
    "id": "uuid",
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cpf": "12345678900",
    "tipo": "CLIENTE",
    "statusConta": "ATIVO"
  },
  "conta": {
    "numero": "123456",
    "saldo": 100,
    "status": "ATIVA",
    "dataCriacao": "2026-07-07T12:00:00.000Z"
  }
}
```

### Transações

#### `GET /transacoes/historico`

Retorna as últimas movimentações da conta autenticada.

#### `POST /transacoes/transferir`

Realiza transferência entre duas contas internas do sistema.

Body:

```json
{
  "contaDestinoNumero": "654321",
  "valor": 50
}
```

Regras principais:

- o valor deve ser maior que zero;
- a conta de origem deve existir e estar ativa;
- a conta de destino deve existir e estar ativa;
- a conta de destino deve ser diferente da origem;
- a origem precisa ter saldo suficiente.

Ao concluir a transferência, o backend registra a transação, atualiza os saldos e cria notificações para os usuários envolvidos.

### Notificações

#### `POST /notifications`

Cria uma notificação para o usuário autenticado.

Body:

```json
{
  "title": "Transferência recebida",
  "body": "Você recebeu R$ 50,00."
}
```

#### `GET /notifications`

Lista as notificações do usuário autenticado.

#### `PATCH /notifications/:id/status`

Marca uma notificação como lida ou não lida.

Body:

```json
{
  "lida": true
}
```

#### `DELETE /notifications/:id`

Apaga uma notificação do usuário autenticado.

#### `DELETE /notifications`

Apaga todas as notificações do usuário autenticado.

### Configurações

Rotas restritas ao perfil `ADMINISTRADOR`.

#### `GET /configuracoes/usuarios`

Lista usuários com filtros e paginação.

Query params aceitos:

- `busca`: busca por nome, e-mail ou CPF.
- `tipo`: `CLIENTE` ou `ADMINISTRADOR`.
- `statusConta`: `ATIVO` ou `INATIVO`.
- `page`: página atual.
- `limit`: quantidade por página.

#### `GET /configuracoes/usuarios/:id`

Retorna detalhes de um usuário.

#### `PATCH /configuracoes/usuarios/:id/status`

Altera o status administrativo do usuário.

Body:

```json
{
  "statusConta": "INATIVO"
}
```

#### `DELETE /configuracoes/usuarios/:id`

Exclui um usuário.

## Validação rápida

Com o `.env` configurado e o banco disponível:

```bash
npm run prisma:generate
npm run prisma:updatedb
npm run build
```

## Observações

- O campo `senha` não deve ser retornado nas respostas da API.
- O frontend usa `token` no `localStorage`; a API espera o token no header `Authorization`.
- Para testar transferência, cadastre ao menos dois clientes.
- Usuários administradores precisam existir no banco com `tipo` igual a `ADMINISTRADOR`.
