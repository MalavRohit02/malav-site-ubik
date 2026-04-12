

## Fix Build Error + Current UI Architecture Document

### Build Error Fix

**File:** `src/lib/ubik-types.ts` line 103
**Issue:** `LinkedItem.kind` union type is missing `"meeting"`. The data in `ubik-data.ts` line 356 uses `kind: "meeting"` but the type only allows `"workflow" | "report" | "approval" | "file" | "chat"`.
**Fix:** Add `"meeting"` to the `LinkedItem.kind` union type.

---

### Current UI Architecture Document

Below is the document you can share with your coding agent alongside the screenshots.

---

# UBIK — Current UI Architecture (April 2026)

## Design System

- **Palette:** `#af2309` (red), `#000000` (black), `#ffffff` (white). No greys. Secondary text uses `rgba(0,0,0,0.5)` in light mode, `rgba(255,255,255,0.5)` in dark mode.
- **Typography:** JetBrains Mono for all system labels, nav, section headings, badges. Inter for body/descriptions.
- **Geometry:** 0px border-radius everywhere. 1px borders. No decorative shadows.
- **Primitives** (`src/components/ubik-primitives.tsx`): `Surface` (bordered card), `SectionHeading` (eyebrow + title + description), `StatusPill` (mono label badge with tone variants: default/alert/success/muted), `SmallButton`, `Metric`.

## Shell Layout (`src/components/Shell.tsx`)

The shell wraps all pages in a horizontal flex layout:

```text
┌──────────┬───────────────────────────────────────────┐
│          │  WorkbenchTabs (draggable tab bar)         │
│          ├───────────────────────────────────────────┤
│ AppSidebar│  TopBar (description + action buttons)    │
│          ├───────────────────────────────────────────┤
│          │  Main content    │ RightDrawer │ Runtime  │
│          │  (page route)    │ (optional)  │ (optional)│
└──────────┴───────────────────────────────────────────┘
```

- **SidebarProvider** wraps everything, sidebar width `18rem` expanded / `5.75rem` collapsed.
- **SidebarInset** contains the workbench tabs, top bar, and main content area.

## Sidebar (`src/components/AppSidebar.tsx`)

Uses shadcn `<Sidebar collapsible="icon">`. Sections:

1. **Header:** `[ UBIK ]` wordmark (collapses to `[U]`) + collapse toggle button.
2. **Create button:** Opens `CommandPalette` via `⌘K`. Shows `✦ Create` label + keyboard shortcut hint.
3. **NAVIGATE section** (collapsible): Know Anything (`/`), Inbox (`/inbox`, badge "12"), Meetings (`/meetings`), Projects (`/projects`), Intelligence (`/intelligence`, status dot "watching"), Approvals (`/approvals`, badge "4").
4. **PLAYBOOKS section** (collapsible): Workflows (`/workflows`, status dot "live"), Agents (`/agents`, status dot "healthy").
5. **Divider**
6. **PINNED section** (collapsible, expanded state only): Up to 5 items with pin icon, type icon, title, subtitle. Static mock data. "More" link.
7. **RECENTS section** (collapsible, expanded state only): Up to 6 items with title + time. Includes a search input to filter. "More" link.
8. **Footer:** Archive, Settings, Help nav links. Profile row ("Hemanth Rao" + initials avatar + dropdown: Profile, Environment, Sign Out). Metadata line: `Business · Prod · v1.0.4`.

**Status indicators:** Items can have `badge` (count in bordered pill) or `status` (small colored dot — `live`=red, `watching`=amber via red opacity, `healthy`=green via opacity, `urgent`=red).

**Active state:** Active nav item gets `bg-sidebar-primary text-sidebar-primary-foreground` (red bg, white text in current theme).

**Collapsed state:** Icon-only rail. Pinned/Recents/section labels hidden. Tooltips on hover via shadcn. Badges not visible in collapsed state currently.

## Workbench Tabs (`src/components/WorkbenchTabs.tsx`)

- Horizontal draggable tab bar at the top of `SidebarInset`.
- Default tabs: Know Anything (non-closable), Inbox, Meetings, Projects.
- Max 8 tabs. "+" button opens a dropdown to add tabs for any route.
- Active tab: dark bg (`#1f1f1f`). Inactive: light border. Temporary tabs (e.g. temp chat): red-tinted styling.
- Each tab has a close (X) button visible on hover or when active.
- Right side: Notification bell (opens drawer with alerts) + Theme toggle (light/dark).

