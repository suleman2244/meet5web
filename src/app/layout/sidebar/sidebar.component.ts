import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    navItems = [
        { path: '/activities', label: 'NAV.ACTIVITIES', icon: '🎯' },
        { path: '/for-me', label: 'NAV.FOR_YOU', icon: '⭐' },
        { path: '/discover', label: 'NAV.MEMBERS', icon: '👥' },
        { path: '/chats', label: 'NAV.CHAT', icon: '💬' },
        { path: '/profile', label: 'NAV.PROFILE', icon: '👤' },
    ];
}
