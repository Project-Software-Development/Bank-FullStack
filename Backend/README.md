# API Banco Digital

Backend em NestJS com TypeScript, Prisma, JWT e Swagger.

Esta entrega implementa somente autenticacao: login, rota para consultar o usuario autenticado e documentacao Swagger. Nao existe endpoint de cadastro de usuario neste projeto.

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

## Requisitos

- Node.js instalado
- npm instalado
- PostgreSQL em execucao
- Banco de dados criado para o projeto

## Como Rodar o Projeto

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Configure as variaveis de ambiente no `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/api_banco_digital?schema=public"
JWT_SECRET="troque-este-segredo-em-producao"
FRONTEND_ORIGIN="http://localhost:5173"
```

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Inicie a aplicacao em modo desenvolvimento:

```bash
npm run start:dev
```

A API ficara disponivel em:

```text
http://localhost:3000
```

## Swagger

A documentacao Swagger fica disponivel em:

```text
http://localhost:3000/api/docs
```

Para testar rotas protegidas:

1. Faca login em `POST /auth/login`.
2. Copie o `accessToken` retornado.
3. Clique em `Authorize` no Swagger.
4. Informe o token no formato Bearer, se necessario:

```text
Bearer seu_token_jwt
```

## Variaveis de Ambiente

| Variavel         | Descricao                                                |
| ---------------- | -------------------------------------------------------- |
| `DATABASE_URL` | URL de conexao com o banco PostgreSQL usado pelo Prisma. |
| `JWT_SECRET`   | Chave secreta usada para assinar e validar tokens JWT.   |
| `FRONTEND_ORIGIN` | Origem permitida no CORS para o frontend local. |

## Modelo de Usuario Esperado

O projeto considera uma tabela `User` com os seguintes campos:

| Campo           | Tipo esperado | Descricao                                                                                    |
| --------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `id`          | `String`    | Identificador unico do usuario.                                                              |
| `nome`        | `String`    | Nome do usuario.                                                                             |
| `cpf`         | `String`    | CPF usado tambem para login.                                                                 |
| `email`       | `String`    | E-mail usado tambem para login.                                                              |
| `telefone`    | `String?`   | Telefone do usuario.                                                                         |
| `senha`       | `String`    | Senha criptografada com bcrypt.                                                              |
| `tipo`        | `String`    | Tipo/perfil do usuario.                                                                      |
| `statusConta` | `String`    | Status da conta. Usuarios ativos devem usar valores como `ATIVO`, `ATIVA` ou `ACTIVE`. |
| `createdAt`   | `DateTime`  | Data de criacao do usuario.                                                                  |

Importante: a senha nunca e retornada nas respostas da API.

## Endpoints Criados

### POST `/auth/login`

Autentica um usuario por e-mail ou CPF.

Body:

```json
{
  "emailOuCpf": "cliente@email.com",
  "senha": "senha123"
}
```

Resposta de sucesso:

```json
{
  "accessToken": "token.jwt.aqui",
  "user": {
    "id": "uuid-do-usuario",
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

Regras aplicadas:

- Busca usuario por e-mail ou CPF.
- Valida senha usando bcrypt.
- Verifica se a conta esta ativa.
- Retorna token JWT.
- Retorna dados basicos do usuario sem senha.

### GET `/auth/me`

Retorna os dados do usuario autenticado.

Esta rota exige token JWT no header:

```http
Authorization: Bearer seu_token_jwt
```

Resposta de sucesso:

```json
{
  "id": "uuid-do-usuario",
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "email": "maria@email.com",
  "telefone": "98999999999",
  "tipo": "CLIENTE",
  "statusConta": "ATIVO",
  "createdAt": "2026-05-26T20:00:00.000Z"
}
```

## Scripts Disponiveis

| Script                      | Descricao                                             |
| --------------------------- | ----------------------------------------------------- |
| `npm run start`           | Inicia a aplicacao.                                   |
| `npm run start:dev`       | Inicia a aplicacao em modo desenvolvimento com watch. |
| `npm run build`           | Compila o projeto.                                    |
| `npm run start:prod`      | Executa a versao compilada em `dist`.               |
| `npm run prisma:generate` | Gera o Prisma Client.                                 |
| `npm run format`          | Formata arquivos TypeScript e Prisma com Prettier.    |

## Observacoes para Desenvolvimento

- O `PrismaService` nao forca conexao com o banco ao iniciar a aplicacao, permitindo abrir o Swagger mesmo sem PostgreSQL em execucao.
- As rotas que consultam usuario exigem banco configurado corretamente.
- Nao ha endpoint de cadastro nesta entrega.
- Senhas devem estar salvas no banco ja criptografadas com bcrypt.

## Melhorias futuras para finalizar o cadastro de novos usuários e a tela de login

Para concluir a integração da tela de cadastro com o frontend, ainda será necessário implementar o endpoint de cadastro de usuários no backend.

O outro desenvolvedor backend ficará responsável por criar o endpoint `POST /auth/register` ou `POST /users`, recebendo nome, CPF, e-mail, telefone e senha. Esse endpoint deve validar os campos obrigatórios, impedir cadastro com CPF ou e-mail já existente, criptografar a senha com bcrypt antes de salvar no banco e retornar os dados do usuário criado sem expor a senha.

Também será necessário documentar esse endpoint no Swagger, informando o formato da requisição, as respostas de sucesso e os possíveis erros.

Após isso, o fluxo completo poderá ser testado: cadastro de usuário, login em `POST /auth/login` e acesso ao `GET /auth/me` com token JWT.

Com essa etapa concluída pelo outro desenvolvedor backend, os desenvolvedores frontend já terão os endpoints necessários para criar e integrar as telas de cadastro e login.
