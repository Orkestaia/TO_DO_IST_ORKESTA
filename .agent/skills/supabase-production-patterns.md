---
name: supabase-production-patterns
description: Guidelines for using Supabase in a production-grade environment with high security and performance.
---

# Supabase Production Patterns

## 1. Schema & Migrations
- **Source of Truth:** The Postgres Schema is the source of truth.
- **Migrations:** Never modify the database via the dashboard in production. Use a migration workflow (local dev -> logical replication or migration scripts). *For this Agentic workflow, use Supabase MCP `apply_migration` or `execute_sql` carefully and document changes.*
- **Naming:** use `snake_case` for table and column names.
- **Primary Keys:** Use `uuid` (`gen_random_uuid()`) for primary keys.

## 2. Row Level Security (RLS)
- **Enable Always:** RLS must be enabled on ALL tables.
- **Policies:**
  - `SELECT`: Users can see their own data (`auth.uid() = owner_id`).
  - `INSERT`: Users can create data where they are the owner (`auth.uid() = owner_id`).
  - `UPDATE`: Users can update their own data.
  - `DELETE`: Users can delete their own data.
- **Performance:** Avoid complex joins in RLS policies if possible. They run on every row.

## 3. Auth & Users
- Use the `auth` schema for authentication.
- **Public Profile Pattern:** Create a `public.profiles` table that references `auth.users`.
  - Use a Trigger (`after insert on auth.users`) to automatically create the profile entry.
  - This keeps your application logic decoupled from Supabase internal schemas.

## 4. Performance & Indexes
- **Foreign Keys:** Always index columns used in foreign keys (`user_id`, `project_id`).
- **Filtering:** Index columns frequently used in `WHERE` clauses (`is_completed`, `due_date`).
- **Views:** Use Postgres Views for complex aggregations if the frontend needs a summary (e.g., "Overdue Task Count").

## 5. Agent/MCP Interaction
- **Inspect First:** Before creating a table, list tables to see what exists.
- **Safe Execution:** When running SQL via MCP, wrap in transactions if multiple steps are involved (though tool limits might apply).
- **Verification:** After creating a table/policy, try to fetch/insert to verify it works as expected.

## 6. Type Generation
- Keep local TypeScript types in sync with the DB schema.
- Use `supabase gen types` (if available via CLI) or manually maintain strict interfaces that mirror the DB shape.

