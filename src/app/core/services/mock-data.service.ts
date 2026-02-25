// src/app/core/services/mock-data.service.ts
import { Injectable, signal, Signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Activity, ActivityCategory } from '../models/activity.model';
import { User } from '../models/user.model';

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Anna', age: 52, avatarUrl: 'https://i.pravatar.cc/150?img=47', isVerified: true },
    { id: 'u2', name: 'Klaus', age: 58, avatarUrl: 'https://i.pravatar.cc/150?img=51', isVerified: true },
    { id: 'u3', name: 'Brigitte', age: 61, avatarUrl: 'https://i.pravatar.cc/150?img=5', isVerified: false },
    { id: 'u4', name: 'Heinz', age: 64, avatarUrl: 'https://i.pravatar.cc/150?img=52', isVerified: true },
    { id: 'u5', name: 'Elena', age: 55, avatarUrl: 'https://i.pravatar.cc/150?img=9', isVerified: true },
    { id: 'u6', name: 'Dieter', age: 60, avatarUrl: 'https://i.pravatar.cc/150?img=59', isVerified: false },
    { id: 'u7', name: 'Ursula', age: 57, avatarUrl: 'https://i.pravatar.cc/150?img=25', isVerified: true },
    { id: 'u8', name: 'Werner', age: 63, avatarUrl: 'https://i.pravatar.cc/150?img=56', isVerified: false },
    { id: 'u9', name: 'Helga', age: 59, avatarUrl: 'https://i.pravatar.cc/150?img=20', isVerified: true },
    { id: 'u10', name: 'Günter', age: 65, avatarUrl: 'https://i.pravatar.cc/150?img=62', isVerified: true },
    { id: 'u11', name: 'Ingrid', age: 54, avatarUrl: 'https://i.pravatar.cc/150?img=44', isVerified: true },
    { id: 'u12', name: 'Frank', age: 62, avatarUrl: 'https://i.pravatar.cc/150?img=65', isVerified: false },
];

