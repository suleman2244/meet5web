# Meet5 Web — Angular Frontend Challenge

A high-fidelity, responsive web recreation of the **Meet5** mobile application, optimized for **desktop and iPad**. Built with **Angular 21** and modern reactive patterns (Signals, RxJS Interop), this project demonstrates senior-level code quality, modular architecture, and a premium UI/UX.

> **Live Preview:** Run locally with `npm start` → [http://localhost:4200](http://localhost:4200)

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Core Implementation](#-core-implementation-required-features)
3. [Bonus Features](#-bonus-features)
4. [Architecture & Technical Decisions](#-architecture--technical-decisions)
5. [Internationalization (i18n)](#-internationalization-i18n)
6. [Theming (Dark / Light Mode)](#-theming-dark--light-mode)
7. [Data Persistence (LocalStorage)](#-data-persistence-localstorage)
8. [Location & Geolocation](#-location--geolocation)
9. [Project Structure](#-project-structure)
10. [Scripts](#-available-scripts)

---

## 🚀 Quick Start

### Prerequisites

| Tool     | Version       |
|----------|---------------|
| Node.js  | **v18+**      |
| npm      | **v9+**       |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/meet5-web.git
cd meet5-web

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will be available at **http://localhost:4200**.

### Production Build

```bash
npm run build
# Output → dist/meet5-web
```

---

## ✅ Core Implementation (Required Features)

### Navigation

A fixed **left sidebar** provides access to all five menu items:

| Menu Item    | Status          |
|-------------|-----------------|
| Activities   | ✅ Fully implemented |
| For Me       | 🔗 Placeholder page |
| Discover     | 🔗 Placeholder page |
| Chats        | 🔗 Placeholder page |
| Profile      | 🔗 Placeholder page |

- **Desktop:** Full sidebar with labels, app store links, and logout
- **Tablet (≤ 1024px):** Collapsed sidebar with icons only
- **Mobile (≤ 768px):** Bottom tab navigation bar (iOS-style)

### Activities Page

The main page features a responsive grid layout with:

- **Search Bar** — Real-time text filtering across activity titles
- **Filter Bar** — Sort by date/size + category dropdown filter
- **Activity Cards** — Rich cards showing:
  - Title (translated by category)
  - Date and time
  - Location (city + venue name)
  - Participant count (e.g. "5 of 10 joined")
  - Dynamic avatar grid matching `maxParticipants`
  - Join status indicator
- **Sidebar Panel** — Upgrade card, stats summary, and a Chart.js doughnut chart with real-time category insights

---

## 💎 Bonus Features

### Activity Detail Page

A dedicated detail view accessible by clicking any activity card:

- High-resolution header image
- Full description with metadata
- Dynamic avatar grid showing joined participants and empty slots
- **Interactive OpenStreetMap** embed (iframe) centered on activity coordinates
- **Join / Leave** button with state synchronization across the entire app

### Create Activity Dialog

A modal dialog for creating new activities:

- Form validation (title, location, size required)
- Category selection from enum values
- Toggle switches (Invite Only, Men Only)
- Real-time preview of the created activity

### Activity Insights Chart

A reactive **Chart.js doughnut chart** in the sidebar that:

- Visualizes activity distribution by category
- Updates **in real-time** when search/filter changes
- Translates legend labels to the current language dynamically using Angular Signals + RxJS Interop

---

## 🏗 Architecture & Technical Decisions

### Why Angular 21 with Signals?

I chose the latest Angular version to leverage the **Signals API**, which provides:

- **Fine-grained reactivity** without Zone.js overhead
- **Computed properties** that automatically recalculate when dependencies change
- **Signal Inputs** (`input.required<T>()`) for type-safe, reactive component communication
- **RxJS Interop** (`toSignal`) to bridge Observable-based services with Signal-based templates

### Standalone Components

Every component uses `standalone: true` — no NgModules. This results in:

- **Smaller bundles** through tree-shaking
- **Explicit dependency declarations** in each component's `imports` array
- **Lazy-loaded routes** for Activities pages (list, detail, create)

### Service Layer Architecture

All data flows through injectable services that abstract storage from components:

| Service               | Responsibility                                      |
|-----------------------|-----------------------------------------------------|
| `ActivityService`     | CRUD operations, join/leave logic, signal-based state |
| `StorageService`      | Generic `localStorage` wrapper with JSON serialization |
| `ThemeService`        | Dark/light theme toggle with system preference detection |
| `GeolocationService`  | Browser Geolocation API wrapper with loading/error signals |
| `LocationSearchService` | Nominatim reverse geocoding + location-biased search |
| `DialogService`       | Global modal dialog state management |
| `MockDataService`     | Seed data generator for initial activity population |

### SCSS Design System

Instead of utility-first CSS, I implemented a **custom SCSS design system** with:

- `_variables.scss` — Color palette, spacing scale, breakpoints, shadows, radii
- `_mixins.scss` — Responsive breakpoint mixins (`@include mix.mobile`, `@include mix.tablet`)
- `_typography.scss` — Font stack definitions (Inter, system fonts)
- **CSS Custom Properties** (`--surface`, `--text-main`, etc.) for runtime theme switching

---

## 🌍 Internationalization (i18n)

### Library: `@ngx-translate/core` + `@ngx-translate/http-loader`

I chose **ngx-translate** over Angular's built-in i18n because it supports **runtime language switching** without rebuilding the application — critical for a seamless user experience.

### Supported Languages

| Language | File                        |
|----------|-----------------------------|
| 🇺🇸 English  | `public/assets/i18n/en.json` |
| 🇩🇪 German   | `public/assets/i18n/de.json` |
| 🇫🇷 French   | `public/assets/i18n/fr.json` |

### How It Works

1. **Translation files** are loaded via HTTP at runtime using `TranslateHttpLoader`
2. **Templates** use the `| translate` pipe for reactive translations
3. **Chart labels** use a reactive stream (`toSignal` + `switchMap`) to ensure canvas-based labels update without page refresh
4. **Language preference** is persisted in `localStorage` (`app-lang` key) and restored on reload
5. **Language selector** in the top bar allows instant switching between all three languages

### Adding a New Language

```bash
# 1. Create a new translation file
cp public/assets/i18n/en.json public/assets/i18n/es.json

# 2. Translate the values in es.json

# 3. Register the language in top-bar.component.ts
#    Add: <option value="es">🇪🇸 ES</option>
```

---

## 🎨 Theming (Dark / Light Mode)

### Implementation: `ThemeService` + CSS Custom Properties

The theme system is built with **zero external dependencies**:

1. **`ThemeService`** uses an Angular `signal<Theme>` to hold the current theme
2. An `effect()` automatically syncs the theme to:
   - `document.body.classList` (adds/removes `dark-theme`)
   - `localStorage` (key: `meet5-theme`)
3. **CSS Custom Properties** defined in `styles.scss` change based on the body class:

```scss
// Light theme (default)
:root {
    --background: #F8F9FA;
    --surface: #FFFFFF;
    --text-main: #1A1A1A;
}

// Dark theme
body.dark-theme {
    --background: #1A1A1A;
    --surface: #2D2D2D;
    --text-main: #F1F3F5;
}
```

4. **System preference detection**: On first visit, the app checks `prefers-color-scheme: dark` and auto-applies the matching theme
5. **Toggle button** (🌙 / ☀️) in the top bar instantly switches themes

---

## 💾 Data Persistence (LocalStorage)

### Why LocalStorage?

For a client-side demo application without a backend, `localStorage` provides:

- **Zero setup** — No database, no API server
- **Persistence across sessions** — Activities, theme, and language survive page refreshes
- **Easy migration path** — The `StorageService` abstraction means switching to HTTP/API requires changing only the service implementation

### What Gets Persisted

| Key                | Data                          | Service           |
|--------------------|-------------------------------|-------------------|
| `meet5_activities` | Full activity array (JSON)    | `ActivityService` |
| `meet5-theme`      | `"light"` or `"dark"`         | `ThemeService`    |
| `app-lang`         | `"en"`, `"de"`, or `"fr"`    | `TopBarComponent` |

### Architecture

```
Component → ActivityService → StorageService → localStorage
                ↓
           signal<Activity[]>  ← (reactive updates to all consumers)
```

The `StorageService` is a generic typed wrapper:

```typescript
setItem<T>(key: string, value: T): void    // JSON.stringify + save
getItem<T>(key: string): T | null          // Parse + return
removeItem(key: string): void
clear(): void
```

---

## 📍 Location & Geolocation

### Fetching User Location: `GeolocationService`

Uses the **Browser Geolocation API** (`navigator.geolocation`) to:

1. Request the user's GPS coordinates (with permission prompt)
2. Expose reactive signals: `coords`, `loading`, `error`
3. Configure high accuracy with a 10-second timeout

### Reverse Geocoding: `LocationSearchService`

Uses **OpenStreetMap's Nominatim API** (free, no API key required) to:

1. **Reverse geocode** coordinates → city name (for the "Activities near {city}" header)
2. **Forward search** text queries → location results (for the Create Activity form)
3. **Location-biased results** using a bounding box around the user's position

```
User GPS → GeolocationService → LocationSearchService → Nominatim API
                                        ↓
                                 currentCity signal → TopBar header
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── core/                       # Singleton services & models
│   │   ├── models/
│   │   │   ├── activity.model.ts   # Activity interface + ActivityCategory enum
│   │   │   └── user.model.ts       # User interface
│   │   └── services/
│   │       ├── activity.service.ts  # CRUD + join/leave + localStorage
│   │       ├── storage.service.ts   # Generic localStorage wrapper
│   │       ├── theme.service.ts     # Dark/light theme management
│   │       ├── geolocation.service.ts    # Browser GPS
│   │       ├── location-search.service.ts # Nominatim geocoding
│   │       ├── dialog.service.ts    # Modal state management
│   │       └── mock-data.service.ts # Seed data generator
│   ├── features/
│   │   └── activities/
│   │       ├── components/          # Reusable feature components
│   │       │   ├── activity-card/   # Individual card component
│   │       │   ├── activity-sidebar/ # Stats + chart sidebar
│   │       │   ├── filter-bar/      # Sort + category filter
│   │       │   └── create-activity-dialog/ # Modal form
│   │       └── pages/               # Routed page components
│   │           ├── activity-list/   # Main activities page
│   │           ├── activity-detail/ # Detail view with map
│   │           └── create-activity/ # Standalone create page
│   ├── layout/                      # App shell components
│   │   ├── layout.component.ts      # Shell with sidebar + router outlet
│   │   ├── sidebar/                 # Navigation sidebar
│   │   └── top-bar/                 # Header with actions
│   └── shared/                      # Cross-feature utilities
├── styles/                          # Global SCSS design system
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _typography.scss
└── public/assets/i18n/              # Translation files
    ├── en.json
    ├── de.json
    └── fr.json
```

---

## 📜 Available Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm start`     | Start dev server at `localhost:4200`     |
| `npm run build` | Production build → `dist/meet5-web`     |
| `npm run watch` | Development build with file watching     |
| `npm test`      | Run unit tests                           |

---

## 🧰 Tech Stack Summary

| Category         | Technology                                   |
|------------------|----------------------------------------------|
| Framework        | Angular 21 (Standalone Components + Signals) |
| Language         | TypeScript 5.9                               |
| Styling          | SCSS with CSS Custom Properties              |
| State Management | Angular Signals + RxJS Interop               |
| Charts           | Chart.js 4 + ng2-charts 8                    |
| i18n             | @ngx-translate/core 17                       |
| Maps             | OpenStreetMap (iframe embed)                  |
| Geocoding        | Nominatim API (free, no key)                 |
| Persistence      | localStorage via StorageService              |
| Build Tool       | Angular CLI + esbuild                        |

---

## 📝 Author

**Sulaman** — Built as part of the Meet5 Web Development evaluation.

> GitHub: [suleman2244/meet5web](https://github.com/suleman2244/meet5web)

> This implementation prioritizes **code quality**, **user experience**, and **architectural clarity**. Every component is standalone, every service is injectable and testable, and the design system ensures visual consistency across all viewports.
