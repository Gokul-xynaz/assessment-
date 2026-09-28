# Stacks - Task Board

A robust, stable, and minimally designed task management board built with Next.js (App Router), Tailwind CSS, and Framer Motion. 

## Features

- **Intuitive Drag and Drop**: Smooth task movement across columns using `@dnd-kit`.
- **Bulletproof Stability**: Built to handle rapid clicking, hostile inputs, and cross-tab syncing without crashing.
- **Micro-interactions**: Delightful yet restrained animations powered by Framer Motion, with a muted confetti burst that respects `prefers-reduced-motion`.
- **Undo Functionality**: Safe deletion with a 5-second undo toast queue, avoiding jarring confirmation dialogs.
- **Smart Filtering**: Memoized real-time search and priority filtering.
- **Accessibility (A11y)**: Full keyboard use, focus trapping in modals, visible `:focus-visible` rings, and proper ARIA labels.
- **Local Persistence**: Versioned `localStorage` with corrupted-data validation, quota-exceeded fallback to in-memory state, and hydration mismatch prevention.

## Setup & Scripts

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Production build & start:**
   ```bash
   npm run build
   npm run start
   ```

4. **Linting:**
   ```bash
   npm run lint
   ```

## Folder Structure

```
task-board/
├── app/
│   ├── layout.js          # Global layout, fonts, theme provider
│   ├── page.js            # Main page, renders <Board />
│   ├── error.js           # Global ErrorBoundary fallback
│   └── globals.css        # Tailwind setup, CSS variables
├── components/
│   ├── board/             # Board, Column, EmptyState components
│   ├── task/              # TaskCard, TaskModal, PriorityBadge
│   ├── layout/            # Header, Footer
│   └── ui/                # ThemeToggle, Toast, Confetti
├── hooks/
│   ├── useLocalStorage.js # Robust storage sync & memory fallback
│   └── useTasks.js        # Global Context provider for tasks state
└── lib/
    ├── columns.js         # Column configurations
    ├── constants.js       # Magic numbers and storage keys
    └── utils.js           # Tailwind merger, date parsers, ID generators
```

## Engineering Decisions

- **Storage & Stability**: `localStorage` was chosen for frictionless persistence. To make it bulletproof:
  - Data is versioned (`version: 1`).
  - Fetched data is strictly validated to discard corrupted entries.
  - Read/writes are wrapped in `try/catch` with an in-memory fallback for environments with QuotaExceeded errors or private browsing mode.
  - A `storage` event listener ensures cross-tab synchronization.
- **Hostile Use Handling**: 
  - Rapid spamming of Add/Save actions is mitigated by debounce queues and strict focus locking.
  - Inputs are heavily sanitised (max lengths capped, text trimmed, DOM strictly uses text nodes over `dangerouslySetInnerHTML`).
  - Search is debounced and filtering is memoized to handle 500+ tasks without lag.
- **Dates**: Due dates are handled using local calendar day math instead of pure UTC timestamps. This avoids bugs where a timezone offset mistakenly shifts a "Due today" task to "Tomorrow".
- **State Management**: A unified Context (`TasksProvider`) is used to broadcast task state across the app. This isolates the storage logic and prevents prop-drilling.
- **Design Philosophy**: The app adopts a highly constrained, minimalist zinc/indigo aesthetic. This reduces cognitive overload and makes the application feel like a polished, professional tool rather than a colourful demo.
