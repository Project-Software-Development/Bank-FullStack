# Bank-FullStack - Banco Digital

Projeto fullstack de banco digital desenvolvido para simular operações internas entre usuários do próprio sistema.

A aplicação está dividida em duas pastas principais:

- `Backend`: API NestJS com Prisma, PostgreSQL, autenticação JWT, transações, notificações e gestão administrativa de usuários.
- `Frontend`: aplicação React + Vite com tela inicial, login, cadastro, painel do cliente, transferências, notificações e área administrativa.

## Funcionalidades atuais

### Cliente

- Criar cadastro com nome, CPF, e-mail, telefone opcional e senha.
- Fazer login usando e-mail ou CPF.
- Restaurar sessão usando token JWT salvo no navegador.
- Consultar dados da conta vinculada ao usuário.
- Visualizar número da conta, saldo, status e data de criação.
- Transferir dinheiro para outra conta existente no sistema.
- Consultar as últimas movimentações da conta.
- Receber notificações de transferência.
- Ver notificações pelo ícone de sino no painel.
- Gerenciar notificações em "Meu perfil":
  - filtrar todas, lidas e não lidas;
  - marcar como lida ou não lida;
  - apagar uma notificação;
  - apagar todas as notificações.

### Administrador

- Acessar o menu "Configurações".
- Abrir a tela "Gestão de Usuários".
- Listar e filtrar usuários por busca, tipo e status.
- Alterar status de usuários entre `ATIVO` e `INATIVO`.
- Excluir usuários, respeitando as regras implementadas no backend.

### Áreas ainda demonstrativas

As seções "Próximos pagamentos" e "Objetivo mensal" existem no frontend como espaços reservados. Atualmente, elas ainda não possuem endpoint ou persistência própria.

## Tecnologias

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT e Passport
- bcrypt
- Swagger/OpenAPI
- class-validator

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

## Estrutura do projeto

```text
Bank-FullStack/
  Backend/
    prisma/
      migrations/
      schema.prisma
    src/
      auth/
      configuracoes/
      dashboard/
      notifications/
      prisma/
      transacoes/
    .env.example
    package.json
    README.md
  Frontend/
    src/
      assets/
      components/
      context/
      pages/
      services/
    .env.example
    package.json
    README.md
  README.md
```

## Como rodar no macOS

Este passo a passo considera um MacBook com Homebrew instalado. Se você já tiver Node.js, npm e PostgreSQL configurados, pode pular direto para a etapa de backend.

### 1. Instalar pré-requisitos

Instale Node.js e PostgreSQL:

```bash
brew install node postgresql@16
```

Inicie o PostgreSQL:

```bash
brew services start postgresql@16
```

Confirme se as ferramentas estão disponíveis:

```bash
node -v
npm -v
psql --version
```

### 2. Criar o banco local

Crie o banco usado pelo projeto:

```bash
createdb BancoDigital
```

Se o comando `createdb` não estiver disponível no terminal, adicione o PostgreSQL ao `PATH`:

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Em Macs com processador Intel, o caminho pode ser:

```bash
echo 'export PATH="/usr/local/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Rodar o backend

Entre na pasta do backend:

```bash
cd Backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Confira se o `.env` está apontando para o banco local:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/BancoDigital"
JWT_SECRET="change-this-secret"
FRONTEND_ORIGIN="http://localhost:5173"
PORT=3000
```

Se o seu PostgreSQL local não usa usuário `postgres` e senha `postgres`, ajuste o `DATABASE_URL` conforme a sua instalação.

Gere o Prisma Client e aplique as migrations:

```bash
npm run prisma:generate
npm run prisma:updatedb
```

Inicie a API:

```bash
npm run start:dev
```

Por padrão, a API sobe em:

```text
http://localhost:3000
```

A documentação Swagger fica em:

```text
http://localhost:3000/api/docs
```

### 4. Rodar o frontend

Abra outro terminal na raiz do projeto e entre na pasta do frontend:

```bash
cd Frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Confira se o `.env` aponta para a API:

```env
VITE_API_URL="http://localhost:3000"
```

Inicie a aplicação:

```bash
npm run dev
```

Por padrão, o frontend sobe em:

```text
http://localhost:5173
```

### 5. Testar o fluxo principal

Com backend e frontend rodando:

1. Acesse `http://localhost:5173`.
2. Crie pelo menos dois usuários clientes.
3. Faça login com um dos usuários.
4. Copie o número da conta do outro usuário.
5. Faça uma transferência interna pelo painel.
6. Confira o histórico de movimentações e as notificações.

## Variáveis de ambiente

### Backend

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/BancoDigital"
JWT_SECRET="change-this-secret"
FRONTEND_ORIGIN="http://localhost:5173"
PORT=3000
```

### Frontend

```env
VITE_API_URL="http://localhost:3000"
```

## Rotas principais da API

- `POST /auth/register`: cadastra um cliente.
- `POST /auth/login`: autentica por e-mail ou CPF.
- `GET /auth/me`: retorna o usuário autenticado.
- `GET /dashboard/me`: retorna dados do usuário e da conta.
- `GET /transacoes/historico`: retorna as últimas movimentações.
- `POST /transacoes/transferir`: transfere valor para outra conta interna.
- `GET /notifications`: lista notificações do usuário autenticado.
- `PATCH /notifications/:id/status`: marca notificação como lida ou não lida.
- `DELETE /notifications/:id`: apaga uma notificação.
- `DELETE /notifications`: apaga todas as notificações do usuário.
- `GET /configuracoes/usuarios`: lista usuários para administradores.
- `PATCH /configuracoes/usuarios/:id/status`: altera status de usuário.
- `DELETE /configuracoes/usuarios/:id`: exclui usuário.

## Scripts úteis

### Backend

```bash
npm run start:dev
npm run build
npm run prisma:generate
npm run prisma:updatedb
```

### Frontend

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Observações importantes

- O cadastro cria usuários do tipo `CLIENTE`.
- O backend cria uma conta vinculada ao cliente durante o cadastro.
- Para testar transferências, é necessário ter pelo menos duas contas cadastradas.
- Usuários administradores dependem de existir no banco com `tipo` igual a `ADMINISTRADOR`.
- As funcionalidades de pagamentos e objetivo mensal ainda não estão persistidas.
