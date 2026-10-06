# Gather — Messaging App

A modern, responsive messaging client for direct conversations, group chats, people discovery, and profile management. The frontend uses the Next.js App Router, TypeScript, Tailwind CSS, and Socket.IO for live message updates.

## Features

- JWT-based sign-up and login, with guest accounts
- Direct and group conversations with image sharing
- Live message notifications over authenticated Socket.IO connections
- People and group discovery, follow/join workflows, and profile settings
- Responsive workspace navigation and realtime connection status

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS 4 and CSS Modules
- Socket.IO client
- Vitest, React Testing Library, and ESLint

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- The [Messaging App API](https://github.com/ChoforJr/messaging-app-api) running with PostgreSQL and Cloudinary configured

## Run locally

Start the API in one terminal:

```bash
cd messaging-app-api
npm install --legacy-peer-deps
npm run dev
```

Configure its `.env` with the database, JWT, and Cloudinary values described in the API README. Allow the Next.js origin:

```env
ALLOWED_URL1=http://localhost:3000
```

Then start the frontend in another terminal:

```bash
cd messaging-app
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_MESSAGING_APP_API_URL=http://localhost:5000
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run only one Next.js dev server for this project at a time. Development and
production builds both write generated files to `.next`; do not run
`npm run build` while `npm run dev` is active. If the dev server reports missing
client-manifest or route-chunk files, stop it, remove the generated `.next`
directory, and start `npm run dev` again.

## Scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — create the production build
- `npm start` — serve the production build
- `npm run typecheck` — check TypeScript
- `npm run lint` — run ESLint
- `npm test` — run Vitest once (suitable for CI)
- `npm run test:watch` — run Vitest in watch mode
- `npm run check` — run ESLint and TypeScript checks

Vitest is configured, but there are currently no test files; `npm test` will
report that condition and exit non-zero until tests are added.

## Project structure

```text
src/
├── app/                    # Next.js App Router pages and global styles
├── App Components/         # Shared workspace, data, and realtime connection
├── Chats Components/       # Direct and group conversations
├── Explore Components/     # People and group discovery
├── Account Components/     # Profile and account settings
├── HomePage Components/    # Sign-in and registration
├── lib/                    # Shared API configuration
└── types.ts                # Shared API and domain types
```

The Express API remains the source of truth for message persistence. After a successful REST write, it publishes a lightweight event over Socket.IO to the sender and intended recipient(s); clients then refresh persisted conversation data. This keeps realtime updates consistent with the existing database and upload flows.

## Deployment

Deploy the frontend to Vercel or another Node.js host with `NEXT_PUBLIC_MESSAGING_APP_API_URL` set to the public API URL. The API must be reachable over HTTP and WebSocket connections, and its CORS allowlist must include the deployed frontend origin.
