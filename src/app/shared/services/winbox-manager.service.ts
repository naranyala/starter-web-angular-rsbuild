import { Injectable, signal, type Signal } from '@angular/core';

export interface WindowInfo {
  id: string;
  title: string;
  color: string;
  icon?: string;
  instance: any; // WinBoxInstance
  minimized: boolean;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class WinBoxManagerService {
  private readonly windows = signal<WindowInfo[]>([]);
  readonly windowsList: Signal<WindowInfo[]> = this.windows.asReadonly();

  // Top panel height for maximizing windows
  readonly topPanelHeight = 88; // Height of two-row panel (44px + 44px)

  constructor() {
    // Handle window resize to update all windows
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.onWindowResize());
    }
  }

  private onWindowResize(): void {
    const windows = this.windows();
    const top = this.topPanelHeight;
    const width = window.innerWidth;
    const height = window.innerHeight - top;

    windows.forEach(win => {
      if (win.instance && !win.minimized) {
        win.instance.resize(width, height);
        win.instance.move(0, top);
      }
    });
  }

  private generateId(): string {
    return `winbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  registerWindow(options: {
    title: string;
    color: string;
    instance: any;
    icon?: string;
  }): string {
    const id = this.generateId();
    const windowInfo: WindowInfo = {
      id,
      title: options.title,
      color: options.color,
      icon: options.icon,
      instance: options.instance,
      minimized: false,
      timestamp: Date.now(),
    };

    this.windows.update(windows => [...windows, windowInfo]);

    // Set up event handlers
    options.instance.onminimize = () => {
      this.minimizeWindow(id);
    };

    options.instance.onfocus = () => {
      this.focusWindow(id);
    };

    options.instance.onclose = () => {
      this.closeWindow(id);
    };

    return id;
  }

  createMaximizedWindow(options: {
    title: string;
    color: string;
    icon?: string;
    html: string;
    onfocus?: (this: any) => void;
  }): { id: string; instance: any } {
    if (!window.WinBox) {
      console.error('WinBox is not available');
      return { id: '', instance: null };
    }

    // Calculate dimensions respecting two-row top panel with zero margin
    const top = this.topPanelHeight;
    const width = window.innerWidth;
    const height = window.innerHeight - top;

    const _win = new window.WinBox({
      title: options.title,
      background: options.color,
      width: width + 'px',
      height: height + 'px',
      x: 0,
      y: top,
      html: options.html,
      onfocus: options.onfocus,
      // Remove default WinBox styling for zero margin look
      class: 'winbox-fullscreen',
    });

    // Force remove any margin/padding from WinBox window
    _win.body.style.margin = '0';
    _win.body.style.padding = '0';

    const id = this.registerWindow({
      title: options.title,
      color: options.color,
      instance: _win,
      icon: options.icon,
    });

    return { id, instance: _win };
  }

  focusWindow(id: string): void {
    const windowInfo = this.windows().find(w => w.id === id);
    if (windowInfo) {
      windowInfo.instance.focus();
      windowInfo.instance.show();
      windowInfo.minimized = false;

      this.windows.update(windows =>
        windows.map(w => (w.id === id ? { ...w, minimized: false } : w))
      );
    }
  }

  minimizeWindow(id: string): void {
    const windowInfo = this.windows().find(w => w.id === id);
    if (windowInfo) {
      windowInfo.instance.hide();
      windowInfo.minimized = true;

      this.windows.update(windows =>
        windows.map(w => (w.id === id ? { ...w, minimized: true } : w))
      );
    }
  }

  restoreWindow(id: string): void {
    const windowInfo = this.windows().find(w => w.id === id);
    if (windowInfo) {
      windowInfo.instance.show();
      windowInfo.instance.focus();
      windowInfo.minimized = false;

      this.windows.update(windows =>
        windows.map(w => (w.id === id ? { ...w, minimized: false } : w))
      );
    }
  }

  maximizeWindow(id: string): void {
    const windowInfo = this.windows().find(w => w.id === id);
    if (windowInfo) {
      windowInfo.instance.show();
      windowInfo.instance.focus();
      windowInfo.instance.maximize();
      windowInfo.minimized = false;

      this.windows.update(windows =>
        windows.map(w => (w.id === id ? { ...w, minimized: false } : w))
      );
    }
  }

  closeWindow(id: string): void {
    this.windows.update(windows => windows.filter(w => w.id !== id));
  }

  closeAll(): void {
    const windows = this.windows();
    windows.forEach(win => {
      try {
        win.instance.close();
      } catch (e) {
        console.error('Error closing window:', e);
      }
    });
    this.windows.set([]);
  }

  minimizeAll(): void {
    const windows = this.windows();
    windows.forEach(win => {
      this.minimizeWindow(win.id);
    });
  }

  getWindowCount(): number {
    return this.windows().length;
  }

  getMinimizedCount(): number {
    return this.windows().filter(w => w.minimized).length;
  }

  hideAll(): void {
    const windows = this.windows();
    windows.forEach(win => {
      win.instance.hide();
      win.minimized = true;
    });
    this.windows.update(windowsList =>
      windowsList.map(w => ({ ...w, minimized: true }))
    );
  }

  showAll(): void {
    const windows = this.windows();
    windows.forEach(win => {
      win.instance.show();
      win.minimized = false;
    });
    this.windows.update(windowsList =>
      windowsList.map(w => ({ ...w, minimized: false }))
    );
  }

  getTopPanelHeight(): number {
    return this.topPanelHeight;
  }
}
