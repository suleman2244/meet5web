// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ForMeComponent } from './features/for-me/for-me.component';
import { DiscoverComponent } from './features/discover/discover.component';
import { ChatsComponent } from './features/chats/chats.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'activities', pathMatch: 'full' },
            {
                path: 'activities',
                loadComponent: () => import('./features/activities/pages/activity-list/activity-list.component')
                    .then(m => m.ActivityListComponent)
            },
            {
                path: 'activities/create',
                loadComponent: () => import('./features/activities/pages/create-activity/create-activity.component')
                    .then(m => m.CreateActivityComponent)
            },
            {
                path: 'activities/:id',
                loadComponent: () => import('./features/activities/pages/activity-detail/activity-detail.component')
                    .then(m => m.ActivityDetailComponent)
            },
            { path: 'for-me', component: ForMeComponent },
            { path: 'discover', component: DiscoverComponent },
            { path: 'chats', component: ChatsComponent },
            { path: 'profile', component: ProfileComponent },
        ]
    }
];
