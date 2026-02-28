import { beforeEach, describe, expect, test } from 'bun:test';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should render container', () => {
    const container = fixture.debugElement.query(By.css('.home-container'));
    expect(container).toBeTruthy();
  });

  test('should render heading', () => {
    const heading = fixture.debugElement.query(By.css('h1'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toContain('Angular Rsbuild Demo');
  });

  test('should render subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.subtitle'));
    expect(subtitle).toBeTruthy();
    expect(subtitle.nativeElement.textContent).toContain('minimal Angular 21 application');
  });

  test('should render link button', () => {
    const button = fixture.debugElement.query(By.css('.btn'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain('View Accordion Demo');
  });

  test('should have routerLink on button', () => {
    const button = fixture.debugElement.query(By.css('.btn'));
    // In Angular 21, check for href attribute or routerLink directive
    const href = button.attributes.href;
    const routerLink = button.attributes.routerlink;
    const ngReflect = button.attributes['ng-reflect-router-link'];

    // At least one should be present and point to /demo
    expect(href || routerLink || ngReflect).toBeTruthy();
    if (href) {
      expect(href).toBe('/demo');
    } else if (routerLink) {
      expect(routerLink).toBe('/demo');
    } else {
      expect(ngReflect).toBe('/demo');
    }
  });

  test('should have correct styling classes', () => {
    const container = fixture.debugElement.query(By.css('.home-container'));
    expect(container.classes['home-container']).toBe(true);
  });

  test('should center text', () => {
    const container = fixture.debugElement.query(By.css('.home-container'));
    const styles = window.getComputedStyle(container.nativeElement);
    expect(styles.textAlign).toBe('center');
  });
});
