import { beforeEach, describe, expect, test } from 'bun:test';
import { ApplicationRef } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DevToolsPanelComponent } from './shared/components/devtools-panel/devtools-panel.component';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { DevToolsService } from './shared/services/devtools.service';
import { ErrorHandlerService } from './shared/services/error-handler.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent, ErrorModalComponent, DevToolsPanelComponent],
      providers: [
        ErrorHandlerService,
        DevToolsService,
        { provide: ApplicationRef, useValue: { _views: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // Skip initial detection for tests
    fixture.autoDetectChanges(false);
    fixture.detectChanges();
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  test(`should have as title 'angular-rsbuild-demo'`, () => {
    expect(component.title).toBe('angular-rsbuild-demo');
  });

  test('should render router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  test('should have host element', () => {
    const hostElement = fixture.debugElement.nativeElement;
    expect(hostElement).toBeTruthy();
  });

  test('should have min-height style on host', () => {
    const hostElement = fixture.debugElement.nativeElement;
    const styles = window.getComputedStyle(hostElement);
    expect(styles.minHeight).toBe('100vh');
  });

  test('should have display block on host', () => {
    const hostElement = fixture.debugElement.nativeElement;
    const styles = window.getComputedStyle(hostElement);
    expect(styles.display).toBe('block');
  });

  test('should be standalone component', () => {
    expect((AppComponent as any).ɵcmp?.standalone).toBe(true);
  });

  test('should have correct selector', () => {
    expect((AppComponent as any).ɵcmp?.selectors?.[0]?.[0]).toBe('app-root');
  });

  test('should have template defined', () => {
    const cmp = AppComponent as any;
    expect(cmp.ɵcmp).toBeDefined();
  });
});
