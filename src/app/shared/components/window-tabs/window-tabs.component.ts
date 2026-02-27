import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit, signal, type Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
          <button
            type="button"
            class="icon-btn"
            (click)="goHome()"
            title="Hide all windows"
          >
            🏠
          </button>
        </div>
      </div>

      <!-- Row 2: Window Tabs Switcher -->
      <div class="bottom-row">
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
  styles: [
    `
    /* Fixed Top Two-Row Panel */
    .window-tab-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 9999;
    }

    /* Row 1: Top Row */
    .top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 44px;
      padding: 0 16px;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .app-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .app-icon {
      font-size: 1.25rem;
    }

    .app-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #f8fafc;
      letter-spacing: 0.02em;
    }

    .window-stats {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 700;
      color: #6366f1;
      background: rgba(99, 102, 241, 0.15);
      padding: 2px 8px;
      border-radius: 9999px;
    }

    .stat-value.minimized-count {
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.15);
    }

    .stat-label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-divider {
      color: #475569;
      font-size: 0.85rem;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: #f8fafc;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    /* Row 2: Bottom Row (Tab Switcher) */
    .bottom-row {
      display: flex;
      align-items: center;
      height: 44px;
      padding: 0 12px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      gap: 12px;
    }

    .tabs-scroll-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
      scrollbar-color: #475569 #0f172a;
    }

    .tabs-scroll-container::-webkit-scrollbar {
      height: 3px;
    }

    .tabs-scroll-container::-webkit-scrollbar-track {
      background: #0f172a;
    }

    .tabs-scroll-container::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 2px;
    }

    .tabs-scroll-container::-webkit-scrollbar-thumb:hover {
      background: #64748b !important;
    }

    /* Tab Item */
    .tab-item {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 8px 16px !important;
      background: rgba(255, 255, 255, 0.03) !important;
      border: none !important;
      border-bottom: 3px solid transparent !important;
      border-radius: 6px 6px 0 0 !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
    }

    .tab-item:hover {
      background: rgba(255, 255, 255, 0.08) !important;
    }

    .tab-item.active {
      background: rgba(255, 255, 255, 0.12) !important;
      border-bottom-color: #10b981 !important;
    }

    .tab-item.minimized {
      opacity: 0.5 !important;
      background: rgba(255, 255, 255, 0.02) !important;
    }

    .tab-icon {
      font-size: 1rem !important;
    }

    .tab-title {
      font-size: 0.85rem !important;
      font-weight: 500 !important;
      color: #cbd5e1 !important;
    }

    .tab-item.active .tab-title {
      color: #f8fafc !important;
    }

    /* Tab Actions (Row 1 - removed, kept for compatibility) */
    .tab-actions {
      display: none !important;
    }

    /* No Windows Message */
    .no-windows {
      color: #64748b;
      font-size: 0.8rem;
      padding: 0 16px;
      font-style: italic;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .top-row {
        height: 40px;
        padding: 0 12px;
      }

      .app-title {
        font-size: 0.85rem;
      }

      .stat-label {
        display: none;
      }

      .bottom-row {
        height: 40px;
        padding: 0 8px;
      }

      .tab-title {
        font-size: 0.75rem;
      }

      .action-btn {
        width: 28px;
        height: 28px;
      }
    }

    @media (max-width: 480px) {
      .app-title {
        display: none;
      }

      .app-icon {
        font-size: 1.1rem;
      }

      .stat-divider {
        display: none;
      }

      .tab-title {
        display: none;
      }

      .tab-icon {
        font-size: 1.1rem;
      }
    }
  `,
  ],
})
export class WindowTabsComponent implements OnInit {
  private readonly winBoxManager = inject(WinBoxManagerService);
  readonly windows: Signal<WindowInfo[]>;

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
}
