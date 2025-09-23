# Why Creator Control Room had to exist

Agencies juggle many creators across Twitch (and sometimes Discord) with no single, tenant-aware place to see what’s happening right now. That means missed live events, tab-hopping, weak auditability, and no clean separation across client brands. Creator Control Room gives agencies a real-time, multi-tenant “NOC view” with strict data isolation and a brandable UI.

# What was used — and why

## Frontend

    •	Next.js (React, TypeScript) – Fast DX, type safety, and a smooth SPA/SSR mix for dashboards.
    •	Socket.IO client – Reliable realtime (auto-reconnect, heartbeats) and simple “rooms” semantics for per-tenant streams.

## Backend (on Google Cloud Run)

    •	Node.js + Express – Simple, proven HTTP framework for REST, JSON parsing, CORS, health checks, and structured logs.
    •	Socket.IO server – Pushes live events to rooms (e.g., room:company:{id}, room:creator:{id}) so each tenant only sees their own data.
    •	Why Cloud Run – Managed containers with HTTPS out of the box, autoscaling to zero for spiky traffic, and no server ops. Perfect for webhook endpoints + REST + Socket.IO in one service.

## Realtime scale-out

    •	Socket.IO Redis adapter – Ensures broadcasts reach users even when Cloud Run scales to multiple instances. (Backed by a managed Redis like Memorystore via VPC connector or a hosted Redis such as Upstash.)

## Ingestion

    •	Twitch EventSub → Cloud Run HTTPS endpoint – HMAC-verified webhooks hit your service directly; no Lambda needed. Normalize → persist → emit over Socket.IO.

## Data

    •	Amazon Aurora PostgreSQL Serverless v2 — Operational “hot” store:
    •	Strong relational model for companies/users/members/creators.
    •	Row-Level Security (RLS) for hard multi-tenant isolation using a per-request GUC (SET LOCAL app.company_id).
    •	JSONB payloads for flexible event bodies.
    •	RDS Proxy to pool connections for Lambdas/ECS.
    •	Why Postgres (vs Dynamo/Mongo): native RLS, transactions, joins, JSONB when you need schema-flex, and easy analytics for short lookbacks.
    •	S3 (assets + archives) — Logos/exports + cheap long-term event history.
    •	Pre-signed PUTs (tenant-scoped key prefixes) for branding assets.
    •	Event archives as NDJSON/Parquet → future Athena queries.
    •	Lifecycle rules keep costs down (IA/Glacier).

## Security

    •	JWT auth (custom RS256) – Your service validates access tokens and sets app.company_id per request before touching the DB.
    •	RLS policies – Enforce tenant isolation on every tenant table (creators, events, audit_logs, etc.).

## Testing & CI/CD

    •	Jest (unit/integration) + socket.io-client tests + Playwright (E2E) – Proves isolation and realtime behavior end-to-end.
    •	GitHub Actions – Lint, typecheck, tests, coverage gate ≥80%, build container, and deploy to Cloud Run.

## How it flows

    1.	Webhook arrives (Twitch) → verify HMAC → normalize.
    2.	Persist into Postgres (RLS-guarded) and broadcast a compact event to the proper Socket.IO rooms (via Redis adapter).
    3.	Dashboard updates live (filters by creator/topic, company branding).

## Intentional trade-offs

    •	Shared-schema + RLS (simple, secure) over separate DBs per tenant (heavy ops).
    •	Socket.IO (rooms, reconnection) over raw WebSocket/SSE (less boilerplate).
    •	Cloud Run (managed HTTPS + autoscale) over self-managed compute (less ops).
    •	Postgres hot store + optional GCS archives over heavy OLAP now (you can add ClickHouse/Athena later if needed).

## What this gives agencies

    •	A single live control room for many creators.
    •	Hard data isolation per client for trust and compliance.
    •	Faster incident response (stream up/down, raids/spikes) plus auditable admin actions.
    •	Brandable, professional UI and a clean path to deeper analytics later.
