import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { WindowTabsComponent } from './shared/components/window-tabs/window-tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DemoComponent, WindowTabsComponent],
  template: `
    <app-window-tabs></app-window-tabs>
    <app-demo></app-demo>
  `,
  styles: [
    `
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f5f5;
    }
  `,
  ],
})
export class AppComponent {}

// Force refresh
