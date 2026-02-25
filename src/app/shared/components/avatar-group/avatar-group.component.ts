// src/app/shared/components/avatar-group/avatar-group.component.ts
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-avatar-group',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="avatar-group">
      <div class="avatar" *ngFor="let user of displayedUsers()" [attr.title]="user.name">
        <img [src]="user.avatarUrl" [alt]="user.name">
      </div>
      <div class="avatar overflow" *ngIf="remainingCount() > 0">
        <span>+{{ remainingCount() }}</span>
      </div>
    </div>
  `,
    styles: [`
    @use 'styles/variables' as var;
    @use 'styles/mixins' as mix;

    .avatar-group {
      display: flex;
      align-items: center;
      margin-left: 0.5rem;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: var.$radius-full;
      border: 2px solid var.$white;
      margin-left: -10px;
      overflow: hidden;
      background: var.$grey-100;
      @include mix.flex-center;
      position: relative;
      transition: var.$transition-base;

      &:first-child { margin-left: 0; }
      &:hover { z-index: 10; transform: translateY(-4px); }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.overflow {
        background: var.$grey-200;
        color: var.$grey-600;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: default;
        &:hover { transform: none; z-index: 1; }
      }
    }
  `]
})
export class AvatarGroupComponent {
    users = input.required<User[]>();
    maxDisplay = input<number>(4);

    displayedUsers = computed(() => this.users().slice(0, this.maxDisplay()));
    remainingCount = computed(() => Math.max(0, this.users().length - this.maxDisplay()));
}
