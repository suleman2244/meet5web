import { Component, inject } from '@angular/core';
import { DialogService } from '../../core/services/dialog.service';
import { LocationSearchService } from '../../core/services/location-search.service';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  template: `
    <header class="top-bar">
      <div class="title-area">
        <h1 class="city-header">{{ 'TOPBAR.NEAR_YOU' | translate:{ city: location.currentCity() } }}</h1>
      </div>
      <div class="actions">
        <!-- 🌍 Language Selector -->
        <div class="lang-selector">
          <select [ngModel]="translate.currentLang" (ngModelChange)="switchLang($event)" aria-label="Select Language">
            <option value="en">🇺🇸 EN</option>
            <option value="de">🇩🇪 DE</option>
            <option value="fr">🇫🇷 FR</option>
          </select>
        </div>

        <!-- 🌙 theme toggle -->
        <button class="theme-btn" (click)="toggleTheme()" 
                [attr.title]="(theme.theme() === 'light' ? 'TOPBAR.THEME_DARK' : 'TOPBAR.THEME_LIGHT') | translate">
          {{ theme.theme() === 'light' ? '🌙' : '☀️' }}
        </button>

        <button class="create-btn" (click)="dialog.open()">
          <span>+</span> {{ 'TOPBAR.CREATE' | translate }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    @use 'styles/variables' as var;
    @use 'styles/mixins' as mix;

    .top-bar {
      height: 64px;
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .title-area {
      .city-header {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-main); 
        margin: 0;
        letter-spacing: -0.5px;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;

      .theme-btn {
        background: none;
        border: 1px solid var(--border-color);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-main);
        transition: all 0.2s;
        &:hover {
          background: var(--background);
          border-color: var.$primary;
        }
      }

      .lang-selector {
        select {
          background: var(--input-bg);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
          &:hover, &:focus {
            border-color: var.$primary;
          }
        }
      }

      .create-btn {
        background: var.$primary;
        color: #fff;
        border: none;
        border-radius: 50px;
        padding: 10px 22px;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.2s;
        box-shadow: 0 4px 12px rgba(240, 100, 90, 0.2);
        &:hover { opacity: 0.85; }
      }
    }
  `]
})
export class TopBarComponent {
  readonly dialog = inject(DialogService);
  readonly location = inject(LocationSearchService);
  readonly theme = inject(ThemeService);
  readonly translate = inject(TranslateService);

  constructor() {
    // Initialize translations
    const savedLang = localStorage.getItem('app-lang') || 'en';
    this.translate.addLangs(['en', 'de', 'fr']);
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('app-lang', lang);
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }
}
