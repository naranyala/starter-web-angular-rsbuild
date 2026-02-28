# Content Layout (Article Structure)

## Overview

Each WinBox window displays content using a professional article layout with:

1. **Header** - Icon, title, subtitle, copy button
2. **Overview Section** - Description and documentation link
3. **Code Section** - Syntax-highlighted code example
4. **Tips Section** - Feature cards in a grid
5. **Footer** - External links and metadata

## HTML Structure

```html
<div class="wb">
  <style>/* Inline styles */</style>
  
  <!-- Header -->
  <header class="wb-header">
    <div class="wb-title-section">
      <span class="wb-icon">🅰️</span>
      <div class="wb-title-group">
        <h1 class="wb-title">Angular</h1>
        <p class="wb-subtitle">Platform for building web apps</p>
      </div>
    </div>
    <div class="wb-actions">
      <button class="wb-copy-btn">📋 Copy Code</button>
    </div>
  </header>

  <!-- Content -->
  <div class="wb-content">
    <!-- Overview -->
    <section class="wb-section wb-intro">
      <div class="wb-section-header">
        <span class="wb-section-icon">📖</span>
        <h2 class="wb-section-title">Overview</h2>
      </div>
      <div class="wb-section-content">
        <p class="wb-intro-text">Description...</p>
        <div class="wb-info-box">
          <span class="wb-info-icon">🔗</span>
          <div class="wb-info-content">
            <span class="wb-info-label">Documentation</span>
            <a href="..." class="wb-info-link">https://...</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Code -->
    <section class="wb-section wb-code-section">
      <div class="wb-section-header">
        <span class="wb-section-icon">💻</span>
        <h2 class="wb-section-title">Example Usage</h2>
        <span class="wb-code-lang">TypeScript</span>
      </div>
      <div class="wb-code-container">
        <div class="wb-code-toolbar">
          <span class="wb-code-filename">angular.ts</span>
          <button class="wb-code-copy">📋</button>
        </div>
        <div class="wb-code-content">
          <pre><code class="language-typescript">...</code></pre>
        </div>
      </div>
    </section>

    <!-- Tips -->
    <section class="wb-section wb-tips">
      <div class="wb-section-header">
        <span class="wb-section-icon">💡</span>
        <h2 class="wb-section-title">Key Points</h2>
      </div>
      <div class="wb-tips-grid">
        <div class="wb-tip-card">
          <span class="wb-tip-icon">⚡</span>
          <div class="wb-tip-content">
            <h3 class="wb-tip-title">Performance</h3>
            <p class="wb-tip-text">Description...</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Footer -->
  <footer class="wb-footer">
    <div class="wb-footer-content">
      <a href="..." class="wb-footer-link">
        <span class="link-icon">🌐</span>
        <span class="link-text">Visit Website</span>
        <span class="arrow">↗</span>
      </a>
      <span class="wb-footer-meta">Generated with Angular Rsbuild Demo</span>
    </div>
  </footer>
</div>
```

## Styling Approach

### Inline Styles

All styles are embedded directly in the HTML:

```typescript
const inlineStyles = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    .wb {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: linear-gradient(180deg, #1e1e1e 0%, #1a1a1e 100%);
      color: #d4d4d4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
    }
    
    /* ... more styles ... */
  </style>
`;

const htmlContent = `${inlineStyles}<div class="wb">...</div>`;
```

### Why Inline Styles?

1. **No Loading Delay** - Styles are immediately available
2. **No Specificity Conflicts** - No `!important` needed
3. **Self-Contained** - Each window is independent
4. **Reliable** - Works regardless of external CSS state

## Section Details

### Header

**Purpose**: Display window title and provide copy action

**Key Styles**:
```css
.wb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 40px;
  background: linear-gradient(135deg, #2d2d30 0%, #252526 100%);
  border-bottom: 1px solid #3c3c3c;
}

.wb-icon {
  font-size: 3rem;
}

.wb-title {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
}

.wb-subtitle {
  color: #9cdcfe;
  font-size: 1.1rem;
}
```

### Overview Section

**Purpose**: Introduce the technology with description and documentation link

**Key Styles**:
```css
.wb-intro {
  background: linear-gradient(135deg, rgba(86, 156, 214, 0.08) 0%, rgba(86, 156, 214, 0.03) 100%);
}

.wb-info-box {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(86, 156, 214, 0.12);
  border: 1px solid rgba(86, 156, 214, 0.25);
  border-radius: 10px;
}
```

### Code Section

**Purpose**: Display syntax-highlighted code example

**Key Styles**:
```css
.wb-code-section {
  padding: 0;
  background: #1a1a1e;
}

