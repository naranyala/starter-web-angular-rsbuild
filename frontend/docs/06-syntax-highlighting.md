# Syntax Highlighting with Prism.js

## Overview

This project uses [Prism.js](https://prismjs.com/) for syntax highlighting of code examples within WinBox windows. Prism.js is a lightweight, extensible syntax highlighter with support for 50+ languages.

## Installation

### From npm

```bash
bun add prismjs
bun add -D @types/prismjs
```

### Package.json

```json
{
  "dependencies": {
    "prismjs": "^1.30.0"
  },
  "devDependencies": {
    "@types/prismjs": "^1.26.6"
  }
}
```

## Configuration

### Import in main.ts

```typescript
// Import Prism.js core
import Prism from 'prismjs';

// Import language components
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';

// Import theme
import 'prismjs/themes/prism-tomorrow.css';

// Make Prism available globally for inline handlers
(window as any).Prism = Prism;
```

### Why Global Assignment?

The inline `onclick` handlers in WinBox content need global access:

```html
<button onclick="copyCodeToClipboard(this)">📋</button>
```

## Usage in WinBox Content

### HTML Structure

```html
<div class="wb-code-content">
  <pre><code class="language-typescript">${escapedCode}</code></pre>
</div>
```

### Highlighting Code

```typescript
// After window is created
setTimeout(() => {
  if (typeof Prism !== 'undefined') {
    const codeElement = document.querySelector('code.language-typescript:last-of-type');
    if (codeElement) {
      Prism.highlightElement(codeElement);
    }
  }
}, 200);
```

### On Window Focus

```typescript
onfocus: function(this: any) {
  this.setBackground(card.color);
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
}
```

## Supported Languages

### Core Languages

| Language | Import | Class Name |
|----------|--------|------------|
| TypeScript | `prism-typescript` | `language-typescript` |
| JavaScript | `prism-javascript` | `language-javascript` |
| CSS | `prism-css` | `language-css` |
| HTML | `prism-markup` | `language-html` |
| JSON | `prism-json` | `language-json` |

### Adding More Languages

```typescript
// In main.ts
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
```

## Theme Customization

### Using Prism Tomorrow Theme

```typescript
import 'prismjs/themes/prism-tomorrow.css';
```

### Override Colors

```css
/* In global styles.css */
.winbox-content-body .token.comment {
  color: #6a9955 !important;  /* VS Code green */
  font-style: italic !important;
}

.winbox-content-body .token.keyword {
  color: #569cd6 !important;  /* VS Code blue */
  font-weight: 600 !important;
}

.winbox-content-body .token.string {
  color: #ce9178 !important;  /* VS Code orange */
}
```

### Token Colors Reference

| Token | Default Color | VS Code Color |
|-------|---------------|---------------|
| Comment | `#999` | `#6a9955` |
| Keyword | `#e2777a` | `#569cd6` |
| String | `#f08d49` | `#ce9178` |
| Function | `#6196cc` | `#dcdcaa` |
| Number | `#f08d49` | `#b5cea8` |
| Class | `#e2777a` | `#4ec9b0` |
| Operator | `#fff` | `#d4d4d4` |

## Code Examples

### TypeScript Example

```typescript
const code = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello!</h1>',
})
export class AppComponent {
  title = 'My App';
}`;

const escapedCode = this._escapeHtml(code);
```

### Escaping HTML

```typescript
private _escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

This prevents XSS attacks and ensures special characters are displayed correctly.

## Copy to Clipboard

### Implementation

```typescript
(window as any).copyCodeToClipboard = function(btn: HTMLElement) {
  const codeContainer = btn.closest('.wb');
  const codeElement = codeContainer?.querySelector('code');
  
  if (codeElement) {
    const codeText = codeElement.textContent || '';
    
    navigator.clipboard.writeText(codeText).then(() => {
      // Show success feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = '✅ Copied!';
      btn.classList.add('copied');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
};
```

### Button HTML

```html
<button class="wb-code-copy" onclick="copyCodeToClipboard(this)" title="Copy">
  📋
</button>
```

## Performance Considerations

### Lazy Loading Languages

Only load languages you need:

```typescript
// Only load TypeScript and JavaScript
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
```

### Highlight Only When Needed

```typescript
// Only highlight when window is created
setTimeout(() => {
  if (typeof Prism !== 'undefined') {
    const codeElement = document.querySelector('code.language-typescript');
    if (codeElement) {
      Prism.highlightElement(codeElement);
    }
  }
}, 200);
```

### Avoid Re-highlighting

```typescript
// Check if already highlighted
if (!codeElement.hasAttribute('data-highlighted')) {
  Prism.highlightElement(codeElement);
}
```

## Custom Grammar

### Add Custom Language

```typescript
Prism.languages.mylang = {
  'keyword': /\b(if|else|while|for)\b/,
  'string': /(["'])(?:(?!\1)[^\\]|\\.)*?\1/,
  'comment': /\/\/.*|\/\*[\s\S]*?\*\//,
};
```

### Extend Existing Language

```typescript
Prism.languages.typescript = Prism.languages.extend('typescript', {
  'decorator': {
    pattern: /@\w+/,
    alias: 'function',
  },
});
```

## Plugins

### Available Plugins

| Plugin | Purpose |
|--------|---------|
| `line-numbers` | Show line numbers |
| `toolbar` | Add toolbar buttons |
| `copy-to-clipboard` | Built-in copy button |
| `highlight-keywords` | Highlight keywords inside strings |

### Using Line Numbers

```typescript
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
```

```html
<pre class="line-numbers">
  <code class="language-typescript">...</code>
</pre>
```

### Using Toolbar

```typescript
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
```

## Troubleshooting

### Code Not Highlighted

**Problem**: Code appears as plain text

**Solution**: Ensure language class is set and Prism.highlightElement is called:

```html
<code class="language-typescript">...</code>
```

```typescript
Prism.highlightElement(codeElement);
```

### Wrong Colors

**Problem**: Colors don't match VS Code

**Solution**: Override token colors in CSS:

```css
.winbox-content-body .token.keyword {
  color: #569cd6 !important;
}
```

### Prism Not Defined

**Problem**: `typeof Prism === 'undefined'`

**Solution**: Ensure Prism is imported and assigned globally:

```typescript
import Prism from 'prismjs';
(window as any).Prism = Prism;
```

### Language Not Working

**Problem**: Language not highlighted correctly

**Solution**: Import the language component:

```typescript
import 'prismjs/components/prism-typescript';
```

## Best Practices

1. **Escape HTML** - Always escape code before displaying
2. **Load Only Needed Languages** - Reduce bundle size
3. **Use Semantic Classes** - `language-typescript`, not just `typescript`
4. **Provide Copy Button** - Users want to copy code
5. **Show Feedback** - Indicate when code is copied
6. **Test on Mobile** - Ensure code is scrollable

## Alternatives

| Library | Size | Languages | Pros | Cons |
|---------|------|-----------|------|------|
| **Prism.js** | 10KB | 50+ | Lightweight, extensible | Manual highlighting |
| **Highlight.js** | 30KB | 180+ | Auto-detect | Larger bundle |
| **Shiki** | 100KB+ | 50+ | VS Code accurate | Large bundle |

## Next Steps

1. Read [Build System](07-build-system.md) for Rsbuild config
2. Read [Improvements](08-improvements.md) for enhancement ideas
3. Check [Prism.js Documentation](https://prismjs.com/) for advanced features
