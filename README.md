# Euxora Discord Bot

Bot de Discord para la organizacion Euxora, construido con TypeScript, Sapphire, Prisma, Postgres y Redis.

## Requisitos

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose
- Archivo `.env` configurado

## Levantar el bot (Docker, recomendado)

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f bot
```

Esto levanta:
- `postgres`
- `redis`
- `bot`

## Levantar el bot (local)

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

## Comandos utiles

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Licencia

MIT - ver `LICENSE`.
