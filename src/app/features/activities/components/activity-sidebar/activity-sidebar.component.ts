import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Activity, ActivityCategory } from '../../../../core/models/activity.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-activity-sidebar',
    standalone: true,
    imports: [CommonModule, BaseChartDirective, TranslateModule],
    templateUrl: './activity-sidebar.component.html',
    styleUrls: ['./activity-sidebar.component.scss']
})
export class ActivitySidebarComponent {
    private translate = inject(TranslateService);

    activities = input.required<Activity[]>();
    joinedCount = input.required<number>();

    private categoryTranslations = toSignal(
        this.translate.onLangChange.pipe(
            startWith({ lang: this.translate.currentLang || this.translate.defaultLang || 'en' }),
            switchMap(() => this.translate.get('CATEGORIES'))
        ),
        { initialValue: {} as Record<string, string> }
    );

    chartData = computed<ChartData<'doughnut'>>(() => {
        const list = this.activities();
        const translations = this.categoryTranslations();
        const counts: Record<string, number> = {};

        list.forEach(a => {
            const cat = a.category;
            counts[cat] = (counts[cat] || 0) + 1;
        });

        const labels = Object.keys(counts).map(catValue => {
            const entry = Object.entries(ActivityCategory).find(([_, v]) => v === catValue);
            const key = entry ? entry[0] : null;
            return (key && translations[key]) ? translations[key] : catValue;
        });

        const data = Object.values(counts);

        return {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
                    '#F7DC6F', '#BB8FCE', '#82E0AA', '#F0B27A', '#AED6F1'
                ],
                hoverOffset: 4,
                borderWidth: 0
            }]
        };
    });

    chartOptions: ChartConfiguration<'doughnut'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#888',
                    font: { size: 9 },
                    usePointStyle: true,
                    padding: 6
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 12 },
                bodyFont: { size: 12 },
                padding: 10,
                displayColors: false
            }
        }
    };

    chartType: 'doughnut' = 'doughnut';
}


