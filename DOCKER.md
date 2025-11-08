# Rodando com Docker

## 🚀 Início Rápido

### 1. Criar arquivo .env

Copie o exemplo e configure:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações (veja [ENV_SETUP.md](./ENV_SETUP.md)).

### 2. Iniciar aplicação

```bash
docker-compose up -d --build
```

Acesse:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Opção 1: Desenvolvimento (Tudo no Docker)

Toda a aplicação roda em containers com hot-reload:

### 1. Criar arquivo .env (se ainda não criou)

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 2. Iniciar tudo

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

### 3. Executar migrações (primeira vez)

```bash
docker-compose -f docker-compose.dev.yml exec backend sh -c "cd apps/backend && npx prisma migrate dev --name init"
```

### 4. Ver logs

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### 5. Parar tudo

```bash
docker-compose -f docker-compose.dev.yml down
```

**Nota:** Os volumes são montados para hot-reload. Alterações no código são refletidas automaticamente.

## Opção 2: Produção (Tudo no Docker)

### 1. Criar arquivo .env (se ainda não criou)

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações de produção.

### 2. Construir e iniciar todos os serviços

```bash
docker-compose up -d --build
```

Isso vai:

- Criar e iniciar PostgreSQL
- Construir e iniciar Backend
- Construir e iniciar Frontend
- Executar migrações automaticamente

### 3. Verificar logs

```bash
docker-compose logs -f
```

### 4. Parar tudo

```bash
docker-compose down
```

### 5. Parar e remover volumes (limpar dados)

```bash
docker-compose down -v
```

## Comandos Úteis

### Ver status dos containers

```bash
docker-compose ps
```

### Ver logs de um serviço específico

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Acessar shell do container

```bash
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U networkhubs -d networkhubs
```

### Executar comandos no backend (dev)

```bash
docker-compose -f docker-compose.dev.yml exec backend sh -c "cd apps/backend && npx prisma studio"
docker-compose -f docker-compose.dev.yml exec backend sh -c "cd apps/backend && npm run lint"
```

### Reconstruir um serviço específico

```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Executar comandos no backend

```bash
docker-compose exec backend npx prisma studio
docker-compose exec backend npm run lint
```

## URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health
- PostgreSQL: localhost:5432

## Variáveis de Ambiente

As variáveis podem ser alteradas no `docker-compose.yml`:

```yaml
environment:
  DATABASE_URL: postgresql://...
  ADMIN_SECRET: seu-secret-aqui
  JWT_SECRET: seu-jwt-secret-aqui
```

## Troubleshooting

**Erro ao construir:**

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Banco não conecta:**

- Verifique se o container do postgres está rodando: `docker-compose ps`
- Verifique os logs: `docker-compose logs postgres`

**Porta já em uso:**

- Altere as portas no `docker-compose.yml`

**Limpar tudo e começar do zero:**

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```
