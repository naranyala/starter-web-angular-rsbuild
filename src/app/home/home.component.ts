import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <h1>Angular Rsbuild Demo</h1>
      <p class="subtitle">A minimal Angular 21 application bundled with Rsbuild</p>
      <a routerLink="/demo" class="btn">View Demo →</a>
    </div>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {}
