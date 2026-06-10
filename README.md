# 🏦 Sistema Bancário

Sistema bancário em desenvolvimento que visa cobrir desde a autenticação de usuários até a execução de transações financeiras com notificações em tempo real.

---

## 📋 Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Contribuindo](#contribuindo)

---

## Sobre o projeto

Este sistema simula as operações essenciais de um banco digital. Ele permite que clientes realizem login, abram contas, consultem saldos, façam transferências (PIX e TED), efetuem pagamentos e recebam notificações. Administradores têm acesso a funcionalidades exclusivas de gestão de contas e cadastro de clientes.

---

## Funcionalidades

### Cliente
- Realizar login / logout
- Abrir conta bancária
- Consultar saldo
- Ver extrato
- Realizar transferências (PIX e TED)
- Realizar pagamentos de boleto
- Receber notificações (Push, E-mail e SMS)

### Administrador
- Realizar login / logout
- Cadastrar clientes
- Bloquear / desbloquear contas
- Encerrar contas

---

## Arquitetura

O sistema é estruturado em torno das seguintes entidades principais:

| Entidade | Descrição |
|---|---|
| `Usuário` | Classe base com dados de autenticação e tipo de acesso |
| `Cliente` | Estende `Usuário`; possui conta e statusConta |
| `Administrador` | Estende `Usuário`; gerencia contas e gera relatórios |
| `Conta` | Armazena número, saldo, status e data de criação |
| `Transação` | Classe abstrata pai de `Pagamento` e `Transferência` |
| `Pagamento` | Transação por código de barras com vencimento |
| `Transferência` | Movimentação entre conta origem e destino |
| `Autenticação` | Gerencia token, tentativas e login |
| `Notificação` | Envia alertas via e-mail, SMS e push |

---

## Tecnologias

> _Atualize esta seção com as tecnologias reais utilizadas no projeto._

- **Linguagem:** JavaScript / TypeScript
- **Framework:** Next.js / Node.js _(a definir)_
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT (JSON Web Token)
- **Documentação:** Swagger


