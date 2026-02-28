/**
 * Testing Utilities for Angular + Bun Test
 *
 * Provides helper functions and mock providers for testing Angular applications
 */

import { DebugElement } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Finds an element by CSS selector in a component fixture
 */
export function findElement<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

/**
 * Finds all elements by CSS selector in a component fixture
 */
export function findElements<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

/**
 * Finds an element by directive in a component fixture
 */
export function findElementByDirective<T>(
  fixture: ComponentFixture<T>,
  directive: any
): DebugElement {
  return fixture.debugElement.query(By.directive(directive));
}

/**
 * Clicks an element and triggers change detection
 */
export function clickElement<T>(
  fixture: ComponentFixture<T>,
  element: DebugElement | HTMLElement
): void {
  const nativeElement = element instanceof DebugElement ? element.nativeElement : element;
  nativeElement.click();
  fixture.detectChanges();
}

/**
 * Sets the value of an input element and triggers input event
 */
export function setInputValue<T>(
  fixture: ComponentFixture<T>,
  element: DebugElement | HTMLElement,
  value: string
): void {
  const nativeElement = element instanceof DebugElement ? element.nativeElement : element;
  nativeElement.value = value;
  nativeElement.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

/**
 * Waits for async operations to complete
 */
export async function tick(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a mock object with partial implementation
 */
export function createMock<T>(overrides: Partial<T>): T {
  return overrides as T;
}

/**
 * Spy factory for creating mock functions
 */
export function createSpy<T extends (...args: any[]) => any>(_name: string, impl?: T): T {
  return (impl || (() => {})) as T;
}

/**
 * Mock for ActivatedRoute
 */
export class MockActivatedRoute {
  snapshot = {
    params: {},
    queryParams: {},
    data: {},
    url: [],
  };
  params = { subscribe: (fn: any) => fn({}) };
  queryParams = { subscribe: (fn: any) => fn({}) };
  data = { subscribe: (fn: any) => fn({}) };
  url = { subscribe: (fn: any) => fn([]) };

  setParams(params: any): void {
    this.snapshot.params = params;
  }

  setQueryParams(queryParams: any): void {
    this.snapshot.queryParams = queryParams;
  }
}

/**
 * Mock for Router
 */
export class MockRouter {
  url = '';
  navigate = createMock<(...args: any[]) => Promise<boolean>>(() => Promise.resolve(true));
  navigateByUrl = createMock<(...args: any[]) => Promise<boolean>>(() => Promise.resolve(true));
  createUrlTree = createMock<(...args: any[]) => any>(() => {});
  serialize = createMock<(...args: any[]) => string>(() => '');

  reset(): void {
    this.url = '';
  }
}

/**
 * Base test module configuration helper
 */
export interface TestModuleConfig {
  declarations?: any[];
  imports?: any[];
  providers?: any[];
  schemas?: any[];
}

/**
 * Configures TestBed with default settings
 */
export function configureTestBed(config: TestModuleConfig): void {
  TestBed.configureTestingModule({
    declarations: config.declarations || [],
    imports: config.imports || [],
    providers: config.providers || [],
    schemas: config.schemas || [],
  });
}
