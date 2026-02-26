import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevToolsPanelComponent } from './shared/components/devtools-panel/devtools-panel.component';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { ErrorHandlerService } from './shared/services/error-handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ErrorModalComponent, DevToolsPanelComponent],
  template: `
    <router-outlet></router-outlet>
    <app-error-modal></app-error-modal>
    <app-devtools-panel></app-devtools-panel>
  `,
  styles: [
    `
    /* App container - full width */
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  private readonly errorHandler = inject(ErrorHandlerService);

  title = 'angular-rsbuild-demo';

  ngOnInit(): void {
    // Log app initialization
    this.errorHandler.info('Application initialized', {
      component: 'AppComponent',
    });
  }
}
