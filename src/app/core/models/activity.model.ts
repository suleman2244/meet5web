// src/app/core/models/activity.model.ts
import { User } from './user.model';

export enum ActivityCategory {
    OUTDOOR = 'Outdoor',
    FOOD_DRINK = 'Food & Drink',
    SPORTS = 'Sports',
    ARTS_CULTURE = 'Arts & Culture',
    SOCIAL = 'Social',
    NIGHTLIFE = 'Nightlife',
    GAMES = 'Games',
    COFFEE_BREAKFAST = 'Coffee & Breakfast',
    SIGHTSEEING = 'Sightseeing',
    MUSIC_CONCERTS = 'Music & Concerts',
    MOVIES_CINEMA = 'Movies & Cinema',
    WELLNESS_SPA = 'Wellness & Spa',
    SHOPPING = 'Shopping',
    EDUCATION = 'Education',
    VOLUNTEERING = 'Volunteering'
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    category: ActivityCategory;
    imageUrl: string;
    date: Date;
    time: string;              // "19:00"
    location: {
        name: string;            // "Café Central"
        city: string;            // "Frankfurt"
        address: string;
    };
    maxParticipants: number;
    currentParticipants: number;
    participants: User[];       // Mocked avatars
    organizer: User;
    tags: string[];
    isFull: boolean;
    isJoined: boolean;
    // Form options
    isInviteOnly?: boolean;
    isMenOnly?: boolean;
    ageRange?: string;
    // Geo
    lat?: number;
    lon?: number;
}
