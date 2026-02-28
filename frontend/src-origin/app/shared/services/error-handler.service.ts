import { type ErrorHandler, Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: Date;
  type: 'error' | 'warning' | 'info';
  context?: {
    component?: string;
    url?: string;
    userAgent?: string;
  };
  originalError?: unknown;
}

/**
 * Global Error Handler Service
 * Captures all unhandled errors in the application
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private readonly errorSubject = new Subject<ErrorInfo>();
  private readonly errorsBehaviorSubject = new BehaviorSubject<ErrorInfo[]>([]);
  private readonly maxErrors = 50;
  private readonly errors: ErrorInfo[] = [];

  /** Observable stream of errors */
  readonly errors$ = this.errorSubject.asObservable();

  /** Get all captured errors as observable */
  readonly errorsList$ = this.errorsBehaviorSubject.asObservable();

  /** Get all captured errors */
  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /** Get error count */
  getErrorCount(): number {
    return this.errors.length;
  }

  /** Clear all errors */
  clearErrors(): void {
    this.errors.length = 0;
    this.errorsBehaviorSubject.next([]);
  }

  /** Handle error - implements Angular ErrorHandler */
  handleError(error: unknown): void {
    const errorInfo = this.extractErrorInfo(error);

    // Store error
    this.errors.push(errorInfo);

    // Trim old errors if exceeding max
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Update behavior subject with latest errors
    this.errorsBehaviorSubject.next([...this.errors]);

    // Emit to subscribers
    this.errorSubject.next(errorInfo);

    // Log to console for debugging
    console.error('[Global Error Handler]', errorInfo);
  }

  /** Log a warning */
  warn(message: string, context?: Record<string, unknown>): void {
    const errorInfo: ErrorInfo = {
      message,
      timestamp: new Date(),
      type: 'warning',
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    this.errorsBehaviorSubject.next([...this.errors]);
    this.errorSubject.next(errorInfo);
    console.warn('[Global Warning]', errorInfo);
  }

  /** Log info */
  info(message: string, context?: Record<string, unknown>): void {
    const errorInfo: ErrorInfo = {
      message,
      timestamp: new Date(),
      type: 'info',
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    this.errorsBehaviorSubject.next([...this.errors]);
    this.errorSubject.next(errorInfo);
    console.info('[Global Info]', errorInfo);
  }

  /** Extract error information from various error types */
  private extractErrorInfo(error: unknown): ErrorInfo {
    const errorInfo: ErrorInfo = {
      message: 'Unknown error',
      timestamp: new Date(),
      type: 'error',
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    if (error instanceof Error) {
      errorInfo.message = error.message;
      errorInfo.stack = error.stack;
      errorInfo.originalError = error;
    } else if (typeof error === 'string') {
      errorInfo.message = error;
    } else if (error && typeof error === 'object') {
      const errObj = error as Record<string, unknown>;
      errorInfo.message = String(errObj.message || errObj.error || 'Unknown error');
      errorInfo.stack = String(errObj.stack || '');
      errorInfo.originalError = error;
    }

    return errorInfo;
  }
}

/**
 * Error Modal Service
 * Controls the error modal display
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private readonly currentErrorSubject = new BehaviorSubject<ErrorInfo | null>(null);
  private isOpen = false;

  /** Observable for current error (triggers modal) */
  readonly currentError$ = this.currentErrorSubject.asObservable();

  /** Observable for modal state */
  readonly modalState$ = this.currentErrorSubject.asObservable();

  /** Check if modal is open */
  get isModalOpen(): boolean {
    return this.isOpen;
  }

  /** Get current error */
  getCurrentError(): ErrorInfo | null {
    return this.currentErrorSubject.value;
  }

  /** Open error modal */
  open(error: ErrorInfo): void {
    this.isOpen = true;
    this.currentErrorSubject.next(error);
  }

  /** Close error modal */
  close(): void {
    this.isOpen = false;
    this.currentErrorSubject.next(null);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AngularErrorHandler implements ErrorHandler {
  private handler: ErrorHandlerService | null = null;

  handleError(error: unknown): void {
    if (!this.handler) {
      this.handler = inject(ErrorHandlerService);
    }
    this.handler.handleError(error);
  }
}
