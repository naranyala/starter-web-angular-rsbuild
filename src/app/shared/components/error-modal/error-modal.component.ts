import { type ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import type { ErrorInfo, ErrorModalService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-modal',
  standalone: true,
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
          </div>

          <div class="error-modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="close()"
            >
              Dismiss
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
  `,
  ],
})
export class ErrorModalComponent implements OnInit {
  private readonly errorModalService: ErrorModalService;
  private readonly cdr: ChangeDetectorRef;

  currentError: ErrorInfo | null = null;

  constructor(errorModalService: ErrorModalService, cdr: ChangeDetectorRef) {
    this.errorModalService = errorModalService;
    this.cdr = cdr;
  }

  ngOnInit(): void {
    this.errorModalService.currentError$.subscribe(error => {
      this.currentError = error;
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
}
