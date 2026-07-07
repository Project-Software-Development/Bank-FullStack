# Frontend - Banco Digital

Aplicação React + Vite que consome a API NestJS do projeto Bank-FullStack.

O frontend entrega a experiência de entrada, autenticação, painel do cliente, transferências internas, notificações e gestão administrativa de usuários.

## Stack

- React
- Vite
- JavaScript
- CSS
- Fetch API

## Requisitos

- Node.js compatível com o Vite usado no projeto
- npm
- Backend rodando em `http://localhost:3000` ou na URL configurada em `VITE_API_URL`

## Configuração

Instale as dependências:

```bash
npm install
```

Crie o `.env` a partir do exemplo:

```bash
copy .env.example .env
```

Variável esperada:

```env
VITE_API_URL="http://localhost:3000"
```

Se `VITE_API_URL` não for informada, os serviços do frontend usam `http://localhost:3000` como fallback.

## Como rodar

Ambiente de desenvolvimento:

```bash
npm run dev
```

Aplicação:

```text
http://localhost:5173
```

Build:

```bash
npm run build
```

Preview do build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o Vite em modo desenvolvimento. |
| `npm run build` | Gera o build de produção. |
| `npm run lint` | Executa o ESLint. |
| `npm run preview` | Serve localmente o build gerado. |

## Fluxo da aplicação

- `WelcomePage`: tela inicial de apresentação do PDS Bank.
- `LoginPage`: login por e-mail/CPF e senha.
- `RegisterPage`: cadastro de novo cliente.
- `HomePage`: área autenticada com painel, perfil, notificações e configurações administrativas.

A sessão é controlada pelo `AuthContext`. O token JWT é salvo no `localStorage` com a chave `token` e usado nas chamadas autenticadas.

## Serviços de API

Os serviços ficam em `src/services`.

| Arquivo | Rotas consumidas |
| --- | --- |
| `authService.js` | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| `dashboardService.js` | `GET /dashboard/me` |
| `transacoesService.js` | `GET /transacoes/historico`, `POST /transacoes/transferir` |
| `notificationsService.js` | `GET /notifications`, `PATCH /notifications/:id/status`, `DELETE /notifications/:id`, `DELETE /notifications` |
| `configuracoesService.js` | `GET /configuracoes/usuarios`, `PATCH /configuracoes/usuarios/:id/status`, `DELETE /configuracoes/usuarios/:id` |

## Funcionalidades por tela

### Painel

- Exibe nome do usuário autenticado.
- Exibe dados reais da conta vinculada ao usuário.
- Mostra saldo, número da conta, status e data de criação.
- Permite transferência para outra conta interna.
- Lista as últimas movimentações.
- Mostra um ícone de sino com contador de notificações não lidas.
- Exibe um resumo de notificações ao passar o mouse ou focar no sino.

### Meu perfil

- Exibe dados pessoais do usuário.
- Exibe número da conta e status.
- Permite visualizar ou ocultar o ID do usuário.
- Lista notificações da conta.
- Filtra notificações por todas, lidas e não lidas.
- Marca notificações como lidas ou não lidas.
- Apaga uma notificação individual.
- Apaga todas as notificações.

### Configurações

Disponível apenas para usuários com `tipo` igual a `ADMINISTRADOR`.

Inclui a tela "Gestão de Usuários", que permite:

- listar usuários;
- buscar por nome, e-mail ou CPF;
- filtrar por tipo e status;
- alterar status para `ATIVO` ou `INATIVO`;
- excluir usuários quando permitido pelo backend.

## Áreas demonstrativas

As seções "Próximos pagamentos" e "Objetivo mensal" aparecem no painel como espaços reservados. Elas ainda dependem de endpoints específicos no backend para se tornarem funcionais.

## Observações para teste local

- O backend precisa estar rodando antes do frontend.
- O banco precisa estar migrado e acessível pelo backend.
- Para testar transferências, cadastre ao menos dois clientes.
- Para acessar "Gestão de Usuários", é necessário entrar com um usuário `ADMINISTRADOR`.
- Cadastros feitos pelo fluxo público criam usuários `CLIENTE`.