## Top Bar (`src/components/TopBar.tsx`)

- Shows route description text on the left (from `routeMetas` data).
- Action buttons on the right (defined per route in `routeMetas`). E.g. "New Thread" + "Share" on Know Anything, "Sort" + "Filter" on Inbox.
- The "Share" action on Know Anything opens a share popover with access level selector (Only me / Team / Public) + copy link.
- Ghost icon button on Know Anything page opens a temporary chat tab.

## Command Palette (`src/components/CommandPalette.tsx`)

- Triggered by `⌘K` or clicking the Create button in sidebar.
- Full-screen overlay with centered modal (~680px wide).
- Search input at top.
- Sections: SUGGESTED (Compose message, Setup project, Prepare meeting, Learn with UBIK), QUICK ACTIONS (Summarize priorities, Draft delay notice, Run compliance check, Generate digest), AGENT WORKFLOWS (Market rate scan, Competitor analysis, Revenue estimates, Scrape EXIM data), DATA (Fetch pending approvals, Pull today's schedule).
- Keyboard navigation: arrow keys + Enter to execute.
- Commands trigger actions: open drawers, create tabs, navigate, seed chat composers, open runtime panels.

## Floating Chat (`src/components/FloatingChat.tsx`)

- Fixed at bottom center of viewport (`max-w-[640px]`).
- Textarea with placeholder "Ask anything... use @ to mention tabs, skills, agents".
- `@` mention system: typing `@` opens a dropdown grouped by type (TABS, SKILLS, AGENTS, CHATS). Arrow keys + Enter/Tab to select.
- Paperclip button (attachment), model selector dropdown ("GPT-4"), Send button.
- Focus mode: `onFocusChange` callback (currently wired but overlay implementation may vary).

## Right Panels (`src/components/ShellPanels.tsx`)

- **RightDrawer** (340px, hidden below `xl`): Shows contextual detail — title, eyebrow, description, metadata key-value pairs, timeline/trace items, recommended actions. Opened via `openDrawer()`.
- **RuntimePanel** (360px, hidden below `2xl`): Shows execution/runtime state — title, status pill, terminal-style output lines (dark bg), artifact label. Opened via `openRuntime()`.

## Pages

### Know Anything (`/` — `src/pages/Index.tsx`)
- Centered composer layout. Greeting: "Back at it, Hemanth" (red) + "START WITH A QUESTION OR A TASK" (mono).
- Source selection toolbar: `+` button opens nested menus (Recent files, Connectors with Gmail/Zoho/Salesforce/Linear/Slack/Google Drive/Outlook Drive, Extended options with Deep Research and Agent Mode). Pinned source toggles: Organization Knowledge, Files, Internet.
- Mode selector: Light / Speed / Max toggle strip.
- Textarea with placeholder. Send button (red arrow).
- Below textarea: active context chips showing selected connectors/attachments (removable).

### Inbox (`/inbox` — `src/pages/Inbox.tsx`)
- List-detail layout (`340px` list + detail panel).
- Filter bar: All / Action required / Waiting / Reviewed.
- Thread list: sender, time, subject, preview, priority pill (Critical/High/Medium), source pill (Email/Slack/WhatsApp/System). Active thread has red left border.
- Detail panel: source + status header, subject, preview. Extracted tasks with icons. Recommended reply with Preview + Provenance buttons. Attachments section.

### Meetings (`/meetings` — `src/pages/Meetings.tsx`)
- 3-column layout: Meeting list (300px) | Central detail | Right context (280px).
- Meeting list: grouped by stage (Upcoming/Completed), title, time.
- Central: time, title, summary, agenda + decisions in 2-col grid.
- Right column: Participants (pills), Action Items, "Open right panel" button.

### Projects (`/projects` — `src/pages/Projects.tsx`)
- List-detail layout (320px index + detail).
- Project index: code, status pill, name, summary, progress bar.
- Detail: code, name, summary, owner + status pills. Milestones table with state pills (Done/Active/Upcoming). Team pills + Next actions. Linked Context section with typed cards (workflow/chat/approval/report) + arrow icons + Inspect button.

### Intelligence (`/intelligence` — `src/pages/Intelligence.tsx`)
- Simple 3-column grid of monitor cards.
- Each card: source type pill (Policy Monitor/Pricing Monitor/Research Agent), radar icon, title, summary, freshness timestamp.

### Approvals (`/approvals` — `src/pages/Approvals.tsx`)
- List-detail layout (320px queue + detail).
- Filter: All / Urgent / Review.
- Queue list: workflow name, status pill, title, input summary.
- Detail: workflow, title, confidence % pill. Recommendation + Input summary in 2-col. Approve/Reject/Inspect buttons. Available actions pills.

### Workflows (`/workflows` — `src/pages/Workflows.tsx`)
- Top metrics row: Library count, Runs live, Awaiting approval.
- Left column (320px): Workflow library (cards with name, approval mode pill, description, cadence) + Run queue (selectable cards with name, status, timestamp).
- Right detail: owner, name, summary, status pill. Execution trace (step list with status pills + arrows). Artifacts (pills) + Open runtime / Inspect queue buttons.

### Agents (`/agents` — `src/pages/Agents.tsx`)
- 3-column grid of agent cards.
- Each card: last run timestamp, name, status pill (Healthy/Watching/Paused), summary, linked workflow, approval mode note.
- Bottom: Monitoring Notes section with 3 design philosophy cards.

### Archive (`/archive` — `src/pages/Archive.tsx`)
- Table layout: Record, Type, Updated, Owner columns.

### Settings (`/settings` — `src/pages/Settings.tsx`)
- 3-column grid of section cards (Environment, Connectors, Preferences). Each with key-value pairs.

### Help (`/help` — `src/pages/Help.tsx`)
- 3-column grid of resource cards with title, description, action button.

## State Management (`src/components/shell-state.tsx`)

- `ShellStateProvider` wraps the entire app inside `SidebarProvider`.
- Manages: tabs array, active tab ID, closed tabs (for reopen), drawer content, runtime content, command palette open state, per-tab page state map.
- `useWorkbenchState(slot, fallback)` hook gives per-tab scoped state (key = `${activeTabId}:${slot}`).
- Tab operations: create, close, select, duplicate, move, reorder, pin/unpin, reopen closed.
- Know Anything has special handling: pristine detection, reset, fresh/temporary tab creation.
- Max 8 tabs enforced with a drawer notification.

## Data Layer (`src/lib/ubik-data.ts` + `src/lib/ubik-types.ts`)

All data is static mock data defined in `ubik-data.ts` with TypeScript types in `ubik-types.ts`. Key exports:
- `routeMetas` — route metadata (key, title, path, description, actions)
- `navigationItems` — sidebar nav items with section grouping, badges, status
- `initialWorkbenchTabs` — default open tabs
- `pinnedItems` — 5 pinned sidebar items
- `recentItems` — 6 recent sidebar items
- `inboxThreads` — 4 inbox threads with full detail
- `meetings` — 3 meetings
- `projects` — 3 projects with milestones, linked context, team
- `approvals` — 3 approval items
- `workflowDefinitions` — 3 workflow templates
- `workflowRuns` — 3 workflow run instances with steps
- `agents` — 3 agent records
- `intelligenceRecords` — 3 intelligence monitors
- `archiveRecords`, `settingsSections`, `helpResources`
- `chatSignals`, `starterActions`, `quickConnections`, `chatRecentWork`

## Routing (`src/App.tsx`)

All routes wrapped in `<Shell>`:
`/` (Know Anything), `/chat` (alias), `/inbox`, `/meetings`, `/projects`, `/intelligence`, `/approvals`, `/workflows`, `/agents`, `/archive`, `/settings`, `/help`, `*` (NotFound)

## Key Patterns

1. **Every page** uses `Surface` for cards, `SectionHeading` for page headers, `StatusPill` for badges, `SmallButton` for actions.
2. **List-detail** pattern (Inbox, Projects, Approvals, Workflows): left list panel + right detail area.
3. **Drawer + Runtime** panels are globally available, opened from any page via `openDrawer()` / `openRuntime()`.
4. **Workbench tabs** maintain multi-tab navigation state with URL sync (`?tab=` query param).
5. **Per-tab state** via `useWorkbenchState` ensures each tab keeps its own filter/selection state.

