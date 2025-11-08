# NetworkHubs

Plataforma de gestão para grupos de networking com backend NestJS e frontend Next.js.

## 🚀 Início Rápido

### Com Docker (Recomendado)

```bash
docker-compose up -d --build
```

Acesse:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api

### Sem Docker

Veja [COMO_RODAR.md](./COMO_RODAR.md) para instruções detalhadas.

## 📚 Documentação

- [COMO_RODAR.md](./COMO_RODAR.md) - Guia de instalação e execução
- [DOCKER.md](./DOCKER.md) - Guia completo de Docker
- [SETUP.md](./SETUP.md) - Configuração detalhada
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
