import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivityService } from '../../../../core/services/activity.service';
import { Activity, ActivityCategory } from '../../../../core/models/activity.model';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-activity-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe, TranslateModule],
    templateUrl: './activity-detail.component.html',
    styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent {
    private route = inject(ActivatedRoute);
    private activityService = inject(ActivityService);
    private sanitizer = inject(DomSanitizer);

    activityId = this.route.snapshot.params['id'];

    activity = this.activityService.getById(this.activityId);


    get act(): Activity | undefined { return this.activity(); }

    join(): void { this.activityService.join(this.activityId); }
    leave() {
        this.activityService.leave(this.activity()!.id);
    }

    getCategoryKey(value: string): string | undefined {
        return Object.entries(ActivityCategory).find(([k, v]) => v === value)?.[0];
    }


    gridCols(max: number): number {
        if (max <= 4) return 2;
        if (max <= 9) return 3;
        return 4;
    }


    emptySlots(act: Activity): number[] {
        const filled = act.participants.length;
        const total = act.maxParticipants;
        const cols = this.gridCols(total);

        const rows = Math.ceil(total / cols);
        const totalDisplay = rows * cols;
        const empty = totalDisplay - filled;
        return Array(Math.max(0, empty)).fill(0);
    }


    mapUrl(lat: number | undefined, lon: number | undefined): SafeResourceUrl {
        if (lat === undefined || lon === undefined) return '';
        const delta = 0.02;
        const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
        const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

