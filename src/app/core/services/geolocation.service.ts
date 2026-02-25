// src/app/core/services/geolocation.service.ts
import { Injectable, signal } from '@angular/core';

export interface Coords {
    lat: number;
    lon: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
    readonly coords = signal<Coords | null>(null);
    readonly error = signal<string | null>(null);
    readonly loading = signal(false);

    /** Request device position. Works over HTTPS or localhost. */
    requestPosition(): Promise<Coords> {
        return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
                const msg = 'Geolocation not supported';
                this.error.set(msg);
                reject(msg);
                return;
            }
            this.loading.set(true);
            this.error.set(null);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords: Coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                    this.coords.set(coords);
                    this.loading.set(false);
                    resolve(coords);
                },
                (err) => {
                    this.loading.set(false);
                    this.error.set(err.message);
                    reject(err.message);
                },
                {
                    timeout: 10_000,
                    enableHighAccuracy: true,
                    maximumAge: 0
                }
            );
        });
    }
}
