# NetworkHubs

Monorepo para NetworkHubs com backend NestJS e frontend Next.js.

## Estrutura do Projeto

Este monorepo contém:

### Apps

- **`apps/backend`**: API backend construída com [NestJS](https://nestjs.com/)
- **`apps/frontend`**: Aplicação frontend construída com [Next.js](https://nextjs.org/)

### Packages

- **`@repo/ui`**: Biblioteca de componentes React compartilhados
- **`@repo/eslint-config`**: Configurações ESLint compartilhadas
- **`@repo/typescript-config`**: Configurações TypeScript compartilhadas

## Pré-requisitos

- Node.js >= 18
- npm >= 11.6.2

## Instalação

Instale as dependências de todos os workspaces:

```bash
npm install
```

## Desenvolvimento

Para rodar todos os apps em modo de desenvolvimento:

```bash
npm run dev
```

Para rodar um app específico:

```bash
# Frontend (porta 3000)
npm run dev --workspace=frontend

# Backend (porta 3001)
npm run dev --workspace=backend
```

## Build

Para fazer build de todos os apps e packages:

```bash
npm run build
```

Para fazer build de um app específico:

```bash
npm run build --workspace=frontend
npm run build --workspace=backend
```

## Scripts Disponíveis

- `npm run dev` - Inicia todos os apps em modo de desenvolvimento
- `npm run build` - Faz build de todos os apps e packages
- `npm run lint` - Executa lint em todos os projetos
- `npm run check-types` - Verifica tipos TypeScript em todos os projetos
- `npm run format` - Formata código com Prettier

## Tecnologias

- **Turborepo**: Build system e gerenciamento de monorepo
- **NestJS**: Framework Node.js para backend
- **Next.js**: Framework React para frontend
- **TypeScript**: Linguagem de programação
- **ESLint**: Linter de código
- **Prettier**: Formatador de código

## Estrutura de Portas

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## Variáveis de Ambiente

### Backend

Crie um arquivo `.env` em `apps/backend/`:

```
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend

Crie um arquivo `.env.local` em `apps/frontend/` se necessário:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Links Úteis

- [Turborepo Documentation](https://turborepo.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
