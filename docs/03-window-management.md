# Window Management with WinBox.js

## Overview

This project uses [WinBox.js](https://nextapps-de.github.io/winbox/) for creating professional, resizable windows within the Angular application. Each window displays technology-specific content with syntax-highlighted code examples.

## WinBox.js Integration

### Installation

WinBox.js is installed via npm:

```json
{
  "dependencies": {
    "winbox": "^0.2.82"
  }
}
```

### Loading WinBox

In `index.html`:

```html
<script src="winbox.bundle.min.js"></script>
```

The script is copied to the dist folder via Rsbuild configuration:

```typescript
// rsbuild.config.ts
copy: [
  {
    from: './node_modules/winbox/dist/winbox.bundle.min.js',
    to: 'winbox.bundle.min.js',
  },
]
```

## WinBoxManagerService

The `WinBoxManagerService` is the central service for managing all WinBox windows.

### Location
`src/app/shared/services/winbox-manager.service.ts`

### Key Features

1. **Window Tracking**
   - Maintains a list of all open windows
   - Tracks window state (minimized, active)
   - Provides window count and statistics

2. **Window Operations**
   - Create maximized windows
   - Focus/restore windows
   - Minimize windows
   - Close windows
   - Hide/show all windows

3. **Automatic Resize**
   - Listens for window resize events
   - Updates all windows to respect top panel

### Service Structure

```typescript
@Injectable({ providedIn: 'root' })
export class WinBoxManagerService {
  // State
  private readonly windows = signal<WindowInfo[]>([]);
  readonly windowsList: Signal<WindowInfo[]>;
  
  // Constants
  readonly topPanelHeight = 88; // Two rows of 44px each
  
  // Methods
  createMaximizedWindow(options): { id, instance }
  restoreWindow(id: string): void
  minimizeWindow(id: string): void
  closeWindow(id: string): void
  hideAll(): void
  showAll(): void
  getWindowCount(): number
  getMinimizedCount(): number
}
```

### WindowInfo Interface

```typescript
interface WindowInfo {
  id: string;           // Unique identifier
  title: string;        // Window title
  color: string;        // Theme color
  icon?: string;        // Icon emoji
  instance: any;        // WinBoxInstance
  minimized: boolean;   // Minimized state
  timestamp: number;    // Creation timestamp
}
```

## Creating Windows

### Basic Usage

```typescript
constructor(private winBoxManager: WinBoxManagerService) {}

openWindow() {
  const htmlContent = `
    <div class="wb">
      <style>/* inline styles */</style>
      <header class="wb-header">...</header>
      <div class="wb-content">...</div>
      <footer class="wb-footer">...</footer>
    </div>
  `;
  
  this.winBoxManager.createMaximizedWindow({
    title: 'My Window',
    color: '#0f3460',
    icon: '🚀',
    html: htmlContent,
    onfocus: function() {
      this.setBackground('#16213e');
    }
  });
}
```

### createMaximizedWindow Options

```typescript
interface CreateWindowOptions {
  title: string;      // Window title (shown in titlebar and tabs)
  color: string;      // Theme color (hex)
  icon?: string;      // Icon for the tab
  html: string;       // HTML content (with inline styles)
  onfocus?: Function; // Callback when window gains focus
}
```

### Window Dimensions

Windows are created with these dimensions:

```typescript
const top = this.topPanelHeight;  // 88px
const width = window.innerWidth;   // Full width
const height = window.innerHeight - top;  // Remaining height

new window.WinBox({
  x: 0,        // Left edge
  y: top,      // Below top panel
  width: width,
  height: height,
});
```

## Window Controls

### Native WinBox Controls

Each window has native controls in its titlebar:

| Button | Icon | Action |
|--------|------|--------|
| Minimize | `[_]` | Hides the window |
| Maximize | `[□]` | Toggles fullscreen |
| Close | `[✕]` | Closes the window |

### Programmatic Control

```typescript
// Focus a window
winBoxManager.restoreWindow(id);

// Minimize a window
winBoxManager.minimizeWindow(id);

// Close a window
winBoxManager.closeWindow(id);

// Hide all windows
winBoxManager.hideAll();

// Show all windows
winBoxManager.showAll();
```

## Event Handlers

### onfocus

Called when window gains focus:

```typescript
onfocus: function(this: any) {
  this.setBackground('#16213e');  // Change header color
}
```

### onminimize

Called when window is minimized:

```typescript
onminimize: () => {
  this.minimizeWindow(id);
}
```

### onclose

Called when window is closed:

```typescript
onclose: () => {
  this.closeWindow(id);
}
```

## Preventing Duplicate Windows

The DemoComponent checks for existing windows:

```typescript
openCard(card: CardItem): void {
  const existingWindows = this.winBoxManager.windowsList();
  const existing = existingWindows.find(w => w.title === card.title);
  
  if (existing) {
    this.winBoxManager.restoreWindow(existing.id);
    return;
  }
  
  // Create new window...
}
```

## Responsive Behavior

### Window Resize Handler

The service automatically handles window resize:

```typescript
constructor() {
  window.addEventListener('resize', () => this.onWindowResize());
}

private onWindowResize(): void {
  const windows = this.windows();
  const top = this.topPanelHeight;
  const width = window.innerWidth;
  const height = window.innerHeight - top;

  windows.forEach(win => {
    if (win.instance && !win.minimized) {
      win.instance.resize(width, height);
      win.instance.move(0, top);
    }
  });
}
```

## Best Practices

### 1. Use Inline Styles

Always include styles inline in the HTML content:

```typescript
const htmlContent = `
  <style>
    .wb { display: flex; height: 100vh; }
    .wb-header { padding: 32px 40px; }
  </style>
  <div class="wb">...</div>
`;
```

### 2. Escape HTML Content

Always escape user content to prevent XSS:

```typescript
private _escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const safeContent = this._escapeHtml(userInput);
```

### 3. Clean Up on Close

Remove windows from tracking when closed:

```typescript
onclose: () => {
  this.windows.update(windows => 
    windows.filter(w => w.id !== id)
  );
}
```

### 4. Use Unique IDs

Generate unique IDs for each window:

```typescript
private generateId(): string {
  return `winbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

## Common Issues

### Window Appears Behind Top Panel

**Solution**: Ensure `y` position is set to `topPanelHeight`:

```typescript
y: this.topPanelHeight  // 88px
```

### Window Not Resizing

**Solution**: Check resize handler is registered:

```typescript
window.addEventListener('resize', () => this.onWindowResize());
```

### Styles Not Applying

**Solution**: Use inline `<style>` tags with `!important`:

```html
<style>
  .wb-header { padding: 32px 40px !important; }
</style>
```

## Next Steps

1. Read [Top Panel Design](04-top-panel.md) for the window switcher
2. Read [Content Layout](05-content-layout.md) for article structure
3. Read [Improvements](08-improvements.md) for enhancement ideas
