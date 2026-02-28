/**
 * Integration Tests for Angular Application
 *
 * These tests verify that multiple components, services, and pipes work together correctly.
 */

import { beforeEach, describe, expect, test } from 'bun:test';
import { ApplicationRef, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { routes } from './app-routing.module';
import { DemoComponent } from './demo/demo.component';
import { HomeComponent } from './home/home.component';
import { DevToolsPanelComponent } from './shared/components/devtools-panel/devtools-panel.component';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { NumberFormatPipe, TitleCasePipe, TruncatePipe } from './shared/pipes/formatting.pipes';
import { DevToolsService } from './shared/services/devtools.service';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { ThemeService } from './shared/services/theme.service';

describe('Routing Integration', () => {
  test('should have routes configured', () => {
    expect(routes.length).toBeGreaterThan(0);
  });
});

describe('Component Integration with Pipes', () => {
  @Component({
    standalone: true,
    imports: [NumberFormatPipe, TruncatePipe, TitleCasePipe],
    template: `
      <div class="number">{{ value | numberFormat }}</div>
      <div class="truncated">{{ longText | truncate: 20 }}</div>
      <div class="title">{{ text | titleCase }}</div>
    `,
  })
  class PipeTestComponent {
    value = 1234567;
    longText = 'This is a very long text that should be truncated';
    text = 'hello world';
  }

  let fixture: ComponentFixture<PipeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipeTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PipeTestComponent);
    fixture.detectChanges();
  });

  test('should render formatted number', () => {
    const numberEl = fixture.debugElement.query(By.css('.number'));
    expect(numberEl.nativeElement.textContent).toBe('1,234,567');
  });

  test('should render truncated text', () => {
    const truncatedEl = fixture.debugElement.query(By.css('.truncated'));
    expect(truncatedEl.nativeElement.textContent).toBe('This is a very long ...');
  });

  test('should render title case text', () => {
    const titleEl = fixture.debugElement.query(By.css('.title'));
    expect(titleEl.nativeElement.textContent).toBe('Hello World');
  });
});

describe('Service Integration', () => {
  let themeService: ThemeService;

  beforeEach(() => {
    themeService = new ThemeService();
  });

  test('should create service', () => {
    expect(themeService).toBeTruthy();
  });

  test('should have default theme as Light', () => {
    expect(themeService.currentTheme().name).toBe('Light');
    expect(themeService.isDarkMode()).toBe(false);
  });

  test('should set theme and apply CSS variables', () => {
    themeService.setTheme('Ocean');

    expect(themeService.currentTheme().name).toBe('Ocean');

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--theme-primary')).toBe('#0077b6');
    expect(root.style.getPropertyValue('--theme-secondary')).toBe('#00b4d8');
  });

  test('should toggle dark mode', () => {
    expect(themeService.isDarkMode()).toBe(false);

    themeService.toggleDarkMode();
    expect(themeService.isDarkMode()).toBe(true);

    themeService.toggleDarkMode();
    expect(themeService.isDarkMode()).toBe(false);
  });

  test('should cycle through themes', () => {
    expect(themeService.currentTheme().name).toBe('Light');

    themeService.nextTheme();
    expect(themeService.currentTheme().name).toBe('Dark');

    themeService.nextTheme();
    expect(themeService.currentTheme().name).toBe('Ocean');
  });
});

describe('Full Application Flow', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        AppComponent,
        HomeComponent,
        DemoComponent,
        ErrorModalComponent,
        DevToolsPanelComponent,
      ],
      providers: [
        ThemeService,
        ErrorHandlerService,
        DevToolsService,
        { provide: ApplicationRef, useValue: { _views: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges(false);
    fixture.detectChanges();
  });

  test('should render app component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  test('should have router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});
