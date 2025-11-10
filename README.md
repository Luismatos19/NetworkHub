# NetworkHubs

Plataforma de gestão para grupos de networking com backend NestJS e frontend Next.js.

## 🚀 Início Rápido

# Como Rodar a Aplicação

## Opção 1: Com Docker (Recomendado)

### 1. Criar arquivo .env

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações (veja [ENV_SETUP.md](./ENV_SETUP.md)).

### 2. Iniciar aplicação

**Desenvolvimento (Hot-reload):**

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

**Produção:**

```bash
docker-compose up -d --build
```

Veja o arquivo [DOCKER.md](./DOCKER.md) para instruções completas.

## Opção 2: Local (Sem Docker)

### Pré-requisitos

1. **Node.js** >= 18 instalado
2. **PostgreSQL** instalado e rodando
3. **npm** instalado

## Passo 1: Configurar o Banco de Dados

1. Crie o banco de dados PostgreSQL:

```sql
CREATE DATABASE networkhubs;
```

2. Crie o arquivo `.env` em `apps/backend/`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/networkhubs?schema=public"
PORT=3001
FRONTEND_URL=http://localhost:3000
ADMIN_SECRET=meu-secret-admin-123
JWT_SECRET=meu-jwt-secret-123
```

## Passo 2: Instalar Dependências

Na raiz do projeto:

```bash
npm install
```

## Passo 3: Configurar Prisma

```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
cd ../..
```

## Passo 4: Rodar a Aplicação

### Opção 1: Rodar tudo junto (Recomendado)

Na raiz do projeto:

```bash
npm run dev
```

Isso inicia:

- **Backend** em `http://localhost:3001/api`
- **Frontend** em `http://localhost:3000`

### Opção 2: Rodar separadamente

**Terminal 1 - Backend:**

```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd apps/frontend
npm run dev
```

## Verificar se está funcionando

1. **Backend**: Acesse `http://localhost:3001/api/health`
   - Deve retornar: `{"status":"ok","timestamp":"..."}`

2. **Frontend**: Acesse `http://localhost:3000`
   - Deve mostrar a página inicial do NetworkHubs

## Comandos Úteis

### Backend

```bash
cd apps/backend

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Ver banco de dados (Prisma Studio)
npx prisma studio
```

### Frontend

```bash
cd apps/frontend

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

## 🧭 Fluxos Principais

- **Admissão de membros**: formulário em `/participation-form`, aprovação via `/admin/intentions` (usa `ADMIN_SECRET`), cadastro final pelo link exibido no console do backend.
- **Sistema de indicações**: `/referrals`, informe `member_id`, crie e acompanhe indicações e agradecimentos; dados podem ser monitorados pelo Prisma Studio.

## 🧩 Funcionalidades

- **Gestão de intenções de participação**: captura interessados via frontend público e permite aprovação administrativa com geração de convites seguros.
- **Cadastro completo de membros**: fluxo de onboarding guiado usando tokens temporários e validações de backend.
- **Sistema de indicações**: membros ativos podem indicar terceiros, acompanhar status e atualizar resultados.
- **Agradecimentos automáticos**: geração e registro de acknowledgments entre membros, reforçando engajamento e métricas do grupo.
- **Painéis administrativos**: páginas protegidas por `ADMIN_SECRET` para visualizar, aprovar e gerenciar entidades principais.
- **Infraestrutura containerizada**: ambiente completo com Docker Compose para desenvolvimento, testes e produção.

## 🔧 Comandos Úteis

```bash
# Prisma
cd apps/backend && npx prisma generate
cd apps/backend && npx prisma migrate dev
cd apps/backend && npx prisma studio

# Monorepo
npm run dev        # frontend + backend
npm run build
npm run lint

# Docker
docker-compose -f docker-compose.dev.yml logs -f
docker-compose down            # parar
docker-compose down -v         # limpar volumes
```

## 🩺 Troubleshooting Rápido

- **Banco não conecta**: verifique se o PostgreSQL/container está ativo, confirme `DATABASE_URL`, rode `npx prisma migrate dev`.
- **Porta em uso**: ajuste portas no `.env` ou `docker-compose`.
- **Erro CORS**: confirme `FRONTEND_URL` no backend.
- **Build Docker falhou**: `docker-compose down` seguido de `docker-compose build --no-cache`.
- **Reset total**: `docker-compose down -v && docker system prune -a`.

## 📚 Documentação

- [Arquitetura.md](./Arquitetura.md) - Documentação de arquitetura
- [apps/backend/REFACTORING.md](./apps/backend/REFACTORING.md) - Refatoração e Clean Code

## 🛠️ Tecnologias

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: Next.js, React, TypeScript
- **Monorepo**: Turborepo
- **Containerização**: Docker, Docker Compose

## 📦 Estrutura

```
networkhubs/
├── apps/
│   ├── backend/     # API NestJS
│   └── frontend/     # App Next.js
├── packages/         # Packages compartilhados
└── docker-compose.yml
```

## 🔧 Comandos Principais

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Docker
docker-compose up -d
docker-compose down
```

## 📝 Licença

Private
