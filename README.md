# Meet5 Web — Angular Frontend Challenge

A responsive web version of the **Meet5** mobile app, built with **Angular 21**. Works great on desktop, tablet, and mobile.

> **Run it locally:** `npm start` → [http://localhost:4200](http://localhost:4200)

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Core Features](#-core-features)
3. [Bonus Features](#-bonus-features)
4. [Architecture](#-architecture)
5. [Translations (i18n)](#-translations-i18n)
6. [Dark / Light Mode](#-dark--light-mode)
7. [Data Storage](#-data-storage)
8. [Location Features](#-location-features)
9. [Project Structure](#-project-structure)
10. [Scripts](#-available-scripts)
11. [Tech Stack](#-tech-stack)

---

## 🚀 Quick Start

**You need:** Node.js v18+ and npm v9+

```bash
# Clone and run
git clone https://github.com/suleman2244/meet5web.git
cd meet5-web
npm install
npm start
```

Open **http://localhost:4200** in your browser.

To create a production build:

```bash
npm run build
# Output goes to dist/meet5-web
```

---

## ✅ Core Features

### Navigation

A fixed sidebar lets you navigate through the app:

| Menu Item    | Status               |
|-------------|----------------------|
| Activities   | ✅ Fully working     |
| For Me       | 🔗 Placeholder       |
| Discover     | 🔗 Placeholder       |
| Chats        | 🔗 Placeholder       |
| Profile      | 🔗 Placeholder       |

The sidebar adapts to screen size:
- **Desktop:** Full sidebar with labels and links
- **Tablet (≤ 1024px):** Icons only
- **Mobile (≤ 768px):** Bottom tab bar

### Activities Page

The main page shows a grid of activity cards. You can:

- **Search** activities by title in real time
- **Filter** by category or sort by date/size
- **View activity cards** showing title, date, location, participant count, avatar grid, and join status
- **See insights** in a sidebar panel with stats and a doughnut chart

---

## 💎 Bonus Features

### Activity Detail Page

Click any activity card to see its full details:

- Large header image
- Full description and metadata
- Avatar grid showing who joined and empty spots
- Interactive **OpenStreetMap** centered on the activity location
- **Join / Leave** button that stays in sync across the app

### Create Activity Dialog

A popup form to create new activities:

- Validates required fields (title, location, size)
- Pick a category from the list
- Toggle options like "Invite Only" and "Men Only"
- Live preview of the activity you're creating

### Insights Chart

A **Chart.js doughnut chart** in the sidebar that:

- Shows how activities are split by category
- Updates live as you search or filter
- Translates labels when you switch languages

---

## 🏗 Architecture

### Angular 21 with Signals

The app uses Angular's **Signals API** for reactive state management:

- **Signals** track state changes efficiently without Zone.js
- **Computed signals** auto-update when their data changes
- **Signal Inputs** make component communication type-safe
- **RxJS Interop** connects Observable services to Signal-based templates

### Standalone Components

Every component is standalone (no NgModules). This means:

- Smaller bundle sizes thanks to tree-shaking
- Each component lists its own dependencies
- Routes are lazy-loaded for better performance

### Services

All data flows through injectable services:

| Service                 | What it does                                |
|------------------------|---------------------------------------------|
| `ActivityService`       | Manages activities (create, join, leave)     |
| `StorageService`        | Reads/writes to localStorage                |
| `ThemeService`          | Handles dark/light mode switching            |
| `GeolocationService`    | Gets the user's GPS location                |
| `LocationSearchService` | Looks up city names and searches locations   |
| `DialogService`         | Controls modal popups                        |
| `MockDataService`       | Generates sample activities on first load    |

### Styling

The app uses a custom **SCSS design system**:

- `_variables.scss` — Colors, spacing, breakpoints, shadows
- `_mixins.scss` — Responsive helpers (`@include mix.mobile`, `@include mix.tablet`)
- `_typography.scss` — Font setup (Inter + system fonts)
- **CSS Variables** (`--surface`, `--text-main`, etc.) enable theme switching at runtime

---

## 🌍 Translations (i18n)

Uses **ngx-translate** so you can switch languages without reloading the page.

### Supported Languages

| Language     | File                          |
|-------------|-------------------------------|
| 🇺🇸 English  | `public/assets/i18n/en.json`  |
| 🇩🇪 German   | `public/assets/i18n/de.json`  |
| 🇫🇷 French   | `public/assets/i18n/fr.json`  |

### How It Works

- Translation files load automatically at startup
- Templates use the `| translate` pipe to show the right text
- Chart labels also update when you change the language
- Your language choice is saved in localStorage and restored on reload
- A language picker in the top bar lets you switch instantly

### Adding a New Language

```bash
# 1. Copy an existing file
cp public/assets/i18n/en.json public/assets/i18n/es.json

# 2. Translate the values in es.json

# 3. Add the option in top-bar.component.ts
#    <option value="es">🇪🇸 ES</option>
```

---

## 🎨 Dark / Light Mode

The theme system works with **CSS variables** and needs no extra libraries:

1. `ThemeService` stores the current theme in a signal
2. When the theme changes, it updates the `body` class and saves to localStorage
3. CSS variables switch colors based on the body class:

```scss
// Light (default)
:root {
    --background: #F8F9FA;
    --surface: #FFFFFF;
    --text-main: #1A1A1A;
}

// Dark
body.dark-theme {
    --background: #1A1A1A;
    --surface: #2D2D2D;
    --text-main: #F1F3F5;
}
```

4. On first visit, it checks your system preference and picks the matching theme
5. A toggle button (🌙 / ☀️) in the top bar lets you switch manually

---

## 💾 Data Storage

Since this is a frontend-only demo (no backend), everything is saved in **localStorage**:

| Key                | What it stores                | Used by           |
|--------------------|-------------------------------|-------------------|
| `meet5_activities` | All activities (as JSON)      | `ActivityService` |
| `meet5-theme`      | `"light"` or `"dark"`        | `ThemeService`    |
| `app-lang`         | `"en"`, `"de"`, or `"fr"`    | `TopBarComponent` |

Data flows like this:

```
Component → ActivityService → StorageService → localStorage
                ↓
           signal<Activity[]>  ← (all components get updates)
```

The `StorageService` is a simple wrapper around localStorage that handles JSON parsing automatically.

---

## 📍 Location Features

### Getting Your Location

The `GeolocationService` asks for your GPS coordinates using the browser's built-in location API. It gives you:
- Your coordinates
- A loading state
- An error state (if you deny permission)

### Looking Up City Names

The `LocationSearchService` uses **OpenStreetMap's Nominatim API** (free, no API key needed) to:
- Convert your coordinates into a city name (shown in the header)
- Search for locations by text (used in the Create Activity form)
- Prioritize results near your current location

```
Your GPS → GeolocationService → LocationSearchService → Nominatim API
                                        ↓
                                 City name → shown in the top bar
```

---

## 📂 Project Structure

```
src/app/
├── core/                        # Services and data models
│   ├── models/
│   │   ├── activity.model.ts    # Activity type + category enum
│   │   └── user.model.ts        # User type
│   └── services/
│       ├── activity.service.ts  # Activity CRUD + join/leave
│       ├── storage.service.ts   # localStorage wrapper
│       ├── theme.service.ts     # Theme management
│       ├── geolocation.service.ts
│       ├── location-search.service.ts
│       ├── dialog.service.ts
│       └── mock-data.service.ts
├── features/
│   └── activities/
│       ├── components/          # Reusable UI pieces
│       │   ├── activity-card/
│       │   ├── activity-sidebar/
│       │   ├── filter-bar/
│       │   └── create-activity-dialog/
│       └── pages/               # Full pages (routed)
│           ├── activity-list/
│           ├── activity-detail/
│           └── create-activity/
├── layout/                      # App shell (sidebar, top bar)
└── shared/                      # Shared utilities
```

---

## 📜 Available Scripts

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm start`      | Start dev server at `localhost:4200` |
| `npm run build`  | Production build → `dist/meet5-web`  |
| `npm run watch`  | Dev build with auto-reload           |
| `npm test`       | Run unit tests                       |

---

## 🧰 Tech Stack

| Category       | Technology                              |
|----------------|-----------------------------------------|
| Framework      | Angular 21 (Standalone Components + Signals) |
| Language       | TypeScript 5.9                          |
| Styling        | SCSS + CSS Custom Properties            |
| State          | Angular Signals + RxJS                  |
| Charts         | Chart.js 4 + ng2-charts 8              |
| Translations   | @ngx-translate/core 17                  |
| Maps           | OpenStreetMap (iframe)                  |
| Geocoding      | Nominatim API (free, no key)            |
| Storage        | localStorage via StorageService         |
| Build Tool     | Angular CLI + esbuild                   |

---

## 📝 Author

**Sulaman** — Built for the Meet5 Web Development evaluation.

> GitHub: [suleman2244/meet5web](https://github.com/suleman2244/meet5web)
