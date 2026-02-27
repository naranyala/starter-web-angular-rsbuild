import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Prism from 'prismjs';
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
      <div class="hero-section">
        <h1>🚀 Technology Explorer</h1>
        <p class="subtitle">Discover the technologies powering this modern web application</p>
      </div>

      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Type to search... (try: 'angular', 'bun', 'ts')"
          [(ngModel)]="searchQuery"
          autofocus
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
            <p class="no-results-icon">🔍</p>
            <p>No results found for "<strong>{{ searchQuery }}</strong>"</p>
            <p class="no-results-hint">Try a different search term</p>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './demo.component.css',
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
    return this.cards.filter(card => {
      const title = card.title.toLowerCase();
      const description = card.description.toLowerCase();

      // Fuzzy search: check if query characters appear in order (not necessarily consecutive)
      const fuzzyMatch = (text: string, pattern: string): boolean => {
        let textIndex = 0;
        for (let char of pattern) {
          textIndex = text.indexOf(char, textIndex);
          if (textIndex === -1) return false;
          textIndex++;
        }
        return true;
      };

      // First try exact match (title or description contains the query)
      if (title.includes(query) || description.includes(query)) {
        return true;
      }

      // Then try fuzzy match on title
      return fuzzyMatch(title, query);
    });
  }

  openCard(card: CardItem): void {
    if (!window.WinBox) {
      console.error('WinBox is not available');
      return;
    }

    const existingWindows = this.winBoxManager.windowsList();
    const existing = existingWindows.find(w => w.title === card.title);
    if (existing) {
      this.winBoxManager.restoreWindow(existing.id);
      return;
    }

    const escapedCode = this._escapeHtml(card.codeMockup);

    const inlineStyles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .wb {
          height: 100vh;
          background: #1e1e1e;
          overflow: auto;
        }

        .wb-code-container {
          padding: 20px;
        }

        .wb-code-container pre {
          margin: 0;
        }

        .wb-code-container code {
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #d4d4d4;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          background: transparent;
        }
      </style>
    `;

    const htmlContent = `
      ${inlineStyles}
      <div class="wb">
        <div class="wb-code-container">
          <pre><code class="language-typescript">${escapedCode}</code></pre>
        </div>
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
