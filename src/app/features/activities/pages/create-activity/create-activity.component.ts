
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { Activity, ActivityCategory } from '../../../../core/models/activity.model';

@Component({
    selector: 'app-create-activity',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './create-activity.component.html',
    styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent {
    private fb = inject(FormBuilder);
    private mockDataService = inject(MockDataService);
    private router = inject(Router);

    activityForm: FormGroup = this.fb.group({
        size: [6, [Validators.required, Validators.min(2)]],
        title: ['', [Validators.required, Validators.maxLength(100)]],
        description: ['', [Validators.required]],
        location: ['', [Validators.required]],
        isInviteOnly: [false],
        isMenOnly: [false],
        ageRange: [false]
    });

    categories = Object.values(ActivityCategory);
    sizes = [2, 4, 6, 8, 10, 12, 15, 20];

    onSubmit() {
        if (this.activityForm.valid) {
            const formValue = this.activityForm.value;

            const newActivity: Activity = {
                id: 'a' + Date.now(),
                title: formValue.title,
                description: formValue.description,
                category: ActivityCategory.SOCIAL, // Default or could add a picker
                imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
                date: new Date(),
                time: '19:00',
                location: {
                    name: 'Custom Location',
                    city: 'Hamburg',
                    address: formValue.location
                },
                maxParticipants: formValue.size,
                currentParticipants: 1,
                participants: [
                    {
                        id: 'u_curr',
                        name: 'You',
                        age: 30,
                        avatarUrl: 'https://i.pravatar.cc/150?u=curr',
                        isVerified: true
                    }
                ],
                organizer: {
                    id: 'u_curr',
                    name: 'You',
                    age: 30,
                    avatarUrl: 'https://i.pravatar.cc/150?u=curr',
                    isVerified: true
                },
                tags: ['New'],
                isFull: false,
                isJoined: true,
                isInviteOnly: formValue.isInviteOnly,
                isMenOnly: formValue.isMenOnly,
                ageRange: formValue.ageRange ? 'Standard' : undefined
            };

            this.mockDataService.addActivity(newActivity);
            this.router.navigate(['/activities']);
        }
    }
}
