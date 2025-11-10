### 1. Visão Geral da Arquitetura

O projeto utiliza uma **arquitetura de microsserviços desacoplados** (Frontend e Backend) dentro de um monorepo para facilitar o desenvolvimento.

* **Cliente (Frontend):** Uma Aplicação de Página Única (SPA) renderizada pelo servidor (SSR) usando **Next.js**. É responsável por toda a interface do usuário e pela comunicação com o backend.
* **Servidor (Backend):** Uma API RESTful modular construída com **NestJS**. É responsável por toda a lógica de negócio, segurança e comunicação com o banco de dados.
* **Comunicação:** O frontend e o backend comunicam-se exclusivamente via **JSON** sobre HTTP (requisições REST).

### 2. Componentes Detalhados

#### Frontend (Next.js / React)

* **Responsabilidade:** Apresentar a interface, gerenciar o estado local (UI) e consumir a API do backend.
* **Páginas (Rotas):**
    * `app/intention/page.tsx`: Formulário público de submissão de interesse.
    * `app/dashboard/page.tsx`: Página "privada" (protegida por variável de ambiente, como sugerido) para o admin ver e aprovar/recusar intenções.
    * `app/register/[token]/page.tsx`/page.tsx]: Página de cadastro final dinâmica, que captura o token da URL para validação.
    * `app/performance/page.tsx`: Página para o Módulo Opcional B, exibindo estatísticas.
* **Ferramentas:** `axios` é usado para todas as chamadas de API.

#### Backend (NestJS / Node.js)

* **Responsabilidade:** Orquestrar a lógica de negócio, validar dados, gerenciar segurança e interagir com o banco de dados.
* **Arquitetura:** Modular. Cada "recurso" (resource) tem seu próprio Módulo, Controller e Serviço:
    * `IntentionsModule`: Gerencia o CRUD das intenções, a aprovação/recusa e a validação do token de convite.
    * `MembersModule`: Gerencia a criação do membro final (cadastro com senha).
    * `DashboardModule`: Gerencia o endpoint para as estatísticas de performance.
    * `PrismaModule`: Fornece uma instância global do `PrismaService`.
* **Segurança:**
    * **Validação de DTOs:** `class-validator` garante que todos os dados de entrada (como no `CreateIntentionDto`) sejam válidos antes de tocar a lógica do serviço.
    * **Hashing de Senha:** `bcrypt` é usado para fazer o hash das senhas antes de salvá-las no banco.
    * **Tokens de Convite:** `JWT (@nestjs/jwt)` é usado para gerar tokens assinados e seguros, que provam a identidade do convidado sem expor dados na URL.
* **Serviços de Terceiros:**
    * `@nestjs/nodemailer`: Integrado para enviar o e-mail de convite (simulado via Ethereal).

#### Persistência de Dados (PostgreSQL + Prisma)

* **Banco de Dados:** **PostgreSQL**, uma solução relacional robusta.
* **ORM (Prisma):** Usado para abstrair a comunicação com o banco. O `schema.prisma` define os modelos (tabelas) e suas relações:
    * `Intention`: Armazena a submissão inicial (nome, email, empresa, status).
    * `Invitation`: Armazena o token de convite gerado e o liga à `Intention` (relação 1-para-1).
    * `Member`: Armazena o usuário final (nome, email, hashSenha) após o cadastro completo.

### 3. Fluxo de Dados: Admissão de Membro (Módulo Obrigatório)

Esta é a arquitetura do fluxo principal:

1.  **Frontend (Intenção)**: Usuário preenche o formulário.
    * `->` `axios.post('.../intentions', { nome, email, ... })`
2.  **Backend (IntentionService)**: Recebe o DTO, valida e salva no `model Intention` com status `PENDENTE`.
3.  **Frontend (Admin)**: O admin acessa a página, que faz:
    * `->` `axios.get('.../intentions')`
4.  **Backend (IntentionService)**: Retorna a lista de intenções pendentes.
5.  **Frontend (Admin)**: O admin clica em "Aprovar".
    * `->` `axios.patch('.../intentions/:id', { status: 'APROVADO' })`
6.  **Backend (IntentionService)**:
    a. Recebe o PATCH.
    b. Busca a intenção no banco para pegar o email.
    c. Gera um **JWT** (`jwtService.sign({ id: id })`).
    d. Salva o token no `model Invitation`.
    e. Usa o `mailerService` para "enviar" o e-mail com o link: `.../register/[token]`.
7.  **Frontend (Cadastro)**/page.tsx]: O usuário recebe o e-mail e clica no link. A página carrega.
    a. `use(params)` captura o `token` da URL/page.tsx, line 10].
    b. `useEffect` dispara uma chamada de validação/page.tsx, line 14].
    c. `->` `axios.get('.../intentions/validate/[token]')`
8.  **Backend (IntentionService)**:
    a. Recebe o token.
    b. Usa `jwtService.verify(token)` para validar.
    c. Se for válido, busca a `Intention` original (com nome, email) e a retorna.
9.  **Frontend (Cadastro)**/page.tsx]: O estado `isValid` vira `true`/page.tsx], e o formulário de senha é exibido. O usuário digita a senha e envia.
    * `->` `axios.post('.../members', { token, senha })`/page.tsx, lines 45-50]
10. **Backend (MembersService)**:
    a. Recebe o DTO (`token` e `senha`).
    b. **Valida o token** novamente com `jwtService.verify(token)`.
    c. Se for válido, extrai o `id` do payload.
    d. Busca a `Intention` (para pegar `nome` e `email` de forma segura).
    e. **Faz o hash da senha** com `bcrypt.hash(senha, 10)`.
    f. Salva o registro final no `model Member`.
11. **Fim do Fluxo:** O usuário está cadastrado.