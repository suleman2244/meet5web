
import { Component, computed, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Activity, ActivityCategory } from '../../../../core/models/activity.model';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../../core/models/user.model';

interface Slot {
    user: User | null;
}

@Component({
    selector: 'app-activity-card',
    standalone: true,
    imports: [CommonModule, DatePipe, TranslateModule],
    templateUrl: './activity-card.component.html',
    styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent {
    activity = input.required<Activity>();
    cardClick = output<string>();


    gridCols = computed<number>(() => {
        const max = this.activity().maxParticipants;
        if (max <= 6) return max;
        if (max === 8) return 4;
        if (max === 10) return 5;
        if (max === 12) return 6;
        return 6;
    });


    slots = computed<Slot[]>(() => {
        const act = this.activity();
        const max = act.maxParticipants;
        const participants = act.participants;

        const result: Slot[] = [];

        // Show participants joined so far
        for (let i = 0; i < Math.min(participants.length, max); i++) {
            result.push({ user: participants[i] });
        }

        // Fill remaining empty slots up to the activity limit
        for (let i = result.length; i < max; i++) {
            result.push({ user: null });
        }

        return result;
    });

    onCardClick() {
        this.cardClick.emit(this.activity().id);
    }

    getCategoryKey(value: string): string | undefined {
        return Object.entries(ActivityCategory).find(([k, v]) => v === value)?.[0];
    }
}
