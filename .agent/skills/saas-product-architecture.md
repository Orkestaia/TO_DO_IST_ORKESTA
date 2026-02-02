---
name: saas-product-architecture
description: Guide for MVP scoping, long-term evolution, and avoiding premature complexity in SaaS products.
---

# SaaS Product Architecture & MVP Strategy

## Core Philosophy
Build for today, design for tomorrow. Do not over-engineer the present for a future that may never happen, but do not paint yourself into a corner.

## 1. The MVP Scope: "Earliest Lovable Product"
The goal is not just "viable" but "valuable".
- **Focus:** Solve ONE core problem exceptionally well (Task Management).
- **Scope:** 
    - Essential CRUD (Create, Read, Update, Delete)
    - Core organization (Projects, Sections/Labels)
    - Basic productivity features (Due dates, Priorities)
    - Solid User Identity & Security (Auth, RLS)
- **Out of Scope for MVP:**
    - AI integration (unless core value prop)
    - Complex collaboration/Teams
    - Integrations with 3rd party tools (Calendar, etc.) - keep for V2
    - Native Mobile Apps (PWA first)

## 2. Architecture Principles
- **Monolith First:** Stick to a modular monolith (Next.js) until you *need* microservices (you likely won't).
- **Serverless-Ready:** Use serverless-friendly patterns (stateless auth, external db connection pooling).
- **Type Safety:** End-to-end type safety is non-negotiable (TypeScript + Database Types).

## 3. Avoiding Premature Complexity
- **Don't** build a custom auth system. Use Supabase Auth.
- **Don't** build a custom notification engine yet. Use simple transactional emails/toasts.
- **Don't** implement complex caching layers (Redis) until performance metrics demand it. Postgres is fast enough for a long time.
- **Don't** genericize everything. It's okay to write specific code for specific features.

## 4. Scalability Strategy
- **Database:** Postgres is your bottleneck. Design schemas carefully. Use indexes.
- **Frontend:** Server Components for data fetching. Client Components for interactivity. Minimize client-side JS.
- **Assets:** Offload to object storage (Supabase Storage) and CDN.

## 5. Decision Framework
When adding a feature or technology, ask:
1. Does this directly support the core MVP goal?
2. Is this the simplest thing that could possibly work?
3. Is this a "one-way door" decision? (If yes, deliberate. If no, move fast.)
