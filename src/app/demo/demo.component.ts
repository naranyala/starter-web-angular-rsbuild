import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

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

      <!-- Test Error Button -->
      <div class="test-error-section">
        <button type="button" class="test-error-btn" (click)="triggerError()">
          🐛 Test Error Modal
        </button>
        <button type="button" class="test-error-btn warning" (click)="triggerWarning()">
          ⚠️ Test Warning
        </button>
      </div>

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
  styles: [
    `
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

    /* Search Styles */
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
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
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

    /* Cards Grid */
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
      transition:
        transform 0.2s,
        box-shadow 0.2s,
        cursor 0.2s;
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

    /* No Results */
    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 0.9rem;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .cards-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      }

      .demo-container h1 {
        font-size: 1.25rem;
      }
    }

    /* Test Error Section */
    .test-error-section {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .test-error-btn {
      padding: 10px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .test-error-btn:hover {
      background: #f5f5f5;
      border-color: #0f3460;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .test-error-btn.warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .test-error-btn.warning:hover {
      background: #fef3c7;
      border-color: #d97706;
    }
  `,
  ],
})
export class DemoComponent {
  searchQuery = '';

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
    const _win = new window.WinBox({
      title: card.title,
      background: card.color,
      width: '700px',
      height: '500px',
      x: 'center',
      y: 'center',
      html: `
        <div style="display: flex; flex-direction: column; height: 100%; background: #1e1e1e;">
          <div style="padding: 12px 16px; background: #2d2d2d; border-bottom: 1px solid #404040;">
            <span style="color: #858585; font-size: 0.85rem; font-family: 'Consolas', 'Monaco', monospace;">${card.title} Example</span>
          </div>
          <div style="flex: 1; overflow: auto; padding: 16px;">
            <pre style="margin: 0;"><code style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: #d4d4d4;">${this._escapeHtml(card.codeMockup)}</code></pre>
          </div>
          ${
            card.link
              ? `
          <div style="padding: 12px 16px; background: #2d2d2d; border-top: 1px solid #404040;">
            <a href="${card.link}" target="_blank" style="color: #4fc3f7; text-decoration: none; font-size: 0.9rem;">
              ${card.link} ↗
            </a>
          </div>
          `
              : ''
          }
        </div>
      `,
      onfocus: function (this: any) {
        this.setBackground(card.color);
      },
    });
  }

  private readonly errorHandler = inject(ErrorHandlerService);

  private _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  triggerError(): void {
    // Trigger an error that will show the modal
    this.errorHandler.handleError(
      new Error('This is a test error! The error modal should be showing now.')
    );
  }

  triggerWarning(): void {
    // Trigger a warning (logged but no modal)
    this.errorHandler.warn('This is a test warning. Check the DevTools error tab.', {
      component: 'DemoComponent',
    });
  }
}
