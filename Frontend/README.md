# Frontend Banco Digital

Aplicação React + Vite para autenticação com o backend NestJS.

## Requisitos

- Node.js 20.19+ (ou 22.12+)
- npm
- Backend rodando em `http://localhost:3000`

## Configuração

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Variáveis:

```env
VITE_API_URL="http://localhost:3000"
```

## Como rodar

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

## Fluxo de autenticação

- Login: `POST /auth/login`
- Restauração de sessão: `GET /auth/me`
- Token salvo no `localStorage`

Usuário de teste local:

- `emailOuCpf`: `cliente@email.com`
- `senha`: `senha123`
