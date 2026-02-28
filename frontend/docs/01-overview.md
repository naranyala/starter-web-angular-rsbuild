# Project Overview

## Introduction

This is a modern Angular 21 application featuring a professional window management system built with WinBox.js. The project demonstrates best practices for:

- **Component-based architecture** with standalone components
- **Reactive state management** using Angular signals
- **Professional UI/UX** with a custom window management system
- **Syntax highlighting** using Prism.js
- **Fast development** with Rsbuild build tool

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.2.0 | Application framework |
| TypeScript | 5.9.2 | Type-safe JavaScript |
| RxJS | 7.8.2 | Reactive programming |
| Zone.js | 0.15.1 | Change detection |

### Build & Runtime
| Technology | Version | Purpose |
|------------|---------|---------|
| Rsbuild | 1.7.3 | Fast build tool (Rspack-based) |
| Bun | 1.3.9 | JavaScript runtime & package manager |
| Biome | 2.4.4 | Linter and formatter |

### UI Libraries
| Technology | Version | Purpose |
|------------|---------|---------|
| WinBox.js | 0.2.82 | Window management |
| Prism.js | 1.30.0 | Syntax highlighting |

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Angular Application                        │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │              AppComponent                        │  │ │
│  │  │  ┌────────────┐  ┌────────────────────────────┐  │  │ │
│  │  │  │WindowTabs  │  │    DemoComponent           │  │  │ │
│  │  │  │Component   │  │  ┌──────────────────────┐  │  │  │ │
│  │  │  │            │  │  │  Technology Cards    │  │  │  │ │
│  │  │  └────────────┘  │  │  (Angular, Rsbuild,  │  │  │  │ │
│  │  │                  │  │   Bun, TypeScript)   │  │  │  │ │
│  │  │  ┌────────────┐  │  └──────────┬───────────┘  │  │  │ │
│  │  │  │WinBoxManager│ │             │              │  │  │ │
│  │  │  │Service     │◄┼─────────────┘              │  │  │ │
│  │  │  └────────────┘  │                            │  │  │ │
│  │  └──────────────────┼────────────────────────────┘  │  │ │
│  └─────────────────────┼────────────────────────────────┘  │
│                        │                                     │
│  ┌─────────────────────┼────────────────────────────────┐   │
│  │         WinBox Windows (Dynamic)                     │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │   │
│  │  │   Angular    │ │   Rsbuild    │ │  TypeScript  │ │   │
│  │  │   Window     │ │   Window     │ │   Window     │ │   │
│  │  │              │ │              │ │              │ │   │
│  │  │  [Code]      │ │  [Code]      │ │  [Code]      │ │   │
│  │  │  [Tips]      │ │  [Tips]      │ │  [Tips]      │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
AppComponent (root)
├── WindowTabsComponent (fixed top panel)
│   ├── Row 1: App info, window count, Home button
│   └── Row 2: Window tab switcher
└── DemoComponent (main content)
    └── Technology Cards Grid
        └── (on click) → WinBoxManagerService
            └── Creates WinBox windows with:
                ├── Header (icon, title, copy button)
                ├── Overview section
                ├── Code example (Prism.js highlighted)
                ├── Tips section
                └── Footer (external links)
```

## Key Features

### 1. Window Management System

The `WinBoxManagerService` provides:
- Window creation with maximized layout
- Window tracking (list, count, minimized state)
- Window operations (focus, minimize, restore, close)
- Automatic resize handling

### 2. Fixed Top Panel

The `WindowTabsComponent` provides:
- Two-row layout (44px + 44px = 88px total)
- Row 1: App branding and global actions
- Row 2: Horizontal tab switcher
- Responsive design for mobile

### 3. Article Layout

Each WinBox window contains:
- **Header**: Icon, title, subtitle, copy button
- **Overview**: Description and documentation link
- **Code Example**: Syntax-highlighted code block
- **Tips**: Grid of feature cards
- **Footer**: External links and metadata

### 4. Syntax Highlighting

Prism.js integration:
- Bundled from node_modules
- TypeScript and JavaScript support
- VS Code Dark+ theme colors
- Copy-to-clipboard functionality

## File Structure

```
src/
├── app/
│   ├── demo/
│   │   └── demo.component.ts      # Main demo with cards
│   ├── home/
│   │   └── home.component.ts      # Welcome page
│   └── shared/
│       ├── components/
│       │   └── window-tabs/
│       │       └── window-tabs.component.ts  # Top panel
│       └── services/
│           └── winbox-manager.service.ts     # Window management
├── main.ts                        # Bootstrap with Prism.js imports
├── index.html                     # HTML entry point
└── styles.css                     # Global styles
```

## State Management

### Signals

The application uses Angular signals for reactive state:

```typescript
// WinBoxManagerService
private readonly windows = signal<WindowInfo[]>([]);
readonly windowsList: Signal<WindowInfo[]> = this.windows.asReadonly();

private readonly panelOpen = signal(false);
readonly panelOpenState: Signal<boolean> = this.panelOpen.asReadonly();
```

### Window Info Interface

```typescript
interface WindowInfo {
  id: string;
  title: string;
  color: string;
  icon?: string;
  instance: any;        // WinBoxInstance
  minimized: boolean;
  timestamp: number;
}
```

## Styling Approach

### Global Styles (styles.css)
- Body padding for top panel offset
- WinBox utility classes
- Scrollbar styling

### Inline Styles (WinBox content)
Each WinBox window includes inline `<style>` tags for:
- Layout (flexbox)
- Typography
- Colors and backgrounds
- Responsive breakpoints

This approach ensures:
- No CSS loading delays
- No specificity conflicts
- Self-contained window content

## Build System

### Development (Rsbuild)
```bash
bun run dev
```
- Fast builds (~1-2s)
- Hot Module Replacement
- Source maps
- Larger bundle size

### Production (Rsbuild)
```bash
bun run build:rsbuild
```
- Optimized bundles
- Minification
- Tree shaking
- Ready for deployment

## Next Steps

Continue reading the documentation:

1. [Quick Start Guide](02-quickstart.md) - Installation and setup
2. [Window Management](03-window-management.md) - WinBox.js integration
3. [Top Panel Design](04-top-panel.md) - Fixed panel implementation
4. [Content Layout](05-content-layout.md) - Article structure
5. [Syntax Highlighting](06-syntax-highlighting.md) - Prism.js setup
6. [Build System](07-build-system.md) - Rsbuild configuration
7. [Improvements](08-improvements.md) - Future enhancements
