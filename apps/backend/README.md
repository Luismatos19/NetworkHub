# Backend

Backend API built with NestJS for NetworkHubs.

## Development

```bash
# Install dependencies (from root)
npm install

# Run in development mode
npm run dev --workspace=backend

# Or from this directory
npm run dev
```

## Build

```bash
npm run build --workspace=backend
```

## Start Production

```bash
npm run start:prod --workspace=backend
```

## Environment Variables

Create a `.env` file in this directory:

```
PORT=3001
FRONTEND_URL=http://localhost:3000
```

