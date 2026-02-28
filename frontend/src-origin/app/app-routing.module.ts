import type { Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];
