// src/app/layout/layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CreateActivityDialogComponent } from '../features/activities/components/create-activity-dialog/create-activity-dialog.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopBarComponent, CreateActivityDialogComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <main class="main-content">
        <div class="top-bar-container">
          <app-top-bar />
        </div>
        <div class="page-container">
          <router-outlet />
        </div>
      </main>
    </div>

    <!-- Global dialog: rendered at the root level so it overlays everything -->
    <app-create-activity-dialog />
  `,
  styles: [`
    @use 'styles/variables' as var;
    @use 'styles/mixins' as mix;

    .app-shell {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
      transition: var.$transition-smooth;

      @include mix.tablet {
        margin-left: 80px;
      }

      @include mix.mobile {
        margin-left: 0;
        margin-bottom: 80px; // Clear space for bottom navigation
      }
    }

    .page-container, .top-bar-container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .top-bar-container {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--surface);
      border-bottom: 1px solid var(--border-color);
      padding: 0 var.$space-md;
    }

    .page-container {
      padding: var.$space-xl var.$space-md;

      @include mix.mobile {
        padding: var.$space-md;
      }
    }
  `]
})
export class LayoutComponent { }
