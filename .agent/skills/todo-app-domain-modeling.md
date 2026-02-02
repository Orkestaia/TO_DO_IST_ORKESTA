---
name: todo-app-domain-modeling
description: Detailed domain modeling for a Todoist-like task management application.
---

# Todo App Domain & Data Modeling

## 1. Core Entities

### User (Profile)
- `id`: UUID (matches Auth ID)
- `email`: String (Unique)
- `full_name`: String
- `avatar_url`: String
- `preferences`: JSONB (Theme, localized date format, etc.)
- `created_at`: Timestamptz

### Project
- `id`: UUID
- `owner_id`: UUID (Reference to User)
- `name`: String
- `color`: String (Hex or Enum)
- `view_style`: Enum ('list', 'board')
- `is_favorite`: Boolean
- `parent_id`: UUID (Self-reference for nested projects)
- `order`: Integer (for manual sorting)
- `is_archived`: Boolean

### Section (Optional for MVP, but good for "Board" view)
- `id`: UUID
- `project_id`: UUID
- `name`: String
- `order`: Integer

### Task (Item)
- `id`: UUID
- `content`: String (The task title)
- `description`: Text (Optional details)
- `project_id`: UUID (Nullable - if null, it's in "Inbox")
- `section_id`: UUID (Nullable)
- `parent_id`: UUID (Nullable - subtasks)
- `owner_id`: UUID
- `is_completed`: Boolean
- `priority`: Integer (1=Normal, 2=Medium, 3=High, 4=Urgent)
- `due_date`: Date/Timestamptz (Nullable)
- `due_string`: String (Optional, for natural language parsing retention e.g., "every monday")
- `completed_at`: Timestamptz
- `order`: Integer (Child order within project/section/parent)

### Label (Tag) - Phase 2?
- `id`: UUID
- `name`: String
- `color`: String
- `owner_id`: UUID

## 2. Key Lifecycle States
- **Inbox:** Tasks with `project_id = null`.
- **Today:** Tasks with `due_date = current_date`.
- **Upcoming:** Tasks with `due_date > current_date`.
- **Completed:** Tasks where `is_completed = true`. Note: Often users want to see completed tasks *within* the project context or a separate log.

## 3. Relationships & constraints
- **Ownership:** Everything belongs to a User.
- **Hierarchy:** Projects can contain Projects. Tasks can contain Tasks. (Limit nesting depth in UI, maybe 3-4 levels).
- **Orphan Prevention:** Deleting a Project should cascade delete its Tasks (or move them to Inbox - *Design Decision needed*).

## 4. Recurrence (Design Thinking)
*Do not implement complex recurrence logic in the DB yet.*
- Store the *rule* (e.g., RRule string or a structured JSON).
- When a recurring task is completed, logic (Server Action or Trigger) creates the *next* instance of the task based on the rule. The "completed" instance stays completed.
- *For MVP:* Simple "daily", "weekly" flags might suffice, or stick to a single `due_date` and implement recurrence logic in application code later.

## 5. Performance Considerations
- **Ordering:** Maintain a `order` field (floating point or large integer gap) to allow drag-and-drop reordering without rewriting all rows.
- **indexes:** Index `owner_id`, `project_id`, `due_date`, `is_completed`.

