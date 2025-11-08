# Guia de Configuração - NetworkHubs

## Pré-requisitos

- Node.js >= 18
- PostgreSQL instalado e rodando
- npm >= 11.6.2

## Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE networkhubs;
```

2. Configure a variável de ambiente no backend:

Crie um arquivo `.env` em `apps/backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/networkhubs?schema=public"
PORT=3001
FRONTEND_URL=http://localhost:3000
ADMIN_SECRET=seu-secret-admin-aqui
JWT_SECRET=seu-jwt-secret-aqui
```

## Instalação

1. Instale as dependências na raiz do projeto:

```bash
npm install
```

2. Gere o cliente Prisma:

```bash
cd apps/backend
npx prisma generate
```

3. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev --name init
```

## Executando a Aplicação

### Desenvolvimento

Na raiz do projeto, execute:

```bash
npm run dev
```

Isso iniciará:
- Frontend em `http://localhost:3000`
- Backend em `http://localhost:3001/api`

### Executar Separadamente

**Backend:**
```bash
cd apps/backend
npm run dev
```

**Frontend:**
```bash
cd apps/frontend
npm run dev
```

## Como Usar

### 1. Fluxo de Admissão de Membros (Módulo Obrigatório)

1. **Criar Intenção de Participação:**
   - Acesse `http://localhost:3000/participation-form`
   - Preencha o formulário e envie

2. **Aprovar Intenção (Admin):**
   - Acesse `http://localhost:3000/admin/intentions`
   - Digite o `ADMIN_SECRET` configurado no `.env`
   - Visualize as intenções pendentes
   - Clique em "Aprovar" para gerar o link de cadastro
   - O link será exibido no console do backend (simulação de email)

3. **Cadastro Completo:**
   - Use o link gerado (formato: `http://localhost:3000/register/[token]`)
   - Preencha o formulário completo
   - Complete o cadastro

### 2. Sistema de Indicações (Módulo Opcional)

1. **Acessar Sistema:**
   - Acesse `http://localhost:3000/referrals`
   - Digite um `member_id` (use o ID de um membro cadastrado)
   - O ID será salvo no localStorage

2. **Criar Indicação:**
   - Clique em "Nova Indicação"
   - Selecione o membro para quem deseja indicar
   - Preencha os dados da indicação
   - Envie

3. **Gerenciar Indicações:**
   - Visualize indicações enviadas e recebidas
   - Filtre por tipo e status
   - Atualize o status das indicações recebidas
   - Crie agradecimentos (obrigados)

## Estrutura do Projeto

```
networkhubs/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── prisma/       # Schema do Prisma
│   │   └── src/
│   │       ├── participation-intentions/
│   │       ├── registration/
│   │       └── referrals/
│   └── frontend/          # Next.js App
│       └── src/
│           ├── app/      # Páginas
│           ├── components/
│           └── lib/      # Cliente API
└── packages/             # Packages compartilhados
```

## Variáveis de Ambiente

### Backend (`apps/backend/.env`)

- `DATABASE_URL`: String de conexão do PostgreSQL
- `PORT`: Porta do backend (padrão: 3001)
- `FRONTEND_URL`: URL do frontend para CORS
- `ADMIN_SECRET`: Chave secreta para área admin
- `JWT_SECRET`: Chave secreta para JWT (futuro)

### Frontend (`apps/frontend/.env.local`)

- `NEXT_PUBLIC_API_URL`: URL da API (padrão: http://localhost:3001/api)

## Comandos Úteis

```bash
# Gerar Prisma Client
cd apps/backend && npx prisma generate

# Criar migração
cd apps/backend && npx prisma migrate dev

# Visualizar banco (Prisma Studio)
cd apps/backend && npx prisma studio

# Build
npm run build

# Lint
npm run lint
```

## Notas Importantes

1. **Autenticação Simplificada:**
   - A área admin usa `ADMIN_SECRET` via header
   - O sistema de indicações usa `member_id` via header (salvo no localStorage)
   - Para produção, implemente autenticação JWT completa

2. **Simulação de Email:**
   - Ao aprovar uma intenção, o link de cadastro é exibido no console do backend
   - Em produção, implemente envio real de email

3. **Testes:**
   - Para testar o sistema de indicações, você precisa ter membros cadastrados
   - Use o Prisma Studio para visualizar e gerenciar dados: `npx prisma studio`

## Troubleshooting

**Erro de conexão com banco:**
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Execute `npx prisma migrate dev` para criar as tabelas

**Erro CORS:**
- Verifique se `FRONTEND_URL` no backend está correto
- Confirme que o frontend está rodando na porta 3000

**Erro ao gerar Prisma Client:**
- Execute `npm install` na raiz
- Execute `cd apps/backend && npx prisma generate`

