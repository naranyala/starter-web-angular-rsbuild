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
  styles: [
    `
    .home-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 80px 20px 40px;
      text-align: center;
    }

    .home-container h1 {
      font-size: 2.5rem;
      color: #1a1a2e;
      margin-bottom: 16px;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 40px;
      line-height: 1.6;
    }

    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(15, 52, 96, 0.2);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(15, 52, 96, 0.3);
    }
  `,
  ],
})
export class HomeComponent {}