.wb-code-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 16px 28px;
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
}

.wb-code-content {
  padding: 32px 40px;
  background: #1e1e1e;
  overflow: auto;
}

.wb-code-content code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.8;
}
```

### Tips Section

**Purpose**: Highlight key features in a card grid

**Key Styles**:
```css
.wb-tips {
  background: linear-gradient(135deg, rgba(78, 201, 176, 0.08) 0%, rgba(78, 201, 176, 0.03) 100%);
}

.wb-tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.wb-tip-card {
  display: flex;
  gap: 20px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.wb-tip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
```

### Footer

**Purpose**: Provide external links and attribution

**Key Styles**:
```css
.wb-footer {
  padding: 20px 40px;
  background: #252526;
  border-top: 1px solid #3c3c3c;
}

.wb-footer-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(79, 195, 247, 0.12);
  border: 1px solid rgba(79, 195, 247, 0.25);
  border-radius: 8px;
  color: #4fc3f7;
}

.wb-footer-link:hover .arrow {
  transform: translateX(4px);
}
```

## Responsive Design

### Mobile Breakpoint

```css
@media (max-width: 768px) {
  .wb-header {
    padding: 24px;
    flex-direction: column;
    gap: 20px;
  }
  
  .wb-section {
    padding: 28px 24px;
  }
  
  .wb-code-content {
    padding: 24px 28px;
  }
  
  .wb-tips-grid {
    grid-template-columns: 1fr;
  }
  
  .wb-footer-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

## Copy to Clipboard

### Implementation

```typescript
(window as any).copyCodeToClipboard = function(btn: HTMLElement) {
  const codeContainer = btn.closest('.wb');
  const codeElement = codeContainer?.querySelector('code');
  
  if (codeElement) {
    const codeText = codeElement.textContent || '';
    
    navigator.clipboard.writeText(codeText).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '✅ Copied!';
      btn.classList.add('copied');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('copied');
      }, 2000);
    });
  }
};
```

### Usage in HTML

```html
<button class="wb-copy-btn" onclick="copyCodeToClipboard(this)">
  📋 Copy Code
</button>
```

## Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Background | `#1e1e1e` | Main content |
| Header | `#2d2d30` | Section headers |
| Title | `#ffffff` | Primary text |
| Subtitle | `#9cdcfe` | VS Code blue |
| Accent | `#4ec9b0` | Teal for tips |
| Links | `#4fc3f7` | Light blue |
| Success | `#10b981` | Green for copied |

## Typography

| Element | Font Size | Weight | Line Height |
|---------|-----------|--------|-------------|
| Title (H1) | 2rem | 700 | 1.2 |
| Section Title (H2) | 1.4rem | 600 | 1.2 |
| Tip Title (H3) | 1.1rem | 600 | 1.2 |
| Subtitle | 1.1rem | 400 | 1.5 |
| Body Text | 1.15rem | 400 | 1.9 |
| Code | 14px | 400 | 1.8 |

## Spacing

| Element | Padding |
|---------|---------|
| Header | 32px 40px |
| Sections | 40px |
| Code Content | 32px 40px |
| Tip Cards | 28px |
| Footer | 20px 40px |

## Customization

### Change Section Background

```css
.wb-intro {
  background: linear-gradient(135deg, rgba(your-color, 0.08), rgba(your-color, 0.03));
}
```

### Add New Section Type

```html
<section class="wb-section wb-custom">
  <div class="wb-section-header">
    <span class="wb-section-icon">🎯</span>
    <h2 class="wb-section-title">Custom Section</h2>
  </div>
  <div class="wb-section-content">
    <!-- Your content -->
  </div>
</section>
```

### Modify Grid Layout

```css
.wb-tips-grid {
  grid-template-columns: repeat(2, 1fr);  /* Always 2 columns */
  /* or */
  grid-template-columns: 1fr;  /* Always 1 column */
}
```

## Best Practices

1. **Use Semantic HTML** - `<header>`, `<section>`, `<footer>`
2. **Include Inline Styles** - Always embed styles in the HTML
3. **Escape Content** - Use `_escapeHtml()` for user content
4. **Provide Feedback** - Show "Copied!" state for copy buttons
5. **Responsive Design** - Test on mobile and desktop
6. **Accessible Colors** - Ensure sufficient contrast

## Next Steps

1. Read [Syntax Highlighting](06-syntax-highlighting.md) for Prism.js
2. Read [Build System](07-build-system.md) for Rsbuild config
3. Read [Improvements](08-improvements.md) for enhancement ideas
