# Troubleshooting Guide

## Common Issues and Solutions

This guide covers common issues you may encounter while developing with this Angular + Rsbuild + WinBox.js starter project.

---

## Build Issues

### Issue: Build Fails with "Module not found"

**Error Message**:
```
Module not found: Can't resolve '../../shared/services/winbox-manager.service'
```

**Cause**: Incorrect import path

**Solution**: Check the import path relative to the file location

```typescript
// ❌ Wrong (too many levels up)
import { WinBoxManagerService } from '../../shared/services/winbox-manager.service';

// ✅ Correct (one level up from demo/)
import { WinBoxManagerService } from '../shared/services/winbox-manager.service';
```

### Issue: Rsbuild Build Succeeds but App Doesn't Load

**Symptoms**: Build completes but browser shows blank page

**Possible Causes**:
1. Angular compiler not imported
2. Zone.js not loaded
3. Bootstrap error

**Solution**: Check `main.ts`:

```typescript
// Required imports
import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';

// Check for bootstrap errors
bootstrapApplication(AppComponent).catch(err => console.error(err));
```

### Issue: Styles Not Applied

**Symptoms**: Page renders but no styles

**Solution**: Ensure styles are imported:

```typescript
// In main.ts
import 'prismjs/themes/prism-tomorrow.css';

// In index.html
<link href="/static/css/index.[hash].css" rel="stylesheet">
```

---

## WinBox.js Issues

### Issue: WinBox Not Defined

**Error Message**:
```
ReferenceError: WinBox is not defined
```

**Cause**: WinBox.js not loaded

**Solution**: Check `index.html`:

```html
<!-- Must be before app scripts -->
<script src="winbox.bundle.min.js"></script>
```

And Rsbuild config:

```typescript
copy: [
  {
    from: './node_modules/winbox/dist/winbox.bundle.min.js',
    to: 'winbox.bundle.min.js',
  },
]
```

### Issue: Window Appears Behind Top Panel

**Symptoms**: Window Y position is 0 instead of 88px

**Solution**: Check `topPanelHeight` in service:

```typescript
readonly topPanelHeight = 88; // Two rows of 44px

createMaximizedWindow(options) {
  const _win = new window.WinBox({
    y: this.topPanelHeight,  // Must be 88
    // ...
  });
}
```

### Issue: Window Not Resizing on Browser Resize

**Symptoms**: Window stays same size when browser is resized

**Solution**: Ensure resize handler is registered:

```typescript
constructor() {
  window.addEventListener('resize', () => this.onWindowResize());
}

private onWindowResize(): void {
  // Resize logic
}
```

### Issue: Window Content Styles Not Applied

**Symptoms**: WinBox content appears unstyled

**Solution**: Use inline styles in HTML content:

```typescript
const htmlContent = `
  <style>
    .wb { display: flex; }
    .wb-header { padding: 32px 40px; }
  </style>
  <div class="wb">...</div>
`;
```

---

## Prism.js Issues

### Issue: Code Not Highlighted

**Symptoms**: Code appears as plain text

**Solution**: 
1. Ensure language class is set
2. Call `Prism.highlightElement`

```html
<code class="language-typescript">...</code>
```

```typescript
setTimeout(() => {
  const codeElement = document.querySelector('code.language-typescript');
  if (codeElement) {
    Prism.highlightElement(codeElement);
  }
}, 200);
```

### Issue: Prism Not Defined

**Error Message**:
```
TypeError: Cannot read properties of undefined (reading 'highlightElement')
```

**Solution**: Ensure Prism is imported and global:

```typescript
// In main.ts
import Prism from 'prismjs';
(window as any).Prism = Prism;
```

### Issue: Language Not Working

**Symptoms**: TypeScript code highlighted as plain text

**Solution**: Import the language component:

```typescript
// In main.ts
import 'prismjs/components/prism-typescript';
```

---

## Development Server Issues

### Issue: Port Already in Use

**Error Message**:
```
Error: listen EADDRINUSE: address already in use :::4200
```

**Solution**: Kill the existing process

```bash
# Find process
lsof -i :4200

# Kill process
kill -9 <PID>

# Or use pkill
pkill -f "rsbuild"
pkill -f "ng serve"
```

### Issue: HMR Not Working

**Symptoms**: Changes don't reflect without manual refresh

**Solution**: Check HMR configuration:

```typescript
// rsbuild.config.ts
dev: {
  hmr: true,
}
```

