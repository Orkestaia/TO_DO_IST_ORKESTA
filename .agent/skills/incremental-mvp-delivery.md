---
name: incremental-mvp-delivery
description: Strategy for delivering value in vertical slices, prioritizing validation and stability.
---

# Incremental MVP Delivery Strategy

## Core Principle: Vertical Slices
Build features "Deep", not "Wide".
Instead of building the UI for *all* pages, then the DB for *all* pages... build ONE complete feature from DB to UI.

## Phase Strategy

### Phase 0: The Skeleton (Tracer Bullet)
- Goal: End-to-End connectivity.
- Deliverable: A user can log in, see a blank "Inbox", and logout.
- Checks: Auth works, DB connects, Deployment succeeds.

### Phase 1: The Core Loop (Capture)
- Goal: Get stuff out of head into system.
- Deliverable: Create a Task. See it in a list.
- Focus: Input UX, instant feeling, keyboard submission.

### Phase 2: Organization (Process)
- Goal: Structure the chaos.
- Deliverable: Create Projects. Move tasks to projects.
- Focus: Project model, Navigation between lists.

### Phase 3: Execution (Do)
- Goal: Manage the work.
- Deliverable: Complete tasks. Edit details. Set due dates.
- Focus: Checkbox satisfaction (interaction), sorting by date.

### Phase 4: Polish & Context
- Goal: Make it usable daily.
- Deliverable: Priorities, Labels (maybe), Filters (Today/Upcoming).
- Focus: Dashboard/Home view logic.

## Validation Gates
Before moving to the next Phase:
1. **Does it work?** (No critical bugs)
2. **Is it fast?** (Under 100ms interaction feel)
3. **Is the code clean?** (No technical debt left behind "for later")

## "YAGNI" (You Ain't Gonna Need It) Checklist
- Do I really need drag-and-drop right now? (No, sort by order field is enough).
- Do I really need recurring tasks with custom logic right now? (No, simple due date is enough).
- Do I really need 5 levels of sub-projects? (No, 1 level is enough).
- Do I really need a settings page with 50 options? (No, dark mode toggle is enough).

