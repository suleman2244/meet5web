// src/app/features/profile/profile.component.ts
import { Component } from '@angular/core';
import { PlaceholderPageComponent } from '../../shared/components/placeholder-page/placeholder-page.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [PlaceholderPageComponent],
    template: `<app-placeholder-page title="My Profile" />`
})
export class ProfileComponent { }
