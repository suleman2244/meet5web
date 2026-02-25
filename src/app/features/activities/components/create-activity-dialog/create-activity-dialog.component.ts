// src/app/features/activities/components/create-activity-dialog/create-activity-dialog.component.ts
import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DialogService } from '../../../../core/services/dialog.service';
import { ActivityService } from '../../../../core/services/activity.service';
import { GeolocationService } from '../../../../core/services/geolocation.service';
import { LocationSearchService, LocationResult } from '../../../../core/services/location-search.service';
import { Activity, ActivityCategory } from '../../../../core/models/activity.model';

import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-create-activity-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './create-activity-dialog.component.html',
    styleUrls: ['./create-activity-dialog.component.scss']
})
export class CreateActivityDialogComponent implements OnDestroy {
    readonly dialogService = inject(DialogService);
    private activityService = inject(ActivityService);
    private fb = inject(FormBuilder);
    readonly geo = inject(GeolocationService);
    private locSearch = inject(LocationSearchService);

    sizes = [4, 6, 8, 10, 12];
    categories = Object.entries(ActivityCategory);

    // Location autocomplete state
    locationResults = signal<LocationResult[]>([]);
    locationLoading = signal(false);
    locationError = signal<string | null>(null);
    selectedLocation = signal<LocationResult | null>(null);
    showDropdown = signal(false);

    minDate = signal<string>(this.getLocalISODate());
    minTime = signal<string>('00:00');

    private getLocalISODate(): string {
        const now = new Date();
        return now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
    }

    form: FormGroup = this.fb.group({
        size: [6, [Validators.required, Validators.min(4)]],
        description: [''],
        date: [this.minDate(), Validators.required],
        time: ['', Validators.required],
        category: [ActivityCategory.SOCIAL, Validators.required],
        locationText: ['', Validators.required],
        isInviteOnly: [false],
        isMenOnly: [false],
        hasAgeRange: [false]
    }, { validators: this.dateTimeValidator.bind(this) });

    /** Update time constraint based on date selection */
    private timeEffect = effect(() => {
        const date = this.form.get('date')?.value;
        const today = new Date().toISOString().split('T')[0];

        if (date === today) {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            this.minTime.set(`${hh}:${mm}`);
        } else {
            this.minTime.set('00:00');
        }
    }, { allowSignalWrites: true });

    private dateTimeValidator(group: FormGroup): { [key: string]: boolean } | null {
        const date = group.get('date')?.value;
        const time = group.get('time')?.value;
        if (!date || !time) return null;

        const now = new Date();
        const selected = new Date(`${date}T${time}`);

        return selected < now ? { pastDateTime: true } : null;
    }

    /** Watch form control value changes to trigger location search (works with all input methods) */
    private locSub: Subscription = this.form.get('locationText')!.valueChanges.pipe(
        debounceTime(350),
        distinctUntilChanged()
    ).subscribe(q => this.onQueryChange(q));

    /** Auto-trigger location detection whenever the dialog opens */
    private openEffect = effect(() => {
        if (this.dialogService.isOpen()) {
            this.initLocation();
        }
    });

    /** Request device position, then load top 10 nearby places */
    async initLocation(): Promise<void> {
        this.locationLoading.set(true);
        this.locationError.set(null);
        try {
            const coords = await this.geo.requestPosition();
            const nearby = await this.locSearch.searchNearby(coords, 10);
            this.locationResults.set(nearby);
            this.showDropdown.set(nearby.length > 0);
        } catch {
            this.locationError.set('Could not detect location. Type to search manually.');
        } finally {
            this.locationLoading.set(false);
        }
    }

    private async onQueryChange(q: string): Promise<void> {
        this.selectedLocation.set(null);
        if (!q || q.length < 2) {
            this.showDropdown.set(false);
            this.locationResults.set([]);
            return;
        }
        this.locationLoading.set(true);
        try {
            const results = await this.locSearch.searchByText(q, this.geo.coords(), 10);
            this.locationResults.set(results);
            this.showDropdown.set(results.length > 0);
        } finally {
            this.locationLoading.set(false);
        }
    }

    showNearby(): void {
        if (this.locationResults().length > 0) {
            this.showDropdown.set(true);
        }
    }

    selectLocation(loc: LocationResult): void {
        this.selectedLocation.set(loc);
        const name = loc.shortName || loc.displayName.split(',')[0];
        this.form.get('locationText')?.setValue(name, { emitEvent: false });
        this.showDropdown.set(false);
    }

    hideDropdown(): void {
        setTimeout(() => this.showDropdown.set(false), 200);
    }

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
    }

    onBackdropClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) this.close();
    }

    close(): void {
        this.dialogService.close();
        this.form.reset({ size: 6, isInviteOnly: false, isMenOnly: false, hasAgeRange: false });
        this.locationResults.set([]);
        this.selectedLocation.set(null);
        this.showDropdown.set(false);
        this.locationError.set(null);
    }

    onSubmit(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }

        const v = this.form.value;
        const loc = this.selectedLocation();
        const maxP: number = +v.size;

        const newActivity: Activity = {
            id: `a${Date.now()}`,
            title: v.category,
            description: v.description?.trim() || '',
            category: v.category,
            imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
            date: new Date(`${v.date}T${v.time}`),
            time: v.time,
            location: {
                name: loc?.shortName || v.locationText,
                city: loc ? this.extractCity(loc.displayName) : '',
                address: loc?.displayName || v.locationText
            },
            lat: loc?.lat,
            lon: loc?.lon,
            maxParticipants: maxP,
            currentParticipants: 1,
            participants: [{ id: 'me', name: 'You', age: 30, avatarUrl: 'https://i.pravatar.cc/150?u=you', isVerified: true }],
            organizer: { id: 'me', name: 'You', age: 30, avatarUrl: 'https://i.pravatar.cc/150?u=you', isVerified: true },
            tags: [],
            isFull: maxP === 1,
            isJoined: true,
            isInviteOnly: v.isInviteOnly,
            isMenOnly: v.isMenOnly,
            ageRange: v.hasAgeRange ? 'Standard' : undefined
        };

        this.activityService.add(newActivity);
        this.close();
    }

    private extractCity(displayName: string): string {
        const parts = displayName.split(',');
        return parts.find(p => p.trim().length > 1)?.trim() ?? parts[0] ?? '';
    }

    ngOnDestroy(): void {
        this.locSub.unsubscribe();
        this.openEffect.destroy();
    }
}
