import { CommonModule } from '@angular/common';
import { Component, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  AppState,
  DevToolsService,
  MemoryInfo,
  PerformanceMetrics,
  RouteInfo,
} from '../../services/devtools.service';
import type { ErrorHandlerService } from '../../services/error-handler.service';

interface TabConfig {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-devtools-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- DevTools Toggle Button -->
    <button
      class="devtools-toggle"
      (click)="togglePanel()"
      [class.active]="panelOpenState"
      title="Toggle DevTools (Ctrl+Shift+D)"
    >
      <span class="toggle-icon">{{ panelOpenState ? '▼' : '▲' }}</span>
      <span class="toggle-label">DevTools</span>
      @if (errorCount() > 0) {
        <span class="error-badge">{{ errorCount() }}</span>
      }
    </button>

    <!-- DevTools Panel -->
    @if (panelOpenState) {
      <div class="devtools-panel" [style.height.px]="panelHeight()">
        <!-- Panel Header -->
        <div class="panel-header">
          <div class="panel-title">
            <span class="title-icon">🛠️</span>
            <span>Frontend DevTools</span>
          </div>
          <div class="panel-actions">
            <button
              type="button"
              class="action-btn"
              (click)="refreshData()"
              title="Refresh"
            >
              🔄
            </button>
            <button
              type="button"
              class="action-btn"
              (click)="copyInfo()"
              title="Copy Info"
            >
              📋
            </button>
            <button
              type="button"
              class="action-btn"
              (click)="togglePanel()"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="panel-tabs">
          @for (tab of tabs; track tab.id) {
            <button
              type="button"
              class="tab-btn"
              [class.active]="currentTabState === tab.id"
              (click)="setActiveTab(tab.id)"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-label">{{ tab.label }}</span>
              @if (tab.badge) {
                <span class="tab-badge">{{ tab.badge }}</span>
              }
            </button>
          }
        </div>

        <!-- Panel Content -->
        <div class="panel-content">
          <!-- Overview Tab -->
          @if (currentTabState === 'overview') {
            <div class="tab-content overview-tab">
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-label">Angular Version</div>
                  <div class="info-value">{{ appState.angularVersion }}</div>
                </div>
                <div class="info-card">
                  <div class="info-label">Mode</div>
                  <div class="info-value mode-badge" [class.production]="appState.isProduction">
                    {{ appState.isProduction ? 'Production' : 'Development' }}
                  </div>
                </div>
                <div class="info-card">
                  <div class="info-label">Components</div>
                  <div class="info-value">{{ appState.componentCount }}</div>
                </div>
                <div class="info-card">
                  <div class="info-label">Routes Visited</div>
                  <div class="info-value">{{ appState.routeHistory.length }}</div>
                </div>
                <div class="info-card">
                  <div class="info-label">Errors</div>
                  <div class="info-value error-count" [class.has-errors]="errorCount() > 0">
                    {{ errorCount() }}
                  </div>
                </div>
                <div class="info-card">
                  <div class="info-label">Current Route</div>
                  <div class="info-value route-value">{{ currentRoute }}</div>
                </div>
              </div>

              <div class="section">
                <h3 class="section-title">📦 Application Info</h3>
                <div class="info-table">
                  <div class="info-row">
                    <span class="info-key">Base URL</span>
                    <span class="info-val">{{ baseUrl }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">User Agent</span>
                    <span class="info-val user-agent">{{ userAgent }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Viewport</span>
                    <span class="info-val">{{ viewport }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Device Pixel Ratio</span>
                    <span class="info-val">{{ devicePixelRatio }}x</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Online Status</span>
                    <span class="info-val status-badge" [class.online]="isOnline" [class.offline]="!isOnline">
                      {{ isOnline ? '🟢 Online' : '🔴 Offline' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Routes Tab -->
          @if (currentTabState === 'routes') {
            <div class="tab-content routes-tab">
              <div class="routes-header">
                <h3 class="section-title">📍 Route History</h3>
                <button type="button" class="clear-btn" (click)="clearRouteHistory()">
                  Clear
                </button>
              </div>
              <div class="routes-list">
                @for (route of routeHistory; track route.timestamp; let last = $last) {
                  <div class="route-item" [class.current]="last">
                    <div class="route-time">{{ route.timestamp | date:'HH:mm:ss' }}</div>
                    <div class="route-info">
                      <span class="route-path">{{ route.path }}</span>
                      @if (!last) {
                        <button
                          type="button"
                          class="navigate-btn"
                          (click)="navigateTo(route.path)"
                          title="Navigate"
                        >
                          →
                        </button>
                      }
                    </div>
                  </div>
                } @empty {
                  <div class="empty-state">No routes visited yet</div>
                }
              </div>
            </div>
          }

          <!-- Performance Tab -->
          @if (currentTabState === 'performance') {
            <div class="tab-content performance-tab">
              @if (performanceMetrics) {
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-icon">⏱️</div>
                    <div class="metric-label">DOM Content Loaded</div>
                    <div class="metric-value">{{ devTools.formatMs(performanceMetrics.domContentLoaded) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">🚀</div>
                    <div class="metric-label">Load Complete</div>
                    <div class="metric-value">{{ devTools.formatMs(performanceMetrics.loadComplete) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">🎨</div>
                    <div class="metric-label">First Paint</div>
                    <div class="metric-value">{{ performanceMetrics.firstPaint ? devTools.formatMs(performanceMetrics.firstPaint) : 'N/A' }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">📄</div>
                    <div class="metric-label">First Contentful Paint</div>
                    <div class="metric-value">{{ performanceMetrics.firstContentfulPaint ? devTools.formatMs(performanceMetrics.firstContentfulPaint) : 'N/A' }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">📦</div>
                    <div class="metric-label">Resources Loaded</div>
                    <div class="metric-value">{{ performanceMetrics.resourceCount }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">💾</div>
                    <div class="metric-label">Total Transfer Size</div>
                    <div class="metric-value">{{ devTools.formatBytes(performanceMetrics.totalResourceSize) }}</div>
                  </div>
                </div>

                <div class="section">
                  <h3 class="section-title">📊 Performance Timeline</h3>
                  <div class="timeline-bar">
                    <div class="timeline-segment" [style.width.%]="getTimelinePercentage(performanceMetrics.domContentLoaded)">
                      <span class="segment-label">DOM</span>
                    </div>
                    <div class="timeline-segment fcp" [style.width.%]="getTimelinePercentage((performanceMetrics.firstContentfulPaint || 0) - performanceMetrics.domContentLoaded)">
                      <span class="segment-label">FCP</span>
                    </div>
                    <div class="timeline-segment load" [style.width.%]="getTimelinePercentage(performanceMetrics.loadComplete - (performanceMetrics.firstContentfulPaint || performanceMetrics.domContentLoaded))">
                      <span class="segment-label">Load</span>
                    </div>
                  </div>
                </div>
              } @else {
                <div class="empty-state">Performance API not available</div>
              }
            </div>
          }

          <!-- Memory Tab -->
          @if (currentTabState === 'memory') {
            <div class="tab-content memory-tab">
              @if (memoryInfo) {
                <div class="memory-cards">
                  <div class="memory-card">
                    <div class="memory-label">Used Heap</div>
                    <div class="memory-value">{{ devTools.formatBytes(memoryInfo.usedJSHeapSize) }}</div>
                    <div class="memory-bar">
                      <div
                        class="memory-fill used"
                        [style.width.%]="getMemoryPercentage()"
                      ></div>
                    </div>
                  </div>
                  <div class="memory-card">
                    <div class="memory-label">Total Heap</div>
                    <div class="memory-value">{{ devTools.formatBytes(memoryInfo.totalJSHeapSize) }}</div>
                  </div>
                  <div class="memory-card">
                    <div class="memory-label">Heap Limit</div>
                    <div class="memory-value">{{ devTools.formatBytes(memoryInfo.jsHeapSizeLimit) }}</div>
                  </div>
                </div>

                <div class="section">
                  <h3 class="section-title">💡 Memory Tips</h3>
                  <ul class="tips-list">
                    <li>High memory usage may indicate memory leaks</li>
                    <li>Check for unsubscribed observables</li>
                    <li>Look for detached DOM elements</li>
                    <li>Monitor component creation/destruction</li>
                  </ul>
                </div>
              } @else {
                <div class="empty-state">
                  Memory API not available in this browser.
                  <br>Try Chrome or Edge desktop.
                </div>
              }
            </div>
          }

          <!-- Errors Tab -->
          @if (currentTabState === 'errors') {
            <div class="tab-content errors-tab">
              <div class="errors-header">
                <h3 class="section-title">⚠️ Error Log</h3>
                <div class="errors-actions">
                  <button type="button" class="clear-btn" (click)="clearErrors()">
                    Clear All
                  </button>
                </div>
              </div>
              <div class="errors-list">
                @for (error of errors; track error.timestamp; let last = $last) {
                  <div class="error-item" [class.error]="error.type === 'error'" [class.warning]="error.type === 'warning'" [class.info]="error.type === 'info'">
                    <div class="error-time">{{ error.timestamp | date:'HH:mm:ss' }}</div>
                    <div class="error-type-badge" [class]="'type-' + error.type">
                      {{ error.type }}
                    </div>
                    <div class="error-message">{{ error.message }}</div>
                  </div>
                } @empty {
                  <div class="empty-state success">✓ No errors recorded</div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Panel Resize Handle -->
        <div
          class="resize-handle"
          (mousedown)="startResize($event)"
        >
          <div class="resize-grip">⋮⋮</div>
        </div>
      </div>
    }
  `,
  styles: [
    `
    /* Toggle Button */
    .devtools-toggle {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      color: #fff;
      border: none;
      border-radius: 12px 12px 0 0;
      padding: 10px 24px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9998;
      transition: all 0.3s ease;
    }

    .devtools-toggle:hover {
      background: linear-gradient(135deg, #2d5a87 0%, #3d7ab5 100%);
      transform: translateX(-50%) translateY(-2px);
    }

    .devtools-toggle.active {
      background: linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%);
    }

    .toggle-icon {
      font-size: 0.75rem;
      transition: transform 0.3s;
    }

    .devtools-toggle.active .toggle-icon {
      transform: rotate(180deg);
    }

    .error-badge {
      background: #ef4444;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 9999px;
      min-width: 20px;
      text-align: center;
    }

    /* Panel */
    .devtools-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      border-radius: 16px 16px 0 0;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-bottom: 1px solid #cbd5e1;
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      color: #1e293b;
    }

    .title-icon {
      font-size: 1.1rem;
    }

    .panel-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      background: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Tabs */
    .panel-tabs {
      display: flex;
      gap: 4px;
      padding: 8px 16px 0;
      background: #f1f5f9;
      border-bottom: 1px solid #e2e8f0;
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      color: #64748b;
      border-radius: 8px 8px 0 0;
      transition: all 0.2s;
      position: relative;
    }

    .tab-btn:hover {
      background: rgba(255, 255, 255, 0.5);
      color: #334155;
    }

    .tab-btn.active {
      background: #fff;
      color: #1e40af;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
    }

    .tab-icon {
      font-size: 1rem;
    }

    .tab-badge {
      background: #ef4444;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 9999px;
      min-width: 18px;
      text-align: center;
    }

    /* Content */
    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #fafafa;
    }

    .tab-content {
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Overview Tab */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .info-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px;
      text-align: center;
    }

    .info-label {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .info-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .mode-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.8rem;
    }

    .mode-badge.production {
      background: #dcfce7;
      color: #166534;
    }

    .error-count {
      color: #ef4444;
    }

    .error-count.has-errors {
      background: #fee2e2;
      padding: 4px 12px;
      border-radius: 9999px;
    }

    .route-value {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.85rem;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .section {
      margin-top: 20px;
    }

    .section-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 12px;
    }

    .info-table {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .info-row {
      display: flex;
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-key {
      font-weight: 500;
      color: #64748b;
      width: 180px;
      flex-shrink: 0;
    }

    .info-val {
      color: #1e293b;
      word-break: break-word;
    }

    .info-val.user-agent {
      flex: 1;
      font-size: 0.85rem;
      font-family: 'Monaco', 'Consolas', monospace;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.8rem;
    }

    .status-badge.online {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.offline {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Routes Tab */
    .routes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .clear-btn {
      padding: 6px 12px;
      font-size: 0.8rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .routes-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .route-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
    }

    .route-item.current {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .route-time {
      font-size: 0.75rem;
      color: #94a3b8;
      font-family: monospace;
    }

    .route-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .route-path {
      flex: 1;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.9rem;
      color: #1e293b;
    }

    .navigate-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: none;
      background: #3b82f6;
      color: #fff;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .navigate-btn:hover {
      background: #2563eb;
    }

    /* Performance Tab */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .metric-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
    }

    .metric-icon {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }

    .metric-label {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .metric-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e40af;
    }

    .timeline-bar {
      display: flex;
      height: 40px;
      background: #f1f5f9;
      border-radius: 8px;
      overflow: hidden;
    }

    .timeline-segment {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 500;
      color: #fff;
      min-width: 0;
    }

    .timeline-segment:first-child {
      background: #3b82f6;
    }

    .timeline-segment.fcp {
      background: #8b5cf6;
    }

    .timeline-segment.load {
      background: #10b981;
    }

    .segment-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 4px;
    }

    /* Memory Tab */
    .memory-cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 20px;
    }

    .memory-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
    }

    .memory-label {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 6px;
    }

    .memory-value {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
    }

    .memory-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
    }

    .memory-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    .memory-fill.used {
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
    }

    .tips-list {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
      list-style: none;
      margin: 0;
    }

    .tips-list li {
      padding: 8px 0;
      color: #475569;
      font-size: 0.9rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .tips-list li:last-child {
      border-bottom: none;
    }

    .tips-list li::before {
      content: '💡 ';
    }

    /* Errors Tab */
    .errors-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .errors-actions {
      display: flex;
      gap: 8px;
    }

    .errors-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .error-item {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .error-item.error {
      border-left: 4px solid #ef4444;
    }

    .error-item.warning {
      border-left: 4px solid #f59e0b;
    }

    .error-item.info {
      border-left: 4px solid #3b82f6;
    }

    .error-time {
      font-size: 0.75rem;
      color: #94a3b8;
      font-family: monospace;
      white-space: nowrap;
    }

    .error-type-badge {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .error-type-badge.type-error {
      background: #fee2e2;
      color: #dc2626;
    }

    .error-type-badge.type-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .error-type-badge.type-info {
      background: #dbeafe;
      color: #2563eb;
    }

    .error-message {
      flex: 1;
      font-size: 0.9rem;
      color: #1e293b;
      word-break: break-word;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #94a3b8;
    }

    .empty-state.success {
      color: #16a34a;
    }

    /* Resize Handle */
    .resize-handle {
      height: 16px;
      cursor: ns-resize;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      transition: background 0.2s;
    }

    .resize-handle:hover {
      background: #e2e8f0;
    }

    .resize-grip {
      font-size: 10px;
      color: #94a3b8;
      letter-spacing: 2px;
      user-select: none;
    }

    /* Scrollbar */
    .panel-content::-webkit-scrollbar {
      width: 8px;
    }

    .panel-content::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .panel-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .panel-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .panel-tabs {
        overflow-x: auto;
      }

      .tab-btn {
        white-space: nowrap;
      }
    }
  `,
  ],
})
export class DevToolsPanelComponent implements OnInit {
  private readonly devTools: DevToolsService;
  private readonly errorHandler: ErrorHandlerService;

  readonly panelOpen = signal(false);
  readonly activeTab = signal<'overview' | 'routes' | 'performance' | 'memory' | 'errors'>(
    'overview'
  );

  panelHeight = signal(400);
  isResizing = false;
  startY = 0;
  startHeight = 0;

  currentRoute = '';
  baseUrl = window.location.origin;
  userAgent = navigator.userAgent;
  viewport = `${window.innerWidth} x ${window.innerHeight}`;
  devicePixelRatio = window.devicePixelRatio;
  isOnline = navigator.onLine;

  appState: AppState = {
    angularVersion: '',
    isProduction: false,
    routeHistory: [],
    componentCount: 0,
    errorCount: 0,
    warningCount: 0,
  };

  routeHistory: RouteInfo[] = [];
  performanceMetrics: PerformanceMetrics | null = null;
  memoryInfo: MemoryInfo | null = null;
  errors: Array<{ message: string; timestamp: Date; type: string }> = [];

  tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'routes', label: 'Routes', icon: '📍' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'memory', label: 'Memory', icon: '💾' },
    { id: 'errors', label: 'Errors', icon: '⚠️', badge: 0 },
  ];

  private resizeListener?: (e: MouseEvent) => void;
  private resizeUpListener?: (e: MouseEvent) => void;

  constructor(devTools: DevToolsService, errorHandler: ErrorHandlerService) {
    this.devTools = devTools;
    this.errorHandler = errorHandler;

    // Update error count in tabs
    this.errorHandler.errors$.subscribe(() => {
      const errorTab = this.tabs.find(t => t.id === 'errors');
      if (errorTab) {
        errorTab.badge = this.errorHandler.getErrorCount();
      }
    });

    // Listen for online/offline events
    window.addEventListener('online', () => (this.isOnline = true));
    window.addEventListener('offline', () => (this.isOnline = false));
  }

  get panelOpenState() {
    return this.devTools.panelOpen();
  }

  get currentTabState() {
    return this.devTools.currentTab();
  }

  ngOnInit(): void {
    this.refreshData();
    this.currentRoute = window.location.pathname;

    // Keyboard shortcut
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.togglePanel();
      }
    });
  }

  get errorCount(): number {
    return this.errorHandler.getErrorCount();
  }

  togglePanel(): void {
    this.devTools.togglePanel();
    if (this.panelOpenState) {
      setTimeout(() => this.refreshData(), 100);
    }
  }

  setActiveTab(tabId: string): void {
    this.devTools.setActiveTab(tabId as never);
    if (tabId === 'performance' || tabId === 'memory') {
      setTimeout(() => this.refreshData(), 100);
    }
  }

  refreshData(): void {
    this.appState = this.devTools.getAppState();
    this.routeHistory = this.devTools.getRouteHistory();
    this.performanceMetrics = this.devTools.getPerformanceMetrics();
    this.memoryInfo = this.devTools.getMemoryInfo();
    this.errors = this.errorHandler.getErrors();
    this.viewport = `${window.innerWidth} x ${window.innerHeight}`;
  }

  clearRouteHistory(): void {
    // Clear except current route
    const current = this.routeHistory[this.routeHistory.length - 1];
    this.routeHistory.length = 0;
    if (current) {
      this.routeHistory.push(current);
    }
  }

  navigateTo(path: string): void {
    // Simple navigation - in real app, inject Router
    window.location.href = path;
  }

  clearErrors(): void {
    this.errorHandler.clearErrors();
    this.errors = [];
    const errorTab = this.tabs.find(t => t.id === 'errors');
    if (errorTab) {
      errorTab.badge = 0;
    }
  }

  copyInfo(): void {
    const info = this.formatInfo();
    navigator.clipboard.writeText(info).then(() => {
      alert('DevTools info copied to clipboard!');
    });
  }

  getTimelinePercentage(ms: number): number {
    const total = this.performanceMetrics?.loadComplete || 1;
    return Math.min((ms / total) * 100, 100);
  }

  getMemoryPercentage(): number {
    if (!this.memoryInfo) return 0;
    return (this.memoryInfo.usedJSHeapSize / this.memoryInfo.jsHeapSizeLimit) * 100;
  }

  startResize(event: MouseEvent): void {
    this.isResizing = true;
    this.startY = event.clientY;
    this.startHeight = this.panelHeight();

    this.resizeListener = (e: MouseEvent) => this.onResize(e);
    this.resizeUpListener = () => this.stopResize();

    document.addEventListener('mousemove', this.resizeListener);
    document.addEventListener('mouseup', this.resizeUpListener);
  }

  private onResize(event: MouseEvent): void {
    if (!this.isResizing) return;
    const deltaY = this.startY - event.clientY;
    const newHeight = Math.max(200, Math.min(600, this.startHeight + deltaY));
    this.panelHeight.set(newHeight);
  }

  private stopResize(): void {
    this.isResizing = false;
    if (this.resizeListener) {
      document.removeEventListener('mousemove', this.resizeListener);
    }
    if (this.resizeUpListener) {
      document.removeEventListener('mouseup', this.resizeUpListener);
    }
  }

  private formatInfo(): string {
    return `
Frontend DevTools Report
========================

Application:
- Angular Version: ${this.appState.angularVersion}
- Mode: ${this.appState.isProduction ? 'Production' : 'Development'}
- Components: ${this.appState.componentCount}
- Current Route: ${this.currentRoute}

Performance:
${
  this.performanceMetrics
    ? `
- DOM Content Loaded: ${this.devTools.formatMs(this.performanceMetrics.domContentLoaded)}
- Load Complete: ${this.devTools.formatMs(this.performanceMetrics.loadComplete)}
- First Paint: ${this.performanceMetrics.firstPaint ? this.devTools.formatMs(this.performanceMetrics.firstPaint) : 'N/A'}
- Resources: ${this.performanceMetrics.resourceCount}
- Total Size: ${this.devTools.formatBytes(this.performanceMetrics.totalResourceSize)}
`
    : 'N/A'
}

Memory:
${
  this.memoryInfo
    ? `
- Used Heap: ${this.devTools.formatBytes(this.memoryInfo.usedJSHeapSize)}
- Total Heap: ${this.devTools.formatBytes(this.memoryInfo.totalJSHeapSize)}
- Heap Limit: ${this.devTools.formatBytes(this.memoryInfo.jsHeapSizeLimit)}
`
    : 'N/A'
}

System:
- Viewport: ${this.viewport}
- Device Pixel Ratio: ${this.devicePixelRatio}x
- Online: ${this.isOnline ? 'Yes' : 'No'}
- URL: ${window.location.href}

Generated: ${new Date().toISOString()}
    `.trim();
  }
}
