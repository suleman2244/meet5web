// src/app/features/activities/components/filter-bar/filter-bar.component.ts
import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityCategory } from '../../../../core/models/activity.model';
import { TranslateModule } from '@ngx-translate/core';

export interface FilterState {
    sortBy: 'date_asc' | 'date_desc' | 'size';
    category: ActivityCategory | 'All';
    showJoinedOnly: boolean;
}

@Component({
    selector: 'app-filter-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent {
    filterChange = output<FilterState>();

    categories = Object.entries(ActivityCategory);

    state = signal<FilterState>({
        sortBy: 'date_asc',
        category: 'All',
        showJoinedOnly: false
    });

    onSortChange(sortBy: any) {
        this.updateState({ sortBy });
    }

    onCategoryChange(category: any) {
        this.updateState({ category });
    }

    toggleJoined() {
        this.updateState({ showJoinedOnly: !this.state().showJoinedOnly });
    }

    private updateState(patch: Partial<FilterState>) {
        this.state.update(s => ({ ...s, ...patch }));
        this.filterChange.emit(this.state());
    }
}
