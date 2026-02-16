# AGENTS.md — 1UP Conventions

FILE IN PROJECT MUST BE EDITED VIA apply_patch, NEVER POWERSHELL

## Purpose
This file defines the conventions for structure, style, and responsibility boundaries across the 1UP codebase.

## Core Priorities
1. Plynulost: maximal performance, shortest possible execution, heavy reuse.
2. Čistota: readability and clarity.
3. Spojování: build intelligent universal APIs that reduce complex problems into simple tools.

## General JavaScript Rules
1. One file: max 150–200 lines.
2. One function: max 30–50 lines.
3. Dominant strategy: branchless.
4. Prefer map-based dispatch over if/else or switch when it improves clarity.
5. Shared functionality must be extracted into helpers. Minimal tolerance for copy/paste.
6. Strict separation of logic and UI.
7. Backend controllers stay thin; reusable logic lives in shared/internal APIs.

## Branchless Strategy
1. Use guard clauses and early returns.
2. Use object/Map dispatch for strategy selection.
3. Avoid deep nesting.

## Top-Level Layout
1. Framework: @randajan/simple-app.
2. Entry point: index.js at repo root.
3. Root may contain drive/db/store or similar infrastructure folders.
4. Main directory: /src with:
   - /arc shared code (frontend + backend)
   - /backend backend-only
   - /frontend frontend-only
   - /public static assets copied before frontend build
   - /env environment config

## Backend Structure
1. /controllers defines routes automatically (via index.js).
2. /assets contains project-specific internal packages.
3. /modules contains more general packages intended for later extraction.
4. /bots database triggers.
5. /cron scheduled tasks and cron/index loader.
6. /bifrost controllers for @randajan/bifrost.

## Frontend Rules
1. React + .scss.
2. Each component has its own folder named after the component.
3. In each component folder:
   - Component.jsx
   - Component.scss
4. One JSX component: max 50–150 lines.
5. Exactly one .scss per component folder.
6. Complex logic goes into helper .js files inside the same folder.
7. Large components can have subcomponents in their own folders.
8. Subcomponents used only by a parent must live under the parent folder.

## Frontend Core Folders
1. /config initialization (plain JS).
2. /elements universal reusable components.
3. /frames project-specific composite components without their own route.
4. /hooks project-specific hooks.
5. /tools or /tools.js shared utilities (split into folder if file is too long).
6. /styles global styles loaded first (main: /styles/_roots.scss).
7. /pages router definitions.

## Routing Conventions
1. Use createRouter from @randajan/jet-react/dom/router.
2. Use Link from @randajan/jet-react/dom/link everywhere.

## jet-react Conventions
1. Use Block for semantic headings.
2. Block chooses heading level automatically per context.
3. Caption is used with Block for titles/subtitles.

## Naming & Consistency
1. Use consistent casing in filenames and folders.
2. Avoid typos and near-duplicate names.
3. Prefer .scss over .css across the project.
4. Keep file names descriptive and aligned to exported symbols.

## Shared Logic Placement
1. FE+BE shared logic belongs in /arc.
2. Backend controllers must not contain business logic.
3. Frontend UI must not own business logic.

## Refactor Rule
If a file you touch violates these rules, refactor to comply when reasonable.

---

## Notes and Suggested Cleanups
1. Unify cron naming: use /cron (not /crone).
2. Clarify /assets vs /modules:
   - /assets = project-specific
   - /modules = extractable/reusable
3. Clarify /frames vs /pages vs /elements:
   - /pages = routable screens
   - /frames = large non-routable composites used once
   - /elements = small reusable components
4. Decide on /tools folder vs /tools.js file; use only one.
5. Eliminate typos in filenames (e.g. meaasureText.js) when touched.
6. If mixing .css and .scss exists, migrate to .scss when touching files.
