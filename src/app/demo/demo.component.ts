import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WinBoxManagerService } from '../shared/services/winbox-manager.service';

interface CardItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  codeMockup: string;
  link?: string;
}

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <h1>Technology Cards</h1>
      <p class="subtitle">Explore the technologies powering this demo</p>

      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search technologies..."
          [(ngModel)]="searchQuery"
        />
        <span class="search-icon">🔍</span>
        @if (searchQuery) {
          <button type="button" class="clear-btn" (click)="searchQuery = ''">×</button>
        }
      </div>

      <div class="cards-grid">
        @for (card of filteredCards; track card.title) {
          <div class="card" (click)="openCard(card)">
            <div class="card-icon" [style.background]="card.color">
              {{ card.icon }}
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-description">{{ card.description }}</p>
          </div>
        } @empty {
          <div class="no-results">
            <p>No results found for "{{ searchQuery }}"</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .demo-container h1 {
      font-size: 1.5rem;
      color: #1a1a2e;
      margin-bottom: 4px;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 24px;
      font-size: 0.9rem;
    }

    .search-container {
      position: relative;
      max-width: 400px;
      margin: 0 auto 24px;
    }

    .search-input {
      width: 100%;
      padding: 10px 36px 10px 14px;
      font-size: 0.9rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: #0f3460;
      box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      opacity: 0.5;
    }

    .clear-btn {
      position: absolute;
      right: 36px;
      top: 50%;
      transform: translateY(-50%);
      background: #e0e0e0;
      border: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.85rem;
      line-height: 1;
      color: #666;
      transition: background 0.2s;
    }

    .clear-btn:hover {
      background: #ccc;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s, box-shadow 0.2s, cursor 0.2s;
      animation: fadeIn 0.3s ease-out;
      cursor: pointer;
      border: 1px solid #f0f0f0;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      border-color: #0f3460;
    }

    .card:active {
      transform: translateY(-1px);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      margin-bottom: 10px;
    }

    .card-title {
      font-size: 1rem;
      color: #1a1a2e;
      margin: 0 0 6px;
      font-weight: 600;
    }

    .card-description {
      color: #666;
      line-height: 1.4;
      margin: 0;
      font-size: 0.8rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      .cards-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      }

      .demo-container h1 {
        font-size: 1.25rem;
      }
    }
  `],
})
export class DemoComponent {
  searchQuery = '';
  private readonly winBoxManager = inject(WinBoxManagerService);

  cards: CardItem[] = [
    {
      title: 'Angular',
      description: 'Platform for building web apps with TypeScript',
      icon: '🅰️',
      color: '#e535ab',
      codeMockup: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<h1>Hello Angular!</h1>',
})
export class AppComponent {
  title = 'My App';
}`,
      link: 'https://angular.dev',
    },
    {
      title: 'Rsbuild',
      description: 'High-performance build tool based on Rspack',
      icon: '⚡',
      color: '#f5a623',
      codeMockup: `// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: { index: './src/main.ts' },
  },
  output: {
    distPath: { root: './dist' },
  },
});`,
      link: 'https://rsbuild.dev',
    },
    {
      title: 'Bun',
      description: 'Fast all-in-one JavaScript runtime',
      icon: '🥟',
      color: '#fbf0df',
      codeMockup: `// package.json scripts
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "test": "bun test",
    "build": "bun run build.ts"
  }
}

// Run with: bun run dev`,
      link: 'https://bun.sh',
    },
    {
      title: 'TypeScript',
      description: 'Typed superset of JavaScript',
      icon: '📘',
      color: '#3178c6',
      codeMockup: `interface User {
  id: number;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
};`,
      link: 'https://typescriptlang.org',
    },
    {
      title: 'esbuild',
      description: 'Extremely fast JS bundler',
      icon: '🚀',
      color: '#ffcf00',
      codeMockup: `// build.js
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
});`,
      link: 'https://esbuild.github.io',
    },
    {
      title: 'HMR',
      description: 'Hot Module Replacement for instant updates',
      icon: '🔥',
      color: '#ff6b6b',
      codeMockup: `// Development server with HMR
{
  "dev": "rsbuild dev",
  "devServer": {
    "hot": true,
    "liveReload": true,
    "port": 4200
  }
}

// Changes reflect instantly!`,
    },
  ];

  get filteredCards(): CardItem[] {
    if (!this.searchQuery.trim()) {
      return this.cards;
    }

    const query = this.searchQuery.toLowerCase().trim();
    return this.cards.filter(
      card =>
        card.title.toLowerCase().includes(query) || card.description.toLowerCase().includes(query)
    );
  }

  openCard(card: CardItem): void {
    if (!window.WinBox) {
      console.error('WinBox is not available');
      return;
    }

    // Close any existing window with the same title
    const existingWindows = this.winBoxManager.windowsList();
    const existing = existingWindows.find(w => w.title === card.title);
    if (existing) {
      this.winBoxManager.restoreWindow(existing.id);
      return;
    }

    // Escape the code for HTML
    const escapedCode = this._escapeHtml(card.codeMockup);
    
    // Inline styles for the article layout
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
        
        .wb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 40px;
          background: linear-gradient(135deg, #2d2d30 0%, #252526 100%);
          border-bottom: 1px solid #3c3c3c;
          flex-shrink: 0;
        }
        
        .wb-title-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .wb-icon {
          font-size: 3rem;
          line-height: 1;
        }
        
        .wb-title-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .wb-title {
          color: #ffffff;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .wb-subtitle {
          color: #9cdcfe;
          font-size: 1.1rem;
          line-height: 1.5;
          max-width: 600px;
        }
        
        .wb-copy-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #0e639c 0%, #1177bb 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(14, 99, 156, 0.3);
        }
        
        .wb-copy-btn:hover {
          background: linear-gradient(135deg, #1177bb 0%, #1488d6 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(14, 99, 156, 0.4);
        }
        
        .wb-copy-btn.copied {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .wb-content {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }
        
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
        
        .wb-section {
          padding: 40px;
          border-bottom: 1px solid #2d2d30;
        }
        
        .wb-section:last-child {
          border-bottom: none;
        }
        
        .wb-section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }
        
        .wb-section-icon {
          font-size: 1.75rem;
        }
        
        .wb-section-title {
          color: #ffffff;
          font-size: 1.4rem;
          font-weight: 600;
        }
        
        .wb-intro {
          background: linear-gradient(135deg, rgba(86, 156, 214, 0.08) 0%, rgba(86, 156, 214, 0.03) 100%);
        }
        
        .wb-intro-text {
          font-size: 1.15rem;
          line-height: 1.9;
          color: #cccccc;
          margin-bottom: 24px;
        }
        
        .wb-info-box {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          background: rgba(86, 156, 214, 0.12);
          border: 1px solid rgba(86, 156, 214, 0.25);
          border-radius: 10px;
          margin-top: 20px;
        }
        
        .wb-info-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .wb-info-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .wb-info-label {
          color: #9cdcfe;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        
        .wb-info-link {
          color: #4fc3f7;
          text-decoration: none;
          font-size: 1rem;
        }
        
        .wb-info-link:hover {
          color: #81d4fa;
          text-decoration: underline;
        }
        
        .wb-code-section {
          padding: 0;
          background: #1a1a1e;
        }
        
        .wb-code-section .wb-section-header {
          padding: 40px 40px 24px;
          margin-bottom: 0;
        }
        
        .wb-code-lang {
          margin-left: auto;
          background: rgba(86, 156, 214, 0.18);
          color: #569cd6;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        
        .wb-code-container {
          border-top: 1px solid #3c3c3c;
        }
        
        .wb-code-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          background: #252526;
          border-bottom: 1px solid #3c3c3c;
        }
        
        .wb-code-filename {
          color: #9cdcfe;
          font-size: 0.9rem;
          font-family: 'Consolas', 'Monaco', monospace;
          font-weight: 500;
        }
        
        .wb-code-copy {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: #cccccc;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .wb-code-copy:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          transform: scale(1.05);
        }
        
        .wb-code-content {
          padding: 32px 40px;
          background: #1e1e1e;
          overflow: auto;
        }
        
        .wb-code-content pre {
          margin: 0;
          background: transparent;
          padding: 0;
        }
        
        .wb-code-content code {
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.8;
          color: #d4d4d4;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          background: transparent;
        }
        
        .wb-tips {
          background: linear-gradient(135deg, rgba(78, 201, 176, 0.08) 0%, rgba(78, 201, 176, 0.03) 100%);
        }
        
        .wb-tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 24px;
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
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        
        .wb-tip-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }
        
        .wb-tip-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .wb-tip-title {
          color: #4ec9b0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .wb-tip-text {
          color: #9cdcfe;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        .wb-footer {
          padding: 20px 40px;
          background: #252526;
          border-top: 1px solid #3c3c3c;
          flex-shrink: 0;
        }
        
        .wb-footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
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
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .wb-footer-link:hover {
          background: rgba(79, 195, 247, 0.18);
          border-color: rgba(79, 195, 247, 0.35);
          color: #81d4fa;
        }
        
        .wb-footer-link .arrow {
          transition: transform 0.2s;
        }
        
        .wb-footer-link:hover .arrow {
          transform: translateX(4px);
        }
        
        .wb-footer-meta {
          color: #64748b;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .wb-header { padding: 24px; flex-direction: column; gap: 20px; align-items: flex-start; }
          .wb-icon { font-size: 2.5rem; }
          .wb-title { font-size: 1.75rem; }
          .wb-section { padding: 28px 24px; }
          .wb-code-content { padding: 24px 28px; }
          .wb-tips-grid { grid-template-columns: 1fr; }
          .wb-footer-content { flex-direction: column; align-items: flex-start; }
        }
      </style>
    `;

    // Create maximized window with redesigned article layout
    const htmlContent = `
      ${inlineStyles}
      <div class="wb">
        <!-- Article Header -->
        <header class="wb-header">
          <div class="wb-title-section">
            <span class="wb-icon">${card.icon}</span>
            <div class="wb-title-group">
              <h1 class="wb-title">${card.title}</h1>
              <p class="wb-subtitle">${card.description}</p>
            </div>
          </div>
          <div class="wb-actions">
            <button class="wb-copy-btn" onclick="copyCodeToClipboard(this)" title="Copy code">
              <span class="btn-icon">📋</span>
              <span class="btn-text">Copy Code</span>
            </button>
          </div>
        </header>

        <!-- Article Content -->
        <div class="wb-content">
          <!-- Introduction Section -->
          <section class="wb-section wb-intro">
            <div class="wb-section-header">
              <span class="wb-section-icon">📖</span>
              <h2 class="wb-section-title">Overview</h2>
            </div>
            <div class="wb-section-content">
              <p class="wb-intro-text">${card.description}</p>
              ${card.link ? `
              <div class="wb-info-box">
                <span class="wb-info-icon">🔗</span>
                <div class="wb-info-content">
                  <span class="wb-info-label">Official Documentation</span>
                  <a href="${card.link}" target="_blank" class="wb-info-link">${card.link}</a>
                </div>
              </div>
              ` : ''}
            </div>
          </section>

          <!-- Code Example Section -->
          <section class="wb-section wb-code-section">
            <div class="wb-section-header">
              <span class="wb-section-icon">💻</span>
              <h2 class="wb-section-title">Example Usage</h2>
              <span class="wb-code-lang">TypeScript</span>
            </div>
            <div class="wb-code-container">
              <div class="wb-code-toolbar">
                <span class="wb-code-filename">${card.title.toLowerCase().replace(/\s+/g, '-')}.ts</span>
                <div class="wb-code-actions">
                  <button class="wb-code-copy" onclick="copyCodeToClipboard(this)" title="Copy">
                    📋
                  </button>
                </div>
              </div>
              <div class="wb-code-content">
                <pre><code class="language-typescript">${escapedCode}</code></pre>
              </div>
            </div>
          </section>

          <!-- Tips Section -->
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
                  <p class="wb-tip-text">Optimized for production use with tree-shaking support</p>
                </div>
              </div>
              <div class="wb-tip-card">
                <span class="wb-tip-icon">🔒</span>
                <div class="wb-tip-content">
                  <h3 class="wb-tip-title">Type Safety</h3>
                  <p class="wb-tip-text">Full TypeScript support with comprehensive type definitions</p>
                </div>
              </div>
              <div class="wb-tip-card">
                <span class="wb-tip-icon">🧩</span>
                <div class="wb-tip-content">
                  <h3 class="wb-tip-title">Modular</h3>
                  <p class="wb-tip-text">Import only what you need to reduce bundle size</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Article Footer -->
        <footer class="wb-footer">
          <div class="wb-footer-content">
            ${card.link ? `
            <a href="${card.link}" target="_blank" class="wb-footer-link">
              <span class="link-icon">🌐</span>
              <span class="link-text">Visit ${card.title} Website</span>
              <span class="arrow">↗</span>
            </a>
            ` : ''}
            <span class="wb-footer-meta">Generated with Angular Rsbuild Demo</span>
          </div>
        </footer>
      </div>
    `;

    const { id } = this.winBoxManager.createMaximizedWindow({
      title: card.title,
      color: card.color,
      icon: card.icon,
      html: htmlContent,
      onfocus: function (this: any) {
        this.setBackground(card.color);
      },
    });

    // Highlight code after window is created and DOM is ready
    setTimeout(() => {
      if (typeof Prism !== 'undefined') {
        const codeElement = document.querySelector(`code.language-typescript:last-of-type`);
        if (codeElement) {
          Prism.highlightElement(codeElement);
        }
      }
    }, 200);
  }

  private _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Global function for copy to clipboard
(window as any).copyCodeToClipboard = function(btn: HTMLElement) {
  const codeContainer = btn.closest('.winbox-content-wrapper');
  const codeElement = codeContainer?.querySelector('code');
  
  if (codeElement) {
    // Get plain text content
    const codeText = codeElement.textContent || '';
    
    // Copy to clipboard
    navigator.clipboard.writeText(codeText).then(() => {
      // Show feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = '✅ Copied!';
      btn.classList.add('copied');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      btn.innerHTML = '❌ Failed';
      setTimeout(() => {
        btn.innerHTML = '📋 Copy';
      }, 2000);
    });
  }
};
