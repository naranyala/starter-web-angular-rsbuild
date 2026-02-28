import { beforeEach, describe, expect, test } from 'bun:test';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DemoComponent } from './demo.component';

describe('DemoComponent', () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize with empty search query', () => {
    expect(component.searchQuery).toBe('');
  });

  test('should have 6 cards by default', () => {
    expect(component.cards.length).toBe(6);
  });

  test('should return all cards when search query is empty', () => {
    component.searchQuery = '';
    expect(component.filteredCards.length).toBe(6);
  });

  test('should return all cards when search query is whitespace', () => {
    component.searchQuery = '   ';
    expect(component.filteredCards.length).toBe(6);
  });

  test('should filter cards by title', () => {
    component.searchQuery = 'Angular';
    const filtered = component.filteredCards;

    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Angular');
  });

  test('should filter cards by description', () => {
    component.searchQuery = 'runtime';
    const filtered = component.filteredCards;

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered.some(c => c.title === 'Bun')).toBe(true);
  });

  test('should be case insensitive when filtering', () => {
    component.searchQuery = 'angular';
    expect(component.filteredCards.length).toBe(1);

    component.searchQuery = 'ANGULAR';
    expect(component.filteredCards.length).toBe(1);
  });

  test('should show no results message when no matches', () => {
    component.searchQuery = 'nonexistent';
    expect(component.filteredCards.length).toBe(0);
  });

  test('should render search input', () => {
    const searchInput = fixture.debugElement.query(By.css('.search-input'));
    expect(searchInput).toBeTruthy();
  });

  test('should render cards grid', () => {
    const cardsGrid = fixture.debugElement.query(By.css('.cards-grid'));
    expect(cardsGrid).toBeTruthy();
  });

  test('should render all cards initially', () => {
    const cards = fixture.debugElement.queryAll(By.css('.card'));
    expect(cards.length).toBe(6);
  });

  test('should update filtered cards when search query changes', () => {
    component.searchQuery = 'TypeScript';
    fixture.detectChanges();

    // TypeScript and esbuild both contain "script" in their descriptions
    expect(component.filteredCards.length).toBeGreaterThanOrEqual(1);

    const cards = fixture.debugElement.queryAll(By.css('.card'));
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  test('should show no results message when filtering returns empty', () => {
    component.searchQuery = 'xyz123';
    fixture.detectChanges();

    const noResults = fixture.debugElement.query(By.css('.no-results'));
    expect(noResults).toBeTruthy();
    expect(noResults.nativeElement.textContent).toContain('No results found');
  });

  test('should have correct card structure', () => {
    const card = component.cards[0];

    expect(card).toHaveProperty('title');
    expect(card).toHaveProperty('description');
    expect(card).toHaveProperty('icon');
    expect(card).toHaveProperty('color');
    expect(card).toHaveProperty('codeMockup');
    expect(card).toHaveProperty('link');
  });

  test('should handle special characters in search', () => {
    component.searchQuery = 'C#';
    expect(component.filteredCards.length).toBe(0);
  });

  test('should filter by partial match', () => {
    component.searchQuery = 'Ang';
    expect(component.filteredCards.length).toBeGreaterThanOrEqual(1);

    component.searchQuery = 'Script';
    expect(component.filteredCards.length).toBeGreaterThanOrEqual(1);
  });

  test('should have unique card titles', () => {
    const titles = component.cards.map(c => c.title);
    const uniqueTitles = new Set(titles);

    expect(titles.length).toBe(uniqueTitles.size);
  });

  test('openCard should handle missing WinBox gracefully', () => {
    const originalWinBox = (window as any).WinBox;
    (window as any).WinBox = undefined;

    let errorLogged = false;
    const originalError = console.error;
    console.error = () => {
      errorLogged = true;
    };

    component.openCard(component.cards[0]);

    console.error = originalError;
    expect(errorLogged).toBe(true);

    (window as any).WinBox = originalWinBox;
  });
});
