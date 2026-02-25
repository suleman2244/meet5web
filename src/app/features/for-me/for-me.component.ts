// src/app/features/for-me/for-me.component.ts
import { Component } from '@angular/core';
import { PlaceholderPageComponent } from '../../shared/components/placeholder-page/placeholder-page.component';

@Component({
    selector: 'app-for-me',
    standalone: true,
    imports: [PlaceholderPageComponent],
    template: `<app-placeholder-page title="For Me" />`
})
export class ForMeComponent { }
