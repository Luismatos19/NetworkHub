# NetworkHubs Frontend

Aplicação Next.js que serve os fluxos principais do NetworkHubs:

- Formulário público de intenção de participação
- Painel admin para aprovar intenções e disparar convites
- Fluxo completo de cadastro de novos membros (via token)
- Sistema de indicações e agradecimentos entre membros ativos

## Executando localmente

```bash
# instalar dependências na raiz do monorepo
npm install

# criar arquivo de ambiente
cp apps/frontend/env.example apps/frontend/.env.local
```

Conteúdo mínimo recomendado:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Iniciar o servidor:

```bash
cd apps/frontend
npm run dev
```

Aplicação ficará disponível em `http://localhost:3000`.

## Build e produção

```bash
npm run build
npm start
```

## Testes e lint

```bash
npm run lint
npm run test         # se houver testes configurados
```

Consulte o `README.md` da raiz para instruções completas de infraestrutura e integração com o backend.
