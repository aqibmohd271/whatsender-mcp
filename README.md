<div align="center">

<img src="docs/assets/whatsender-banner.svg" alt="Whatsender MCP — a self-hosted WhatsApp gateway for dashboards, APIs and AI workflows" width="100%" />

# Whatsender MCP

**Your WhatsApp. Your workflows.**

A self-hosted WhatsApp gateway with a web dashboard, REST API, automation tools, and native Model Context Protocol support.

**Next.js 16 · React 19 · TypeScript · PostgreSQL · Baileys · MIT**

[Quick start](#quick-start) · [Features](#features) · [MCP support](#mcp-support) · [REST API](#rest-api) · [Deployment](#deployment) · [Documentation](#documentation)

Built with ❤️ by **[Mohammad Aqib · codeupp.xyz](https://codeupp.xyz/)**

</div>

---

## What is Whatsender MCP?

Whatsender MCP turns linked WhatsApp accounts into a programmable messaging workspace. Connect a device by scanning a QR code, manage conversations from the dashboard, integrate your own applications through REST endpoints, or give an MCP-compatible AI client access to eight WhatsApp tools.

Use it for customer support workflows, opt-in notifications, scheduled follow-ups, contact management, and AI-assisted messaging. You host the application, PostgreSQL database, and session storage yourself.

This edition has **no software activation screen, purchase-code requirement, or external license-verification service**. Account login, API-key authentication, session permissions, and application plan/quota controls remain in place.

> Whatsender MCP connects through Baileys and WhatsApp Web. It is an unofficial integration, not Meta's WhatsApp Business Cloud API. Use it for consent-based communication; delivery and account availability depend on WhatsApp.

## Features

| Area | What you can do |
| --- | --- |
| **WhatsApp sessions** | Link multiple accounts with QR codes; inspect connection status; start, stop, reconnect, delete, and sync sessions. |
| **Messaging** | Send text, media, documents, stickers, contacts, locations, polls, and supported interactive payloads; reply, react, star, and delete messages. |
| **Conversations** | Browse chats and message history; mark messages read; pin, archive, mute, and manage presence. |
| **Contacts & labels** | Browse contacts, check WhatsApp numbers, block/unblock contacts, and organize chats with labels. |
| **Groups** | Create groups; manage participants, subject, description, picture, settings, invitations, and disappearing messages; leave groups. |
| **Scheduled messages** | Schedule messages and supported media for later delivery; manage queued work from the dashboard. |
| **Broadcasts** | Configure automatic broadcasts with recipient selection and delivery pacing. |
| **Auto-replies & bots** | Configure keyword replies, bot commands, group/private behavior, and access lists. |
| **Media & stickers** | Manage uploaded media and create stickers; optional background removal uses a separate remove.bg API key. |
| **Webhooks** | Send WhatsApp events to your applications; configure and test session webhooks. |
| **MCP tools** | Let compatible AI clients inspect sessions, chats, messages, contacts, groups, account information, and send text messages. |
| **Administration** | Manage users, `SUPERADMIN` / `OWNER` / `STAFF` roles, session access, branding, notifications, plans, and system monitoring. |
| **Billing integrations** | Existing plan management and KlikQRIS payment routes are included; using payments requires separate configuration. |
| **Developer interfaces** | REST endpoints, interactive API documentation, a Swagger specification, and Socket.IO live updates. |

Message-format support can change with WhatsApp and Baileys. Lists, buttons, and other interactive formats should be tested with your linked devices. Broadcast pacing does not guarantee protection from account restrictions.

## How it fits together

```text
Web dashboard ──────┐
Your app / REST API ├── Whatsender MCP ── Baileys ── Linked WhatsApp accounts
AI client / MCP ────┘        │
                            ├── PostgreSQL: users, sessions, chats, configuration
                            ├── Local storage: media and runtime files
                            ├── Schedulers: messages and broadcasts
                            └── Webhooks + Socket.IO: events and live updates
```

The app uses a persistent custom Node.js server. Keep it running for WhatsApp connections, scheduled jobs, and live updates.

## Quick start

### 1. Get the project

Clone the repository and enter the project directory:

```bash
git clone https://github.com/aqibmohd271/whatsender-mcp.git
cd whatsender-mcp
```

You can also download a ZIP from GitHub's **Code** menu.

You need:

- **Node.js 22 or 24**, npm, and Git if cloning. This edition was locally tested with Node.js 24.
- **PostgreSQL**; the included Compose file uses PostgreSQL 16.
- A WhatsApp account on your phone to link a device.

The checked-in Prisma schema uses **PostgreSQL**. MySQL is not a drop-in substitute for this configuration.

```bash
npm ci
cp .env.example .env
```

### 2. Configure the environment

Create a PostgreSQL database, then edit `.env` with your connection details. Use literal URLs for the URL variables:

```dotenv
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@127.0.0.1:5432/whatsender_mcp?schema=public"
AUTH_SECRET="REPLACE_WITH_A_RANDOM_SECRET"
AUTH_TRUST_HOST="true"
NODE_ENV="development"
PORT="3000"
HOSTNAME="localhost"
BASE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
APP_NAME="Whatsender MCP"
TZ="UTC"
```

Generate a random authentication secret and paste the result into `AUTH_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

<details>
<summary><strong>Need a local PostgreSQL database? Use Docker.</strong></summary>

With Docker installed and running, create a development database:

```bash
docker run --name whatsender-postgres \
  -e POSTGRES_USER=whatsender \
  -e POSTGRES_PASSWORD=local-development-password \
  -e POSTGRES_DB=whatsender_mcp \
  -p 127.0.0.1:5432:5432 \
  -v whatsender_postgres_data:/var/lib/postgresql/data \
  -d postgres:16-alpine
```

Use this local connection string:

```dotenv
DATABASE_URL="postgresql://whatsender:local-development-password@127.0.0.1:5432/whatsender_mcp?schema=public"
```

If port 5432 is occupied, map another host port and update the connection string. The example password is for local development only.

</details>

### 3. Initialize the database and create your admin

```bash
npm run db:push
node scripts/setup-admin.js you@example.com 'YOUR_STRONG_PASSWORD'
```

Run this before the first server startup. The setup script creates a new administrator or promotes an existing user; it **does not reset an existing user's password**.

The bootstrap also attempts automatic schema setup and creates `admin@example.com` / `admin123` if no superadmin exists. Create your own admin first, and replace or remove that default account if it has already been created.

### 4. Start the app

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and sign in at **[/auth/login](http://localhost:3000/auth/login)**.

### 5. Connect your first WhatsApp account

1. Open **Sessions** in the dashboard and create a session.
2. Display its QR code.
3. On your phone, open WhatsApp → **Linked devices** → **Link a device**.
4. Scan the QR code and wait for the session to show `CONNECTED`.
5. Open the session's chats, or generate an API key in your profile to use REST or MCP.

No software activation key is needed.

## MCP support

The gateway exposes a native MCP interface with **eight tools**. It implements JSON-RPC 2.0 POST requests and an SSE transport; its initialization response currently advertises protocol version `2024-11-05`.

| Setting | Value |
| --- | --- |
| Primary endpoint | `http://localhost:3000/mcp` |
| API alias | `http://localhost:3000/api/mcp` |
| SSE | `GET /mcp` with `Accept: text/event-stream` |
| Direct JSON-RPC | `POST /mcp` with `Content-Type: application/json` |
| SSE messages | Use the messages URL returned in the SSE `endpoint` event |
| Authentication | `x-api-key`, `Authorization: Bearer …`, or `?key=…` / `?apiKey=…` |

### Connect an AI client

1. Generate an API key in your dashboard profile.
2. Add a remote MCP server in a client that supports this server's HTTP or SSE transport.
3. Set its URL to your gateway's `/mcp` endpoint.
4. Supply the key using an authentication header if the client supports it. A query-key URL is also supported: `https://YOUR_DOMAIN/mcp?key=YOUR_API_KEY`.
5. Discover the tools, then start with a read-only request such as “List my WhatsApp sessions.”

Remote-server configuration varies by client and version. Use your client's connection settings rather than assuming one JSON configuration works everywhere. A remotely hosted AI client needs a reachable HTTPS deployment; its `localhost` is not your computer.

### Available tools

| Tool | Purpose |
| --- | --- |
| `whatsapp_list_sessions` | List accessible linked sessions and their connection status. |
| `whatsapp_send_message` | Send a text message to a phone number or group JID. |
| `whatsapp_get_chats` | Retrieve recent conversations. |
| `whatsapp_get_messages` | Read recent history for a phone number or JID. |
| `whatsapp_check_number` | Check whether a number is registered on WhatsApp. |
| `whatsapp_list_contacts` | Search and list saved contacts. |
| `whatsapp_list_groups` | List participating groups. |
| `whatsapp_get_account_info` | Inspect the authenticated account, role, and plan information. |

For session-specific tools, pass `sessionId` when you want a particular account. Otherwise, the gateway prefers an accessible connected session. Use full international phone numbers, including the country code.

### Try tool discovery

```bash
curl -sS http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

An example text-send call, once a session is connected:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "whatsapp_send_message",
    "arguments": {
      "sessionId": "YOUR_SESSION_ID",
      "phone": "+15551234567",
      "message": "Hello from Whatsender MCP!"
    }
  }
}
```

Replace the example recipient with a number you control or have consent to contact. MCP uses the authenticated account's session access; it does not expose every REST operation as an AI tool.

## REST API

Use the `X-API-Key` header for server-to-server REST requests. Session ownership and route-specific permissions still apply.

List sessions:

```bash
curl -sS http://localhost:3000/api/sessions \
  -H 'X-API-Key: YOUR_API_KEY'
```

Send a text message through a connected session:

```bash
curl -sS -X POST \
  'http://localhost:3000/api/messages/YOUR_SESSION_ID/15551234567@s.whatsapp.net/send' \
  -H 'X-API-Key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hello from Whatsender MCP!"}'
```

Individual recipients use JIDs such as `15551234567@s.whatsapp.net`; group JIDs end in `@g.us`. Replace all example IDs and keys with your own values.

Explore the running app's **`/docs`**, **`/swagger`**, and **`/dashboard/api-docs`**, or browse [the API reference](docs/API_DOCUMENTATION.md). Supported routes cover sessions, chats, messages, contacts, groups, labels, schedules, auto-replies, broadcasts, profiles, webhooks, users, settings, and monitoring.

## Deployment

### Persistent Node.js server

Set `NODE_ENV="production"` in `.env`, use a strong `AUTH_SECRET`, and replace all public URL variables with your HTTPS domain. Then:

```bash
npm run build
npm start
```

Use a process manager or container restart policy to keep the custom server running. Use `npm start`, rather than `next start`, so Socket.IO, WhatsApp sessions, and background schedulers initialize together.

Back up PostgreSQL and runtime/media storage. Put a reverse proxy in front of the app and configure it to support WebSocket upgrades and unbuffered SSE connections. Stateless or short-lived function hosting does not fit this persistent-server architecture.

### Docker Compose

A [Dockerfile](Dockerfile) and [Compose configuration](docker-compose.yml) are included. Compose runs PostgreSQL and the application together.

Copy `.env.example` to `.env`, generate `AUTH_SECRET`, and set these Compose values alongside your public URL configuration:

```dotenv
PORT="3030"
DB_USER="whatsender"
DB_PASSWORD="REPLACE_WITH_A_STRONG_DATABASE_PASSWORD"
DB_NAME="whatsender_mcp"
DB_PORT="5432"
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="REPLACE_WITH_A_STRONG_ADMIN_PASSWORD"
BASE_URL="http://localhost:3030"
NEXTAUTH_URL="http://localhost:3030"
NEXT_PUBLIC_APP_URL="http://localhost:3030"
NEXT_PUBLIC_API_URL="http://localhost:3030/api"
```

```bash
docker compose up -d --build
docker compose logs -f app
```

Open `http://localhost:3030`. Compose overrides the application's database URL to use its `db` service and stores database data in a named volume, with `./data` mounted for application storage. Use HTTPS URLs when deploying publicly.

The bundled image currently uses Node.js 20; the local verification described below used Node.js 24. Review and test the container runtime before production deployment.

## Configuration

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. |
| `AUTH_SECRET` | Random secret for authentication. |
| `AUTH_TRUST_HOST` | Host trust setting for authentication behind your deployment proxy. |
| `PORT`, `HOSTNAME` | Server port and hostname configuration. |
| `BASE_URL`, `NEXTAUTH_URL` | Public application and authentication URLs. |
| `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL` | Browser-facing application and API URLs. |
| `APP_NAME` | Application-name fallback; saved system settings may override it. |
| `TZ` | Runtime timezone. Review scheduler and system timezone settings too. |
| `CORS_ALLOW_ORIGIN` | Allowed REST API origin; restrict it for your deployment as appropriate. |
| `BAILEYS_LOG_LEVEL` | WhatsApp engine logging verbosity. |
| `REMOVE_BG_API_KEY` | Optional background-removal integration for stickers. |

See [`.env.example`](.env.example) for the full template. Some legacy template settings remain; changing a flag does not necessarily enable a feature. Vendor automatic update checking is disabled in this edition—install updates manually.

## Development

| Command | Action |
| --- | --- |
| `npm run dev` | Start the custom development server. |
| `npm run build` | Generate Prisma Client and build Next.js. |
| `npm start` | Start the custom server; use production environment after building. |
| `npm run db:push` | Synchronize the Prisma schema and regenerate the client. |
| `npm run db:studio` | Open Prisma Studio. |
| `npm run make-admin -- EMAIL PASSWORD` | Create a superadmin, or promote an existing account. |
| `npm run lint` | Run ESLint. |
| `npx tsc --noEmit` | Run an explicit TypeScript check. |

`next.config.ts` currently skips TypeScript errors during the Next.js build, so run the explicit type check as well. Before applying schema changes to an existing deployment, back up the database and review the changes.

```text
src/app/                 Pages, dashboard, REST routes and MCP endpoints
src/components/          Shared UI, dashboard and landing-page components
src/lib/mcp.ts           MCP authentication, tool definitions and execution
src/modules/whatsapp/    Sessions, chat services, bots and scheduled jobs
src/server/              Custom Node.js server, bootstrap and Socket.IO
prisma/schema.prisma     PostgreSQL data model
scripts/                 Setup, administration and documentation utilities
docs/                    Guides, references and the README banner
```

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Database connection fails | PostgreSQL is running; the database exists; `DATABASE_URL`, user, password, and port are correct. |
| Missing tables or Prisma errors | Run `npm run db:push` for a new local installation; regenerate Prisma Client after schema changes. |
| Login fails | Use `/auth/login`; confirm the account exists. The admin setup script does not reset an existing password. |
| QR code or live status does not update | Start the custom server with `npm run dev` / `npm start`; check WebSocket proxy support and server logs. |
| Messages fail to send | Confirm the session is connected, the recipient JID is valid, and the account has access and quota. |
| MCP returns `401` | Check the API key and how the client sends it. |
| MCP cannot reach the gateway | A remote client cannot use your computer's `localhost`; provide a reachable endpoint and compatible transport. |
| Schedules run at unexpected times | Check the stored schedule, system timezone, and runtime `TZ`. |
| Update check says unavailable | Expected in this edition; automatic vendor update checks are disabled. |

## Documentation

- [User guide](docs/USER_GUIDE.md)
- [API documentation](docs/API_DOCUMENTATION.md)
- [API quick reference](docs/API-QUICK-REFERENCE.md)
- [Architecture and project documentation](docs/PROJECT_DOCUMENTATION.md)
- [Database setup](docs/DATABASE_SETUP.md)
- [Environment variables](docs/ENVIRONMENT_VARIABLES.md)
- [Installation guide](INSTALLATION_GUIDE.md)

Some supporting guides originate from the upstream project and may contain older branding or defaults. Use this README and the current source/configuration as the starting point for this edition.

## Verification status

Local checks performed on this edition include a production build, an explicit TypeScript check, Prisma validation, mocked licensing-removal regression checks, PostgreSQL startup, and local page rendering. Live WhatsApp delivery, every message type, every MCP client, and the Docker deployment have **not** all been verified end to end.

## Contributing

If this project helps you, consider giving it a ⭐ so others can discover it. Fork the repository to build your own integrations.

Bug fixes, documentation improvements, and tested integrations are welcome. Describe the problem, keep changes focused, and include reproduction steps and validation details. Never commit `.env` files, API keys, session credentials, database dumps, or private message/media data.

## License and credits

**Whatsender MCP is open source under the [MIT License](LICENSE.md).**

This edition and its modifications are written by **[Mohammad Aqib](https://codeupp.xyz/)**. You may use, modify, and redistribute the software under the MIT terms. Keep `LICENSE.md` with distributed copies and modifications to preserve its copyright and permission notices; preserve applicable upstream and third-party notices as well.

Based on the WA-AKG project, originally credited to **vinsaeroy**. Built with Next.js, React, Prisma, Baileys, Socket.IO, and the wider open-source ecosystem. WhatsApp is a trademark of its respective owner; this project is not affiliated with or endorsed by Meta.

---

<div align="center">

**Built with ❤️ by [Mohammad Aqib](https://codeupp.xyz/)**  
[codeupp.xyz](https://codeupp.xyz/)

</div>
