---
name: nextjs-app-router-expert
description: Guidelines for building robust, scalable applications with Next.js App Router.
---

# Next.js App Router Expert Guidelines

## 1. Directory Structure
Adhere to a feature-first or strict layered architecture.
```
src/
  app/
    (auth)/           # Route groups for isolation
      login/
      signup/
    (dashboard)/      # Protected routes
      app/
        layout.tsx    # Main app shell (Sidebar, etc.)
        page.tsx      # "Today" or "Inbox" view
        project/
          [projectId]/
            page.tsx
  components/
    ui/               # Primitives (Button, Input) - Shadcn/ui compatible
    domain/           # Feature-specific components (TaskItem, ProjectList)
  lib/
    supabase/         # Supabase clients (server, client)
    utils.ts          # Helpers
    actions/          # Server Actions
  types/              # TypeScript definitions
```

## 2. Server Components vs Client Components
- **Default to Server Components.**
- **"Leaf" Interactivity:** Push `use client` down to the lowest possible nodes (e.g., a generic `LikeButton` or `TaskCheckbox`, not the whole `TaskList`).
- **Data Fetching:** Fetch data directly in Server Components (Page/Layout level) using Supabase Server Client. Pass data down as props.

## 3. Server Actions & Mutations
- **No API Routes:** Use Server Actions for mutations (POST/PUT/DELETE).
- **Validation:** Validate inputs with Zod *inside* the Server Action.
- **Auth Checks:** *Always* verify auth session inside the Server Action before mutating data.
- **Revalidation:** Use `revalidatePath` or `revalidateTag` to update the UI after a mutation.
- **Optimistic Updates:** Use `useOptimistic` hook in Client Components for instant feedback on actions like "Complete Task".

## 4. Auth & Middleware
- Use Middleware only for route protection (redirecting unauthenticated users).
- Do *not* read detailed user data in Middleware (it blocks the request). Just check session existence.
- Establish a "User Context" or simply fetch `getUser` in the root layout/logic-abstractions.

## 5. UI/UX Patterns
- **Loading:** Use `loading.tsx` for route transitions.
- **Streaming:** Use `<Suspense>` boundaries for slow data parts (e.g., sidebar counts).
- **Url State:** Store transient UI state (filters, sort order) in URL search params when possible to make views shareable and persistent.

## 6. Anti-pattern Warnings
- ❌ Fetching data in `useEffect` (unless strictly necessary for client-only dynamic data).
- ❌ Passing complex objects (Date, Function) from Server to Client components (pass serializable JSON).
- ❌ "Prop drilling" deeply - use composition or context (sparingly).
