import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DemoComponent } from './demo/demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DemoComponent],
  template: `
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
