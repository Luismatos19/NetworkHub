# NetworkHubs Backend

API REST construída com NestJS, Prisma e PostgreSQL. Exposta em `http://localhost:3001/api` durante o desenvolvimento.

## Rotinas principais

- Fluxo de intenções de participação e aprovação
- Cadastro de membros via tokens temporários
- Sistema de indicações e agradecimentos entre membros
- Painéis administrativos protegidos por `ADMIN_SECRET`

## Ambiente local

```bash
# instalar dependências (raiz do monorepo)
npm install

# gerar cliente Prisma
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init

# rodar em desenvolvimento
npm run dev
```

## Produção / build

```bash
npm run build
npm run start:prod
```

## Variáveis de ambiente (`apps/backend/.env`)

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/networkhubs?schema=public
PORT=3001
FRONTEND_URL=http://localhost:3000
ADMIN_SECRET=seu-secret-admin
JWT_SECRET=seu-jwt-secret
```

## Utilidades

```bash
# abrir Prisma Studio
npx prisma studio

# lint
npm run lint

# testes (se aplicável)
npm run test
```

Para mais contexto consulte o `README.md` na raiz do projeto.
