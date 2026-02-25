// src/app/features/discover/discover.component.ts
import { Component } from '@angular/core';
import { PlaceholderPageComponent } from '../../shared/components/placeholder-page/placeholder-page.component';

@Component({
    selector: 'app-discover',
    standalone: true,
    imports: [PlaceholderPageComponent],
    template: `<app-placeholder-page title="Discover" />`
})
export class DiscoverComponent { }
