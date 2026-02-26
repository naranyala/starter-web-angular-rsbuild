import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ErrorHandlerService,
  type ErrorInfo,
  ErrorModalService,
} from '../../services/error-handler.service';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (currentError) {
      <div class="error-modal-backdrop" (click)="onBackdropClick($event)">
        <div class="error-modal" role="alertdialog" aria-modal="true">
          <div class="error-modal-header">
            <div class="error-modal-title">
              <span class="error-icon">⚠️</span>
              <span>Application Error</span>
            </div>
            <button
              type="button"
              class="error-modal-close"
              (click)="close()"
              aria-label="Close error dialog"
            >
              ✕
            </button>
          </div>

          <div class="error-modal-body">
            <div class="error-message-section">
              <label class="error-label">Error Message</label>
              <div class="error-message">{{ currentError.message }}</div>
            </div>

            <div class="error-meta-section">
              <div class="error-meta-item">
                <label class="error-label">Time</label>
                <div class="error-meta-value">{{ currentError.timestamp | date:'medium' }}</div>
              </div>
              <div class="error-meta-item">
                <label class="error-label">Type</label>
                <div class="error-type-badge" [class]="'error-type-' + currentError.type">
                  {{ currentError.type | uppercase }}
                </div>
              </div>
            </div>

            @if (currentError.context?.url) {
              <div class="error-context-section">
                <label class="error-label">URL</label>
                <div class="error-url">{{ currentError.context.url }}</div>
              </div>
            }

            @if (currentError.stack) {
              <div class="error-stack-section">
                <label class="error-label">
                  Stack Trace
                  <button
                    type="button"
                    class="copy-btn"
                    (click)="copyStack()"
                    title="Copy stack trace"
                  >
                    📋 Copy
                  </button>
                </label>
                <pre class="error-stack">{{ currentError.stack }}</pre>
              </div>
            }

            @if (copied) {
              <div class="copy-success">✓ Copied to clipboard!</div>
            }
          </div>

          <div class="error-modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="close()"
            >
              Dismiss
            </button>
            <button
              type="button"
              class="btn btn-primary"
              (click)="reportError()"
            >
              📧 Report Error
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
    .error-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .error-modal {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .error-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #fee2e2 0%, #fef3c7 100%);
      border-bottom: 1px solid #e5e7eb;
    }

    .error-modal-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 1.1rem;
      color: #92400e;
    }

    .error-icon {
      font-size: 1.4rem;
    }

    .error-modal-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: rgba(0, 0, 0, 0.05);
      cursor: pointer;
      font-size: 1.2rem;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .error-modal-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #1f2937;
    }

    .error-modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .error-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      margin-bottom: 6px;
    }

    .error-message-section {
      margin-bottom: 16px;
    }

    .error-message {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 12px 16px;
      color: #92400e;
      font-size: 0.95rem;
      line-height: 1.5;
      word-break: break-word;
    }

    .error-meta-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .error-meta-item {
      display: flex;
      flex-direction: column;
    }

    .error-meta-value {
      font-size: 0.9rem;
      color: #374151;
    }

    .error-type-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .error-type-error {
      background: #fee2e2;
      color: #dc2626;
    }

    .error-type-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .error-type-info {
      background: #dbeafe;
      color: #2563eb;
    }

    .error-context-section {
      margin-bottom: 16px;
    }

    .error-url {
      background: #f3f4f6;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 0.85rem;
      color: #4b5563;
      font-family: 'Monaco', 'Consolas', monospace;
      overflow-x: auto;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .error-stack-section {
      margin-bottom: 16px;
    }

    .error-stack-section .error-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .copy-btn {
      padding: 4px 10px;
      font-size: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .error-stack {
      background: #1f2937;
      color: #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
      font-size: 0.8rem;
      line-height: 1.6;
      overflow-x: auto;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .copy-success {
      background: #d1fae5;
      color: #059669;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      text-align: center;
      animation: fadeOut 2s forwards;
    }

    @keyframes fadeOut {
      0%, 70% { opacity: 1; }
      100% { opacity: 0; }
    }

    .error-modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    .btn-primary {
      background: #2563eb;
      color: #fff;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    @media (max-width: 640px) {
      .error-modal {
        max-height: 90vh;
      }

      .error-meta-section {
        grid-template-columns: 1fr;
      }
    }
  `,
  ],
})
export class ErrorModalComponent implements OnInit {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly errorModalService = inject(ErrorModalService);
  private readonly cdr = inject(ChangeDetectorRef);

  currentError: ErrorInfo | null = null;
  copied = false;

  ngOnInit(): void {
    // Subscribe to errors from ErrorHandlerService
    this.errorHandler.errors$.subscribe(error => {
      // Only show modal for actual errors, not warnings or info
      if (error.type === 'error') {
        this.errorModalService.open(error);
        // Trigger change detection
        this.cdr.detectChanges();
      }
    });

    // Subscribe to modal state (current error)
    this.errorModalService.currentError$.subscribe(error => {
      this.currentError = error;
      // Trigger change detection when modal state changes
      this.cdr.detectChanges();
    });
  }

  close(): void {
    this.errorModalService.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  copyStack(): void {
    if (this.currentError?.stack) {
      navigator.clipboard.writeText(this.currentError.stack).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 2000);
      });
    }
  }

  reportError(): void {
    // Create email with error details
    const subject = encodeURIComponent(`Application Error: ${this.currentError?.message}`);
    const body = encodeURIComponent(this.formatErrorReport());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  private formatErrorReport(): string {
    if (!this.currentError) return '';

    return `
Error Report
============

Message: ${this.currentError.message}
Time: ${this.currentError.timestamp}
Type: ${this.currentError.type}
URL: ${this.currentError.context?.url || 'N/A'}
User Agent: ${this.currentError.context?.userAgent || 'N/A'}

Stack Trace:
${this.currentError.stack || 'No stack trace available'}
    `.trim();
  }
}
