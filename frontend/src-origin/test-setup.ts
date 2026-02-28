// Test setup file for Bun test runner
// Initializes Angular testing environment with jsdom

import { JSDOM } from 'jsdom';
import 'zone.js';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Setup jsdom for DOM support in Node.js environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.MouseEvent = dom.window.MouseEvent;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

// Reset TestBed after each test to avoid state leakage (Bun test only)
declare const afterEach: (fn: () => void) => void;
if (typeof afterEach !== 'undefined') {
  afterEach(() => {
    TestBed.resetTestingModule();
  });
}
