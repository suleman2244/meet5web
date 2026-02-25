// src/app/core/services/activity.service.ts
// The single source of truth for activities.
// Architecture: service-layer abstraction so localStorage can be swapped for HTTP later.
import { Injectable, signal, Signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Activity, ActivityCategory } from '../models/activity.model';

const STORAGE_KEY = 'meet5_activities';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private storage = inject(StorageService);
    private _activities = signal<Activity[]>([]);

    /** Public reactive read-only signal consumed by components */
    readonly activities = this._activities.asReadonly();

    constructor() {
        this.load();
    }

    // ─── Private helpers ────────────────────────────────────────────────────

    private load(): void {
        const stored = this.storage.getItem<Activity[]>(STORAGE_KEY);
        if (stored && stored.length > 0) {
            this._activities.set(stored.map(a => ({ ...a, date: new Date(a.date) })));
        }
        // No dummy fallback — starts empty until user creates something
    }

    private save(): void {
        this.storage.setItem(STORAGE_KEY, this._activities());
    }

    // ─── Public API ─────────────────────────────────────────────────────────

    getById(id: string): Signal<Activity | undefined> {
        return computed(() => this._activities().find(a => a.id === id));
    }

    add(activity: Activity): void {
        this._activities.update(list => [...list, activity]);
        this.save();
    }

    join(id: string): void {
        this._activities.update(list =>
            list.map(a => {
                if (a.id === id && !a.isJoined && !a.isFull) {
                    const next = a.currentParticipants + 1;
                    return { ...a, isJoined: true, currentParticipants: next, isFull: next >= a.maxParticipants };
                }
                return a;
            })
        );
        this.save();
    }

    leave(id: string): void {
        this._activities.update(list =>
            list.map(a => a.id === id && a.isJoined
                ? { ...a, isJoined: false, currentParticipants: a.currentParticipants - 1, isFull: false }
                : a
            )
        );
        this.save();
    }

    remove(id: string): void {
        this._activities.update(list => list.filter(a => a.id !== id));
        this.save();
    }
}
