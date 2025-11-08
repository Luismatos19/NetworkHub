# Configuração de Variáveis de Ambiente

## Arquivos .env

O projeto usa arquivos `.env` para armazenar informações sensíveis. Crie os arquivos baseados nos exemplos:

### 1. Arquivo .env na raiz (para Docker)

Copie `env.example` para `.env`:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
POSTGRES_USER=networkhubs
POSTGRES_PASSWORD=sua-senha-segura-aqui
POSTGRES_DB=networkhubs
BACKEND_PORT=3001
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000
ADMIN_SECRET=seu-admin-secret-super-seguro-aqui
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Nota:** O `DATABASE_URL` será construído automaticamente pelo Docker Compose usando as variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB`.

### 2. Arquivo .env no backend (para desenvolvimento local)

Copie `apps/backend/env.example` para `apps/backend/.env`:

```bash
cp apps/backend/env.example apps/backend/.env
```

Edite com suas configurações locais:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/networkhubs?schema=public
PORT=3001
FRONTEND_URL=http://localhost:3000
ADMIN_SECRET=seu-admin-secret-aqui
JWT_SECRET=seu-jwt-secret-aqui
```

### 3. Arquivo .env no frontend (para desenvolvimento local)

Copie `apps/frontend/env.example` para `apps/frontend/.env.local`:

```bash
cp apps/frontend/env.example apps/frontend/.env.local
```

Edite com suas configurações:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Segurança

⚠️ **IMPORTANTE:**

1. **NUNCA** commite arquivos `.env` no Git
2. Os arquivos `.env` já estão no `.gitignore`
3. Use valores seguros e aleatórios para `ADMIN_SECRET` e `JWT_SECRET`
4. Em produção, use variáveis de ambiente do sistema ou serviços de secrets

## Geração de Secrets Seguros

Para gerar secrets seguros, você pode usar:

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Docker

O `docker-compose.yml` e `docker-compose.dev.yml` usam o arquivo `.env` da raiz automaticamente.

⚠️ **IMPORTANTE:** O arquivo `.env` é **OBRIGATÓRIO**. Sem ele, a aplicação não funcionará corretamente, pois não há valores padrão para senhas e secrets por questões de segurança.

