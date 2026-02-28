# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build → /dist
npm run preview   # Serve production build locally
npm run lint      # ESLint (flat config, v9)
```

No test runner is configured.

## Architecture

Fully client-side React 19 SPA — no backend, no API, no database. All state persists to `localStorage` under the key `chore-calendar-v1`.

### State Management

Global state lives in `src/context/` and uses `useReducer` + React Context:

- **`AppContext.jsx`** — provider + `useAppState()` hook. Auto-syncs to localStorage on every state change.
- **`reducer.js`** — all mutations (members, chores, history, notifications).
- **`actions.js`** — action type constants.

State shape:
```js
{
  members: [{ id, name, role, avatarColor, createdAt }],
  chores:  [{ id, title, description, date, recurrence, recurrenceEnd, assigneeIds, completedDates, color, createdAt }],
  history: [{ id, choreId, choreTitle, memberId, date, completedAt }],
  notifications: { enabled, minutesBefore }
}
```

Dates are stored as `'yyyy-MM-dd'` strings. IDs are generated with `nanoid()`.

### Chore Expansion (Recurrence)

Chores stored in state are templates. `expandChores(chores, windowStart, windowEnd)` in `src/utils/choreUtils.js` generates virtual instances for a date range. Supported recurrence: `once`, `daily`, `weekly`. Instance keys use the format `choreId::instanceDate`.

Every calendar view calls `expandChores` → `filterByMember` → `groupByDate` before rendering.

### Calendar Views

`src/components/calendar/CalendarRouter.jsx` switches between four views based on `currentView` from the `useCalendarNav` hook:

| View | Component | Key behaviour |
|------|-----------|---------------|
| month | `MonthView.jsx` | 7-col grid, max 3 chores/cell, "+N more" |
| week | `WeekView.jsx` | 7-day columns |
| day | `DayView.jsx` | Single day list |
| agenda | `AgendaView.jsx` | Flat chronological list |

Keyboard shortcuts (wired in `App.jsx`): `m` month, `w` week, `d` day, `a` agenda, `n` new chore, `t` today.

### Drag & Drop

`src/components/dnd/DndProvider.jsx` wraps the app with `@dnd-kit/core`. Dropping a chore onto a day dispatches `RESCHEDULE_CHORE`. Droppable targets use the ID format `day::yyyy-MM-dd`.

### Key Utilities

| File | Purpose |
|------|---------|
| `src/utils/choreUtils.js` | `expandChores`, `filterByMember`, `groupByDate` |
| `src/utils/dateUtils.js` | `getMonthGrid`, `getWeekDays`, `toDayKey`, `fromDayKey` |
| `src/utils/statsUtils.js` | `buildLeaderboard`, `calcStreak`, `computeStats` |
| `src/utils/storageUtils.js` | `readStorage`, `writeStorage`, `getInitialState` |

### Styling

Tailwind CSS 3 with a custom config in `tailwind.config.js`:
- 12 avatar colors and 9 chore colors defined as custom palette
- Custom animations: `fade-in` (0.15s), `slide-up` (0.2s)
- Background tint: `#fdf4ff`
- Utility: `.scrollbar-hide`

Use `clsx` + `tailwind-merge` (via the `cn` pattern) for conditional class merging.

### Component Conventions

- `src/components/ui/` — base primitives (`Modal`, `Button`, `Badge`, `ColorPicker`, `ConfirmDialog`, `EmptyState`)
- `Modal.jsx` handles escape key, body overflow, backdrop blur, and size variants (`sm`, `md`, `lg`, `xl`)
- `Button.jsx` has variants (`default`, `primary`, `secondary`, `ghost`) and sizes (`sm`, `md`, `lg`, `icon`)
- Notifications use the browser Notification API, scheduled via `src/hooks/useNotifications.js`
