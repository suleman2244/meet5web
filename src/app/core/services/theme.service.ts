// src/app/core/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'meet5-theme';

    theme = signal<Theme>(this.getInitialTheme());

    constructor() {
        // Sync theme to body class automatically
        effect(() => {
            const current = this.theme();
            localStorage.setItem(this.THEME_KEY, current);

            if (current === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    private getInitialTheme(): Theme {
        const saved = localStorage.getItem(this.THEME_KEY) as Theme;
        if (saved) return saved;

        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
