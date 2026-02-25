// src/app/shared/components/placeholder-page/placeholder-page.component.ts
import { Component, input } from '@angular/core';

@Component({
    selector: 'app-placeholder-page',
    standalone: true,
    template: `
    <div class="placeholder-container">
      <div class="content">
        <h1>{{ title() }}</h1>
        <p>This page is currently under development. Stay tuned!</p>
        <div class="illustration">🏗️</div>
      </div>
    </div>
  `,
    styles: [`
    .placeholder-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70vh;
      text-align: center;
    }
    .content {
      padding: 3rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    h1 { margin-bottom: 1rem; color: #1a1a1a; }
    p { color: #6b7280; font-size: 1.1rem; }
    .illustration { font-size: 5rem; margin-top: 2rem; }
  `]
})
export class PlaceholderPageComponent {
    title = input.required<string>();
}
