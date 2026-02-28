import { Component, inject, type OnInit } from '@angular/core';
import { DemoComponent } from './demo/demo.component';
import { WindowTabsComponent } from './shared/components/window-tabs/window-tabs.component';
import { WinBoxManagerService } from './shared/services/winbox-manager.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DemoComponent, WindowTabsComponent],
  template: `
    <app-window-tabs></app-window-tabs>
    <app-demo></app-demo>
  `,
})
export class AppComponent implements OnInit {
  private readonly winBoxManager = inject(WinBoxManagerService);

  ngOnInit(): void {
    (window as any).__winBoxManager = this.winBoxManager;
  }
}
