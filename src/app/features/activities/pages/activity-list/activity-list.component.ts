import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivityService } from '../../../../core/services/activity.service';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { DialogService } from '../../../../core/services/dialog.service';
import { GeolocationService } from '../../../../core/services/geolocation.service';
import { LocationSearchService } from '../../../../core/services/location-search.service';
import { FilterBarComponent, FilterState } from '../../components/filter-bar/filter-bar.component';
import { ActivitySidebarComponent } from '../../components/activity-sidebar/activity-sidebar.component';

@Component({
    selector: 'app-activity-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ActivityCardComponent,
        FilterBarComponent,
        TranslateModule,
        ActivitySidebarComponent
    ],
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent {
    private activityService = inject(ActivityService);
    private translate = inject(TranslateService);
    private router = inject(Router);
    private geo = inject(GeolocationService);
    private locSearch = inject(LocationSearchService);

    readonly dialog = inject(DialogService);

    searchQuery = '';
    private _searchQuery = signal('');

    filterState = signal<FilterState>({
        sortBy: 'date_asc',
        category: 'All',
        showJoinedOnly: false
    });

    activities = this.activityService.activities;

    constructor() {
        this.detectLocation();
        this.translate.onLangChange.subscribe(event => {
            this.currentLang.set(event.lang);
        });
    }

    private currentLang = signal(this.translate.currentLang || 'en');

    async detectLocation() {
        try {
            const coords = await this.geo.requestPosition();
            const city = await this.locSearch.getCityFromCoords(coords);
            if (city) this.locSearch.currentCity.set(city);
        } catch { }
    }

    filteredActivities = computed(() => {
        let list = [...this.activities()];
        const q = this._searchQuery().trim().toLowerCase();
        const state = this.filterState();

        if (q) {
            list = list.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.location.city.toLowerCase().includes(q) ||
                a.location.address.toLowerCase().includes(q) ||
                a.category.toLowerCase().includes(q)
            );
        }

        if (state.category !== 'All') {
            list = list.filter(a => a.category === state.category);
        }

        if (state.showJoinedOnly) {
            list = list.filter(a => a.isJoined);
        }

        list.sort((a, b) => {
            if (state.sortBy === 'date_asc') return a.date.getTime() - b.date.getTime();
            if (state.sortBy === 'date_desc') return b.date.getTime() - a.date.getTime();
            if (state.sortBy === 'size') return b.maxParticipants - a.maxParticipants;
            return 0;
        });

        return list;
    });

    joinedCount = computed(() => this.activities().filter(a => a.isJoined).length);

    onSearch(value: string) {
        this._searchQuery.set(value);
    }

    clearSearch() {
        this.searchQuery = '';
        this._searchQuery.set('');
    }

    onFilterChange(state: FilterState) {
        this.filterState.set(state);
    }

    onActivityClick(id: string) {
        this.router.navigate(['/activities', id]);
    }
}

