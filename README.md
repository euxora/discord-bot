# Euxora Discord Bot

A Discord bot for the Euxora organization, built with TypeScript, Sapphire, Prisma, Postgres, and Redis.

## Requirements

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose
- A configured `.env` file

## Run the bot (Docker, recommended)

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f bot
```

This starts:
- `postgres`
- `redis`
- `bot`

## Run the bot (local)

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

## Useful commands

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## License

MIT - see `LICENSE`.