const MOCK_ACTIVITIES: Activity[] = [
    {
        id: 'a1',
        title: 'Yoga meets Pilates: Nervensystemregulation und eine starke Mitte 🧘‍♀️',
        description: 'Willkommen zu unserem gemeinsamen Yoga & Pilates-Treffen! Wir kombinieren sanfte Übungen für das Nervensystem mit gezielter Rumpfkräftigung. Ideal für alle Levels. Bitte bequeme Kleidung mitbringen.',
        category: ActivityCategory.SPORTS,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-02-23'),
        time: '10:00',
        location: { name: 'Estewiesen 10', city: 'Buxtehude', address: 'Estewiesen 10, 21614 Buxtehude, Deutschland' },
        maxParticipants: 4,
        currentParticipants: 1,
        participants: [MOCK_USERS[0]],
        organizer: MOCK_USERS[0],
        tags: ['Yoga', 'Pilates', 'Wellness'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a2',
        title: 'Bowling 🎳 Montags wöchentlich bowlen in Wandsbek',
        description: 'Wir treffen uns jeden Montag zum geselligen Bowlen! Anfänger und Erfahrene sind gleichermaßen willkommen. Komm einfach vorbei und lerne nette Menschen kennen.',
        category: ActivityCategory.GAMES,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-02-23'),
        time: '18:00',
        location: { name: 'Wandsbeker Zollstraße 25-29', city: 'Hamburg', address: 'Wandsbeker Zollstraße 25-29, 22041 Hamburg, Deutschland' },
        maxParticipants: 8,
        currentParticipants: 6,
        participants: MOCK_USERS.slice(1, 7),
        organizer: MOCK_USERS[1],
        tags: ['Bowling', 'Sport', 'Weekly'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a3',
        title: 'Billard und Cocktails 🍹',
        description: 'Ein entspannter Abend mit Billard und guten Cocktails. Wir starten mit ein paar Lernspielen, danach können alle frei spielen. Getränke sind separat zu bezahlen.',
        category: ActivityCategory.NIGHTLIFE,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-02-23'),
        time: '20:00',
        location: { name: 'Fuhlsbüttler Str. 184', city: 'Hamburg', address: 'Fuhlsbüttler Str. 184, 22307 Hamburg, Deutschland' },
        maxParticipants: 6,
        currentParticipants: 4,
        participants: MOCK_USERS.slice(2, 6),
        organizer: MOCK_USERS[2],
        tags: ['Billiard', 'Cocktails', 'Evening'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a4',
        title: 'Spaziergang durch die Hamburger Altstadt 🚶‍♂️',
        description: 'Gemeinsamer Stadtspaziergang durch das historische Hamburg. Wir erkunden versteckte Gassen, entdecken historische Gebäude und genießen die Atmosphäre der Stadt.',
        category: ActivityCategory.OUTDOOR,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-02-24'),
        time: '14:00',
        location: { name: 'Rathaus Hamburg', city: 'Hamburg', address: 'Rathausmarkt 1, 20095 Hamburg, Deutschland' },
        maxParticipants: 10,
        currentParticipants: 3,
        participants: MOCK_USERS.slice(3, 6),
        organizer: MOCK_USERS[3],
        tags: ['Walking', 'History', 'Culture'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a5',
        title: 'Italienisches Dinner 🍕 in gemütlicher Runde',
        description: 'Wir treffen uns im Ristorante La Piazza für ein gemütliches italienisches Abendessen. Das Restaurant ist bekannt für seine authentische Küche und familiäre Atmosphäre.',
        category: ActivityCategory.FOOD_DRINK,
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-02-25'),
        time: '19:30',
        location: { name: 'Ristorante La Piazza', city: 'Hamburg', address: 'Eppendorfer Landstraße 59, 20249 Hamburg, Deutschland' },
        maxParticipants: 8,
        currentParticipants: 5,
        participants: MOCK_USERS.slice(0, 5),
        organizer: MOCK_USERS[4],
        tags: ['Italian', 'Food', 'Dinner'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a6',
        title: 'Kino & Popcorn 🎬 - Neuheiten im Abaton',
        description: 'Gemeinsam ins Kino! Wir schauen zusammen den neuen Film im Abaton Kino. Das genaue Programm wird 2 Tage vorher bekanntgegeben. Karten bitte selbst kaufen.',
        category: ActivityCategory.ARTS_CULTURE,
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-02-25'),
        time: '20:30',
        location: { name: 'Abaton Kino', city: 'Hamburg', address: 'Allende-Platz 3, 20146 Hamburg, Deutschland' },
        maxParticipants: 12,
        currentParticipants: 12,
        participants: MOCK_USERS.slice(0, 12),
        organizer: MOCK_USERS[5],
        tags: ['Cinema', 'Film', 'Evening'],
        isFull: true,
        isJoined: false
    },
    {
        id: 'a7',
        title: 'Café-Runde am Sonntagvormittag ☕',
        description: 'Gemütliches Zusammensein beim Frühstück oder Brunch. Wir reservieren einen Tisch im Hamburger Kaffehaus. Komm vorbei, lerne neue Leute kennen und genieße den Sonntagmorgen.',
        category: ActivityCategory.FOOD_DRINK,
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-03-01'),
        time: '10:30',
        location: { name: 'Hamburger Kaffehaus', city: 'Hamburg', address: 'Dammtorstraße 14, 20354 Hamburg, Deutschland' },
        maxParticipants: 6,
        currentParticipants: 2,
        participants: [MOCK_USERS[6], MOCK_USERS[7]],
        organizer: MOCK_USERS[6],
        tags: ['Coffee', 'Brunch', 'Sunday'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a8',
        title: 'Nordic Walking im Stadtpark 🌿',
        description: 'Regelmäßiger Nordic-Walking-Treff im Hamburger Stadtpark. Wir laufen eine Runde von ca. 7 km in flottem Tempo. Stöcke werden bereitgestellt für alle, die noch keine haben.',
        category: ActivityCategory.OUTDOOR,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-03-02'),
        time: '09:00',
        location: { name: 'Stadtpark Hamburg', city: 'Hamburg', address: 'Stadtparkallee, 22303 Hamburg, Deutschland' },
        maxParticipants: 15,
        currentParticipants: 7,
        participants: MOCK_USERS.slice(0, 7),
        organizer: MOCK_USERS[7],
        tags: ['Nordic Walking', 'Outdoor', 'Fitness'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a9',
        title: 'Kunst & Kultur: Kunsthalle Hamburg Führung 🎨',
        description: 'Führung durch die aktuelle Sonderausstellung in der Kunsthalle Hamburg. Ein Kunsthistoriker erklärt die wichtigsten Werke. Eintrittskosten ca. 14 Euro p.P.',
        category: ActivityCategory.ARTS_CULTURE,
        imageUrl: 'https://images.unsplash.com/photo-1518998053502-51dd0c61cd2a?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-03-05'),
        time: '15:00',
        location: { name: 'Kunsthalle Hamburg', city: 'Hamburg', address: 'Glockengießerwall 5, 20095 Hamburg, Deutschland' },
        maxParticipants: 12,
        currentParticipants: 4,
        participants: MOCK_USERS.slice(8, 12),
        organizer: MOCK_USERS[8],
        tags: ['Art', 'Museum', 'Culture'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a10',
        title: 'Skat-Abend für Anfänger und Fortgeschrittene 🃏',
        description: 'Skat spielen und dabei Spaß haben! Anfänger lernen die Grundregeln, Fortgeschrittene spielen ein richtiges Turnier. Karten und Getränke werden bereitgestellt.',
        category: ActivityCategory.GAMES,
        imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-03-06'),
        time: '19:00',
        location: { name: 'Gasthaus zum Anker', city: 'Hamburg', address: 'Schulterblatt 112, 20357 Hamburg, Deutschland' },
        maxParticipants: 12,
        currentParticipants: 8,
        participants: MOCK_USERS.slice(0, 8),
        organizer: MOCK_USERS[9],
        tags: ['Skat', 'Cards', 'Games'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a11',
        title: 'Radtour Alster-Runde 🚴‍♀️',
        description: 'Eine entspannte Radtour rund um die Alster. Wir fahren ca. 20 km und halten an der Schönen Aussicht für eine Pause. Eigenes Fahrrad oder Leihrad mitbringen.',
        category: ActivityCategory.OUTDOOR,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-03-08'),
        time: '11:00',
        location: { name: 'Alster Pavillon', city: 'Hamburg', address: 'Jungfernstieg 54, 20354 Hamburg, Deutschland' },
        maxParticipants: 10,
        currentParticipants: 3,
        participants: MOCK_USERS.slice(2, 5),
        organizer: MOCK_USERS[10],
        tags: ['Cycling', 'Alster', 'Outdoor'],
        isFull: false,
        isJoined: false
    },
    {
        id: 'a12',
        title: 'Weinprobe mit Experten 🍷',
        description: 'Lernt edle Weine aus aller Welt kennen! Ein erfahrener Sommelier erklärt die feinen Unterschiede und begleitet die Verkostung. Inklusive Aperitif und kleinem Snack-Buffet.',
        category: ActivityCategory.FOOD_DRINK,
        imageUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=800&auto=format&fit=crop',
        date: new Date('2026-03-10'),
        time: '18:30',
        location: { name: 'Weinkontor Hamburg', city: 'Hamburg', address: 'Rothenbaumchaussee 40, 20148 Hamburg, Deutschland' },
        maxParticipants: 10,
        currentParticipants: 6,
        participants: MOCK_USERS.slice(0, 6),
        organizer: MOCK_USERS[11],
        tags: ['Wine', 'Tasting', 'Premium'],
        isFull: false,
        isJoined: false
    }
];

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    private storageService = inject(StorageService);
    private readonly STORAGE_KEY = 'meet5_activities';

    private _activities = signal<Activity[]>([]);

    readonly activities = this._activities.asReadonly();

    constructor() {
        this.initData();
    }

    private initData(): void {
        const stored = this.storageService.getItem<Activity[]>(this.STORAGE_KEY);
        if (stored && stored.length > 0) {
            // Convert strings back to Date objects if necessary
            const parsed = stored.map(a => ({
                ...a,
                date: new Date(a.date)
            }));
            this._activities.set(parsed);
        } else {
            this._activities.set(MOCK_ACTIVITIES);
            this.saveToStorage();
        }
    }

    private saveToStorage(): void {
        this.storageService.setItem(this.STORAGE_KEY, this._activities());
    }

    getActivityById(id: string): Signal<Activity | undefined> {
        return computed(() => this._activities().find(a => a.id === id));
    }

    searchActivities(query: string): Activity[] {
        const q = query.toLowerCase();
        return this._activities().filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.location.city.toLowerCase().includes(q) ||
            a.location.address.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q)
        );
    }

    addActivity(activity: Activity): void {
        this._activities.update(current => {
            const updated = [...current, activity];
            return updated;
        });
        this.saveToStorage();
    }

    joinActivity(activityId: string): void {
        this._activities.update(activities => {
            const updated = activities.map(a => {
                if (a.id === activityId && !a.isJoined && !a.isFull) {
                    return {
                        ...a,
                        isJoined: true,
                        currentParticipants: a.currentParticipants + 1,
                        isFull: a.currentParticipants + 1 >= a.maxParticipants
                    };
                }
                return a;
            });
            return updated;
        });
        this.saveToStorage();
    }

    leaveActivity(activityId: string): void {
        this._activities.update(activities => {
            const updated = activities.map(a => {
                if (a.id === activityId && a.isJoined) {
                    return {
                        ...a,
                        isJoined: false,
                        currentParticipants: a.currentParticipants - 1,
                        isFull: false
                    };
                }
                return a;
            });
            return updated;
        });
        this.saveToStorage();
    }
}
