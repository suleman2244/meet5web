import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Coords } from './geolocation.service';

export interface LocationResult {
    displayName: string;
    shortName: string;
    lat: number;
    lon: number;
    type: string;
}

interface NominatimResult {
    place_id: number;
    display_name: string;
    name: string;
    lat: string;
    lon: string;
    type: string;
    category: string;
}

const NOMINATIM = 'https://nominatim.openstreetmap.org';

@Injectable({ providedIn: 'root' })
export class LocationSearchService {
    private http = inject(HttpClient);

    // Dynamic title state for the top bar
    currentCity = signal<string>('you');

    /** Find top N places near the user's coordinates */
    async searchNearby(coords: Coords, limit = 10): Promise<LocationResult[]> {
        const city = await this.getCityFromCoords(coords);
        return this.searchByText(city, coords, limit);
    }

    /** Simple reverse-geocode to get the city name for headers */
    async getCityFromCoords(coords: Coords): Promise<string> {
        const url = `${NOMINATIM}/reverse`;
        const params = {
            lat: coords.lat.toString(),
            lon: coords.lon.toString(),
            format: 'json',
            zoom: '10',         // city level
            addressdetails: '1'
        };
        try {
            const res: any = await firstValueFrom(this.http.get(url, { params }));
            return res?.address?.city || res?.address?.town || res?.address?.village || res?.address?.state || '';
        } catch {
            return '';
        }
    }

    /** Search by text constrained near the user's location */
    async searchByText(query: string, coords: Coords | null, limit = 10): Promise<LocationResult[]> {
        if (!query.trim()) return [];
        const params: Record<string, string> = {
            q: query,
            format: 'json',
            limit: limit.toString(),
            addressdetails: '1',
            featuretype: 'settlement,amenity,shop,tourism',
        };
        if (coords) {
            // Bias results towards user's location
            const delta = 0.3;
            params['viewbox'] = `${coords.lon - delta},${coords.lat + delta},${coords.lon + delta},${coords.lat - delta}`;
            params['bounded'] = '1';
        }
        const results = await firstValueFrom(
            this.http.get<NominatimResult[]>(`${NOMINATIM}/search`, { params })
        );
        return (results || []).map(r => ({
            displayName: r.display_name,
            shortName: r.name || r.display_name.split(',')[0],
            lat: parseFloat(r.lat),
            lon: parseFloat(r.lon),
            type: r.type
        }));
    }
}
