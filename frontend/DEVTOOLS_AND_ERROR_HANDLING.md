# DevTools Panel & Error Handling

## Overview

This project now includes a comprehensive **bottom panel DevTools** and **root-level error handling** with modal popup for debugging and monitoring your Angular application.

## Features

### 1. 🛠️ DevTools Panel

A collapsible bottom panel that exposes comprehensive frontend debugging information.

#### Toggle the Panel
- Click the **DevTools** button at the bottom center of the screen
- Keyboard shortcut: `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)

#### Tabs

##### 📊 Overview
- Angular version
- Production/Development mode
- Component count
- Routes visited
- Error count
- Current route
- Application info (Base URL, User Agent, Viewport, Device Pixel Ratio, Online status)

##### 📍 Routes
- Route history with timestamps
- Navigate to previous routes
- Clear route history

##### ⚡ Performance
- DOM Content Loaded time
- Load Complete time
- First Paint (FP)
- First Contentful Paint (FCP)
- Resources loaded count
- Total transfer size
- Visual performance timeline

##### 💾 Memory
- Used JS Heap Size
- Total JS Heap Size
- Heap Limit
- Memory usage visualization
- Memory optimization tips

##### ⚠️ Errors
- Error log with timestamps
- Error type badges (error, warning, info)
- Clear all errors

#### Features
- **Resizable**: Drag the resize handle at the top of the panel
- **Persistent**: Panel state is maintained during navigation
- **Responsive**: Adapts to different screen sizes

### 2. ⚠️ Error Modal Popup

Automatic modal popup when unhandled errors occur in the application.

#### Features
- **Automatic Detection**: Catches all unhandled Angular errors
- **Detailed Information**:
  - Error message
  - Timestamp
  - Error type
  - Current URL
  - Full stack trace
- **Actions**:
  - Copy stack trace to clipboard
  - Report error via email
  - Dismiss modal

#### Error Types
- **Error**: Critical errors that break functionality (shows modal)
- **Warning**: Non-critical issues (logged only)
- **Info**: Informational messages (logged only)

## Usage

### Global Error Handling

The error handler is automatically registered in `main.ts`. All unhandled errors will:
1. Be logged to the console
2. Be stored in the error log
3. Trigger the error modal (for errors only)

```typescript
// Errors are automatically caught
throw new Error('This will trigger the error modal');
```

### Manual Error Logging

You can manually log errors, warnings, and info messages using the `ErrorHandlerService`:

```typescript
import { ErrorHandlerService } from './shared/services/error-handler.service';

// In your component/service
constructor(private errorHandler: ErrorHandlerService) {}

// Log an error (triggers modal)
this.errorHandler.handleError(new Error('Something went wrong'));

// Log a warning (no modal)
this.errorHandler.warn('This is a warning', { component: 'MyComponent' });

// Log info (no modal)
this.errorHandler.info('Feature initialized', { feature: 'checkout' });
```

### Accessing DevTools Programmatically

```typescript
import { DevToolsService } from './shared/services/devtools.service';

constructor(private devTools: DevToolsService) {}

// Open/close panel
this.devTools.openPanel();
this.devTools.closePanel();
this.devTools.togglePanel();

// Switch tabs
this.devTools.setActiveTab('performance');

// Get application state
const state = this.devTools.getAppState();

// Get performance metrics
const metrics = this.devTools.getPerformanceMetrics();

// Get memory info
const memory = this.devTools.getMemoryInfo();

// Get route history
const routes = this.devTools.getRouteHistory();
```

## Architecture

### Files Created

```
src/app/shared/
├── services/
│   ├── error-handler.service.ts      # Global error handling service
│   ├── error-modal.service.ts        # Error modal state management
│   └── devtools.service.ts           # DevTools information service
└── components/
    ├── error-modal/
    │   └── error-modal.component.ts  # Error modal UI
    └── devtools-panel/
        └── devtools-panel.component.ts  # DevTools panel UI
```

### Service Hierarchy

```
ErrorHandlerService (implements Angular ErrorHandler)
├── Captures all unhandled errors
├── Stores errors in memory
└── Emits errors via RxJS Subject

ErrorModalService
├── Controls modal open/close state
└── Emits modal state via RxJS Subject

DevToolsService
├── Tracks route history
├── Collects performance metrics
├── Monitors memory usage
└── Provides application state
```

## Configuration

### Error Modal

The error modal shows automatically for errors. To customize:

```typescript
// In error-handler.service.ts
private readonly maxErrors = 50; // Maximum errors to store
```

### DevTools Panel

```typescript
// In devtools-panel.component.ts
panelHeight = signal(400); // Default height in pixels
private readonly maxRouteHistory = 20; // Maximum routes to track
```

## Browser Support

### DevTools Panel
- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ⚠️ Memory metrics only available in Chrome/Edge

### Error Modal
- ✅ All modern browsers

## Testing

### Unit Tests

The services and components are designed to be testable:

```typescript
import { ErrorHandlerService } from './shared/services/error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    service = new ErrorHandlerService();
  });

  it('should capture errors', () => {
    service.handleError(new Error('test'));
    expect(service.getErrorCount()).toBe(1);
  });

  it('should emit errors', (done) => {
    service.errors$.subscribe(error => {
      expect(error.message).toBe('test');
      done();
    });
    service.handleError(new Error('test'));
  });
});
```

### E2E Tests

```typescript
// Test DevTools panel
it('should open DevTools panel', () => {
  cy.get('.devtools-toggle').click();
  cy.get('.devtools-panel').should('be.visible');
});

// Test error modal
it('should show error modal on error', () => {
  cy.window().then(win => {
    win.dispatchEvent(new ErrorEvent('error', { error: new Error('test') }));
  });
  cy.get('.error-modal').should('be.visible');
});
```

## Performance Impact

- **Bundle Size**: ~55KB (uncompressed) added to main bundle
- **Runtime**: Minimal impact - uses RxJS observables and signals
- **Memory**: Stores up to 50 errors in memory (~10KB max)

## Security Considerations

- Error modal shows stack traces - be careful in production
- Consider disabling error modal in production:
  ```typescript
  // In main.ts
  if (environment.production) {
    // Disable modal but keep logging
    // Custom implementation needed
  }
  ```
- Don't expose sensitive information in error context

## Troubleshooting

### Panel not showing
- Check if component is imported in `AppComponent`
- Verify `DevToolsService` is provided
- Check browser console for errors

### Error modal not appearing
- Verify `ErrorHandlerService` is registered in `main.ts`
- Check if error type is 'error' (warnings/info don't show modal)
- Ensure `ErrorModalComponent` is imported

### Memory metrics not showing
- Memory API is only available in Chrome/Edge desktop
- Check browser compatibility

## Future Enhancements

Potential improvements:
- [ ] Persist panel state to localStorage
- [ ] Add component tree inspector
- [ ] Add network request monitoring
- [ ] Add custom event tracking
- [ ] Export devtools data as JSON
- [ ] Add search/filter for errors
- [ ] Add error grouping by type/message

## License

Apache 2.0
