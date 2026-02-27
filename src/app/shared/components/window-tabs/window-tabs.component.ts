import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit, type Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { WinBoxManagerService, type WindowInfo } from '../../services/winbox-manager.service';

@Component({
  selector: 'app-window-tabs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Fixed Top Two-Row Panel -->
    <div class="window-tab-bar">
      <!-- Row 1: App Title & Stats -->
      <div class="top-row">
        <div class="app-info">
          <span class="app-icon">🪟</span>
          <span class="app-title">starter-web-angular-rsbuild</span>
        </div>
        <div class="window-stats-right">
          <span class="stat-item">
            <span class="stat-value">{{ windowCount() }}</span>
            <span class="stat-label">Windows</span>
          </span>
          <span class="stat-divider">•</span>
          <span class="stat-item">
            <span class="stat-value minimized-count">{{ minimizedCount() }}</span>
            <span class="stat-label">Minimized</span>
          </span>
          @if (windowCount() > 0) {
            <button
              type="button"
              class="close-all-btn"
              (click)="closeAll()"
              title="Close all windows"
            >
              🗑️
            </button>
          }
          <button
            class="theme-toggle"
            (click)="themeService.toggle()"
            [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
            [title]="themeService.isDarkMode() ? 'Light mode' : 'Dark mode'">
            {{ themeService.themeIcon() }}
          </button>
        </div>
      </div>

      <!-- Row 2: Home Button + Window Tabs Switcher -->
      <div class="bottom-row">
        <button
          type="button"
          class="home-tab"
          (click)="goHome()"
          title="Hide all windows and go home"
        >
          <span class="home-tab-icon">🏠</span>
          <span class="home-tab-label">Home</span>
        </button>
        <div class="tabs-scroll-container">
          @for (win of windows(); track win.id) {
            <button
              type="button"
              class="tab-item"
              [class.active]="!win.minimized"
              [class.minimized]="win.minimized"
              [style.border-bottom-color]="win.color"
              (click)="restoreWindow(win.id)"
              title="Click to focus: {{ win.title }}"
            >
              @if (win.icon) {
                <span class="tab-icon">{{ win.icon }}</span>
              }
              <span class="tab-title">{{ win.title }}</span>
            </button>
          } @empty {
            <span class="no-windows">No windows open - Click a card below to create one</span>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './window-tabs.component.css',
})
export class WindowTabsComponent implements OnInit {
  private readonly winBoxManager = inject(WinBoxManagerService);
  readonly windows: Signal<WindowInfo[]>;
  readonly themeService = inject(ThemeService);

  constructor() {
    this.windows = this.winBoxManager.windowsList;
  }

  ngOnInit(): void {
    // Keyboard shortcut
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'W') {
        e.preventDefault();
        // Focus first window when shortcut pressed
        const firstWindow = this.winBoxManager.windowsList()[0];
        if (firstWindow) {
          this.winBoxManager.restoreWindow(firstWindow.id);
        }
      }
    });
  }

  windowCount = () => this.winBoxManager.getWindowCount();
  minimizedCount = () => this.winBoxManager.getMinimizedCount();

  restoreWindow(id: string): void {
    this.winBoxManager.restoreWindow(id);
  }

  goHome(): void {
    this.winBoxManager.hideAll();
  }

  closeAll(): void {
    this.winBoxManager.closeAll();
  }
}
