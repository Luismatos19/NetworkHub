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

## Troubleshooting

**Erro de conexão com banco:**

- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Execute `npx prisma migrate dev` novamente

**Erro de módulos não encontrados:**

- Execute `npm install` na raiz
- Execute `npx prisma generate` no backend

**Porta já em uso:**

- Altere a porta no `.env` (backend) ou `package.json` (frontend)
