# Top Panel Design

## Overview

The fixed top panel provides a professional window management interface with two rows:

- **Row 1** (44px): App branding, window statistics, Home button
- **Row 2** (44px): Horizontal tab switcher for all open windows

Total height: **88px**

## Component Structure

### Location
`src/app/shared/components/window-tabs/window-tabs.component.ts`

### Template Structure

```html
<div class="window-tab-bar">
  <!-- Row 1: App Info & Stats -->
  <div class="top-row">
    <div class="app-info">
      <span class="app-icon">🪟</span>
      <span class="app-title">Window Manager</span>
    </div>
    <div class="window-stats">
      <span class="stat-item">
        <span class="stat-value">{{ windowCount() }}</span>
        <span class="stat-label">Windows</span>
      </span>
      <span class="stat-divider">•</span>
      <span class="stat-item">
        <span class="stat-value minimized-count">{{ minimizedCount() }}</span>
        <span class="stat-label">Minimized</span>
      </span>
    </div>
    <div class="top-actions">
      <button class="icon-btn" (click)="goHome()">🏠</button>
    </div>
  </div>

  <!-- Row 2: Window Tabs -->
  <div class="bottom-row">
    <div class="tabs-scroll-container">
      @for (win of windows(); track win.id) {
        <button class="tab-item" (click)="restoreWindow(win.id)">
          <span class="tab-icon">{{ win.icon }}</span>
          <span class="tab-title">{{ win.title }}</span>
        </button>
      }
    </div>
  </div>
</div>
```

## Styling

### Container Styles

```css
.window-tab-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
}
```

### Row 1 Styles

```css
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Row 2 Styles

```css
.bottom-row {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  gap: 12px;
}
```

### Tab Styles

```css
.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  border-bottom: 3px solid transparent;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.tab-item.active {
  background: rgba(255, 255, 255, 0.12);
  border-bottom-color: #10b981;  /* Green indicator */
}

.tab-item.minimized {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.02);
}
```

## Features

### 1. Window Statistics

Displays real-time window counts:

```typescript
windowCount = () => this.winBoxManager.getWindowCount();
minimizedCount = () => this.winBoxManager.getMinimizedCount();
```

Visual format: `[3] Windows • [1] Minimized`

### 2. Home Button

Clicking the Home button (🏠) hides all windows:

```typescript
goHome(): void {
  this.winBoxManager.hideAll();
}
```

### 3. Tab Switcher

Click any tab to focus that window:

```typescript
restoreWindow(id: string): void {
  this.winBoxManager.restoreWindow(id);
}
```

### 4. Horizontal Scrolling

When there are many windows, the tab container scrolls horizontally:

```css
.tabs-scroll-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: #475569 #0f172a;
}
```

## Responsive Design

### Tablet (≤768px)

```css
@media (max-width: 768px) {
  .top-row {
    height: 40px;
    padding: 0 12px;
  }
  
  .stat-label {
    display: none;  /* Hide labels, show only numbers */
  }
  
  .bottom-row {
    height: 40px;
  }
}
```

### Mobile (≤480px)

```css
@media (max-width: 480px) {
  .app-title {
    display: none;  /* Hide title, show only icon */
  }
  
  .tab-title {
    display: none;  /* Hide tab titles, show only icons */
  }
  
  .window-count {
    display: none;  /* Hide window count badge */
  }
}
```

## Keyboard Shortcuts

```typescript
ngOnInit(): void {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'W') {
      e.preventDefault();
      const firstWindow = this.winBoxManager.windowsList()[0];
      if (firstWindow) {
        this.winBoxManager.restoreWindow(firstWindow.id);
      }
    }
  });
}
```

**Shortcut**: `Ctrl+Shift+W` - Focus first window

## Integration with AppComponent

The panel is included in the root component:

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DemoComponent, WindowTabsComponent],
  template: `
    <app-window-tabs></app-window-tabs>
    <app-demo></app-demo>
  `,
})
export class AppComponent {}
```

## Body Padding

The body has top padding to prevent content from being hidden:

```css
body {
  padding-top: 88px; /* Matches panel height */
}
```

## State Management

The component uses signals for reactive updates:

```typescript
export class WindowTabsComponent implements OnInit {
  private readonly winBoxManager = inject(WinBoxManagerService);
  readonly windows: Signal<WindowInfo[]>;

  constructor() {
    this.windows = this.winBoxManager.windowsList;
  }
}
```

## Visual States

### Empty State (No Windows)

```html
<span class="no-windows">
  No windows open - Click a card below to create one
</span>
```

### Active Tab

- Background: `rgba(255, 255, 255, 0.12)`
- Border: 3px green bottom border
- Text: White

### Minimized Tab

- Opacity: 50%
- Background: `rgba(255, 255, 255, 0.02)`
- Text: Dimmed

### Hover State

- Background: `rgba(255, 255, 255, 0.08)`
- Slight lift effect

## Accessibility

### ARIA Labels

```html
<button 
  class="tab-item"
  (click)="restoreWindow(win.id)"
  title="Click to focus: {{ win.title }}"
>
```

### Keyboard Navigation

Tabs are focusable buttons that respond to:
- Click
- Enter key
- Space key

## Performance Considerations

### Track By Function

Using Angular's `@for` with track by:

```html
@for (win of windows(); track win.id) {
  <button class="tab-item">...</button>
}
```

### Signal-Based Updates

Windows list updates automatically via signals - no manual change detection needed.

## Customization

### Change Colors

```css
.window-tab-bar {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### Change Height

```css
.top-row {
  height: 50px;  /* Custom height */
}

.bottom-row {
  height: 50px;  /* Custom height */
}
```

Update body padding accordingly:

```css
body {
  padding-top: 100px;  /* New total height */
}
```

### Add More Actions

```html
<div class="top-actions">
  <button class="icon-btn" (click)="minimizeAll()">⬇️</button>
  <button class="icon-btn" (click)="closeAll()">🗑️</button>
  <button class="icon-btn" (click)="goHome()">🏠</button>
</div>
```

## Next Steps

1. Read [Content Layout](05-content-layout.md) for article structure
2. Read [Syntax Highlighting](06-syntax-highlighting.md) for Prism.js
3. Read [Improvements](08-improvements.md) for enhancement ideas
