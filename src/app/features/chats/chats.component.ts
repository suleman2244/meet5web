// src/app/features/chats/chats.component.ts
import { Component } from '@angular/core';
import { PlaceholderPageComponent } from '../../shared/components/placeholder-page/placeholder-page.component';

@Component({
    selector: 'app-chats',
    standalone: true,
    imports: [PlaceholderPageComponent],
    template: `<app-placeholder-page title="Chats" />`
})
export class ChatsComponent { }