### Issue: Slow Rebuilds

**Symptoms**: Changes take >5 seconds to reflect

**Solutions**:
1. Enable filesystem caching:
```typescript
tools: {
  rspack: {
    cache: {
      type: 'filesystem',
    },
  },
}
```

2. Exclude node_modules from watching:
```typescript
server: {
  watch: {
    ignored: /node_modules/,
  },
}
```

---

## TypeScript Issues

### Issue: Type Errors in Components

**Error Message**:
```
Property 'windows' does not exist on type 'WindowTabsComponent'
```

**Solution**: Ensure properties are declared:

```typescript
export class WindowTabsComponent {
  readonly windows: Signal<WindowInfo[]>;
  
  constructor() {
    this.windows = this.winBoxManager.windowsList;
  }
}
```

### Issue: Cannot Find Module

**Error Message**:
```
Cannot find module '@angular/core' or its corresponding type declarations
```

**Solution**: Reinstall dependencies:

```bash
rm -rf node_modules bun.lock
bun install
```

---

## CSS Issues

### Issue: Styles Overridden by WinBox

**Symptoms**: Custom styles don't apply

**Solution**: Use `!important` for inline styles:

```css
.wb-header {
  padding: 32px 40px !important;
}
```

### Issue: Scrollbar Not Styled

**Symptoms**: Default browser scrollbar appears

**Solution**: Style WebKit scrollbars:

```css
.wb-content::-webkit-scrollbar {
  width: 12px;
}

.wb-content::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.wb-content::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 6px;
}
```

---

## Performance Issues

### Issue: Slow Initial Load

**Symptoms**: App takes >5 seconds to load

**Solutions**:
1. Enable production mode for testing:
```bash
bun run build:rsbuild
```

2. Analyze bundle:
```bash
bunx webpack-bundle-analyzer dist/stats.json
```

3. Lazy load heavy dependencies:
```typescript
const Prism = await import('prismjs');
```

### Issue: Memory Leak

**Symptoms**: Memory usage increases over time

**Solution**: Clean up event listeners:

```typescript
ngOnDestroy(): void {
  window.removeEventListener('resize', this.resizeHandler);
}
```

---

## Production Build Issues

### Issue: Large Bundle Size

**Symptoms**: Bundle > 3 MB

**Solutions**:
1. Use Angular CLI for production:
```bash
bun run build
```

2. Enable tree shaking:
```typescript
optimization: {
  minimize: true,
}
```

3. Split vendor chunks:
```typescript
performance: {
  chunkSplit: {
    strategy: 'split-by-experience',
  },
}
```

### Issue: Production Build Fails

**Error Message**:
```
Error: ENOENT: no such file or directory
```

**Solution**: Clean and rebuild:

```bash
rm -rf dist
bun run build:rsbuild
```

---

## Browser Compatibility Issues

### Issue: App Doesn't Work in Safari

**Symptoms**: Works in Chrome but not Safari

**Solution**: Check for modern JavaScript features:

```typescript
// ❌ May not work in older Safari
const windows = signal([]);

// ✅ Add polyfills or check browser support
```

Add browserslist configuration:

```
# browserslist
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
```

### Issue: CSS Not Working in Firefox

**Symptoms**: Styles work in Chrome but not Firefox

**Solution**: Add vendor prefixes:

```css
/* Use autoprefixer or add manually */
.wb-content {
  overflow: auto;
  -webkit-overflow-scrolling: touch; /* iOS */
}
```

---

## Getting Help

If you can't find a solution here:

1. **Check Documentation**: Read the [docs](docs/) folder
2. **Search Issues**: Check GitHub issues for similar problems
3. **Create Issue**: Provide error messages and reproduction steps
4. **Check Logs**: Look at browser console and terminal output

### Debug Checklist

- [ ] Check browser console for errors
- [ ] Check terminal for build errors
- [ ] Verify all dependencies installed
- [ ] Clear cache and rebuild
- [ ] Try in incognito/private mode
- [ ] Check network tab for failed requests

---

## Quick Fixes

### Clear All Caches

```bash
rm -rf node_modules dist .angular
bun install
```

### Reset to Known Good State

```bash
git checkout main
git pull
bun install
bun run dev
```

### Verify Installation

```bash
bun --version      # Should be 1.3.9+
node --version     # Should be 18+
bun run dev        # Should start without errors
```
