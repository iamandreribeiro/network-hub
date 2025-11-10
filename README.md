# Network Hub

Este é um projeto full-stack que implementa um fluxo de admissão de membros para uma comunidade de networking, incluindo um dashboard de administrador e um fluxo de cadastro final por convite.

O projeto foi construído em uma arquitetura de monorepo, com duas pastas principais:
* `/frontend`: Uma aplicação Next.js (React) para a interface do usuário.
* `/backend`: Uma API NestJS (Node.js) para gerenciar a lógica de negócio e o banco de dados.

---

## Stack

* **Frontend:** Next.js (com App Router), React, Axios, TailwindCSS.
* **Backend:** NestJS, Node.js.
* **Banco de Dados:** PostgreSQL.
* **ORM:** Prisma.
* **Autenticação (Convites):** JWT (JSON Web Tokens).
* **Serviço de E-mail:** Nodemailer (com Ethereal Mail para testes).
* **Validação:** `class-validator` (no backend).
* **Segurança:** `bcrypt` (para hash de senhas).

---

## Como Rodar o Projeto

Você precisará ter o Node.js e o PostgreSQL instalados na sua máquina.

### 1. Configuração do Backend (NestJS)

1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure o Banco de Dados (PostgreSQL):
    * Crie um novo banco de dados no Postgres (ex: `network_hub`).
4.  Configure as Variáveis de Ambiente:
    * Renomeie o arquivo `.env.example` (se houver) para `.env`.
    * Edite o arquivo `.env` com suas credenciais:
    ```env
    # URL do seu banco de dados Postgres
    DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/network_hub"

    # Segredo para assinar os convites JWT
    SECRET="SEU_SEGREDO_JWT_AQUI"

    # Credenciais do Ethereal Mail (para simular envio de e-mail)
    MAIL_HOST=smtp.ethereal.email
    MAIL_PORT=587
    MAIL_USER=seu-usuario-ethereal@ethereal.email
    MAIL_PASS=sua-senha-ethereal
    ```
5.  Aplique as migrações do Prisma para criar as tabelas:
    ```bash
    npx prisma migrate dev
    ```
6.  Inicie o servidor do backend (geralmente na porta 3001):
    ```bash
    npm run start:dev
    ```

### 2. Configuração do Frontend (Next.js)

1.  Em um **novo terminal**, navegue até a pasta do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento (geralmente na porta 3000):
    ```bash
    npm run dev
    ```

### 3. Acessando a Aplicação

* **Página de Intenção:** `http://localhost:{PORTA}/intention`
* **Dashboard do Admin (Protegida via variável de ambiente):** `http://localhost:{PORTA}/dashboard`
* **Dashboard de Performance:** `http://localhost:{PORTA}/performance`
* *(O link de registro será enviado pelo e-mail simulado no Ethereal)*

---

## Fluxo de Funcionalidades

1.  **Página de Intenção**: Um formulário público onde um novo usuário pode submeter seu interesse (`POST /intentions`).
2.  **Dashboard do Admin**: Uma página privada que lista todas as intenções pendentes (`GET /intentions`). O admin pode aprovar ou recusar (`PATCH /intentions/:id`).
3.  **Geração de Convite:** Ao aprovar, o backend (NestJS) gera um **JWT** e "envia" um e-mail (via Nodemailer) com um link de cadastro único.
4.  **Cadastro Completo**/page.tsx]: O usuário clica no link (`/register/[token]`). A página valida o token com a API (`GET /intentions/validate/:token`). Se for válido, o usuário cria sua senha.
5.  **Criação do Membro:** O formulário de senha envia o token e a nova senha (`POST /members`). O backend valida o token novamente, faz o **hash da senha** (bcrypt) e cria o registro final na tabela `Member`.
6.  **Dashboard de Performance:** Uma página que exibe estatísticas (mockadas e reais) da plataforma (`GET /dashboard`).
