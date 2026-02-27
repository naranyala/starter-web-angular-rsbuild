import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

// Import Prism.js for syntax highlighting
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

// Make Prism available globally for inline onclick handlers
(window as any).Prism = Prism;

bootstrapApplication(AppComponent, {
  providers: [provideAnimations()],
}).catch(err => console.error(err));
