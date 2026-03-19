# NetCaChill - Netflix-like Movie Streaming Website

Build a Netflix-inspired movie streaming website using Next.js (App Router), Supabase for auth/database, and Vietnamese movie APIs.

## User Review Required

> [!IMPORTANT]
> **Supabase Project**: A new Supabase project will be created for NetCaChill (costs may apply on paid plans). Currently you have 1 project on the free tier org `datle0805's Org`.

> [!IMPORTANT]
> **API Priority**: Using **NguonC** (`phim.nguonc.com`) as primary source (32K+ movies, full metadata, direct streaming URLs). **OPhim** and **KKPhim** as fallbacks.

---

## Proposed Changes

### 1. Project Foundation

#### [NEW] Next.js App (App Router)

Created in `/Users/ledat/Documents/Software/Vibe code/NetCaChill/` using `npx create-next-app@latest`.

- **Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Font**: Inter from Google Fonts
- **Dark theme** by default (Netflix-style)

#### [NEW] Environment Configuration

- `.env.local` — Supabase URL/keys, API base URLs

---

### 2. Supabase Database

#### [NEW] Database Schema (via migrations)

```sql
-- Users profile extension
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites / Watchlist
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  movie_slug TEXT NOT NULL,
  movie_name TEXT NOT NULL,
  movie_thumb TEXT,
  movie_year INT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_slug)
);

-- Watch history
CREATE TABLE public.watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  movie_slug TEXT NOT NULL,
  movie_name TEXT NOT NULL,
  movie_thumb TEXT,
  episode_slug TEXT,
  episode_name TEXT,
  progress FLOAT DEFAULT 0,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_slug, episode_slug)
);
```

- RLS policies for row-level security
- Auth triggers for profile auto-creation

---

### 3. API Integration Layer

#### [NEW] `src/lib/api/nguonc.ts` — Primary API

| Endpoint | URL |
|----------|-----|
| Latest | `GET /api/films/phim-moi-cap-nhat?page={n}` |
| Detail | `GET /api/film/{slug}` |
| Search | `GET /api/films/search?keyword={q}&page={n}` |
| By Type | `GET /api/films/danh-sach/{type}?page={n}` |
| By Genre | `GET /api/films/the-loai/{genre}?page={n}` |
| By Country | `GET /api/films/quoc-gia/{country}?page={n}` |

- Returns: name, slug, thumb_url, poster_url, description, cast, episodes with **m3u8** streaming URLs

#### [NEW] `src/lib/api/ophim.ts` — Backup API

- Base: `https://ophim1.com`
- Image base: response `pathImage` field
- Similar endpoints pattern

#### [NEW] `src/lib/api/kkphim.ts` — Backup API

- Base: `https://phimapi.com`
- Full image URLs included in response

#### [NEW] `src/lib/api/movie-service.ts` — Unified Service

- Facade pattern: tries NguonC first → OPhim → KKPhim on failure
- Normalizes response format across all 3 APIs
- Caching with `unstable_cache` / `revalidate`

#### [NEW] `src/app/api/` — Next.js API Routes

- `/api/movies/trending` — proxy + cache
- `/api/movies/search` — search proxy
- `/api/movies/[slug]` — detail proxy

---

### 4. Core UI Pages (Netflix-style)

#### [NEW] `src/app/page.tsx` — Home Page

- **Hero Banner**: Featured movie with backdrop, gradient overlay, play/info buttons
- **Movie Rows**: Horizontal carousels by category (Trending, New, Korean, Action, etc.)
- Netflix-style hover zoom effect on thumbnails

#### [NEW] `src/app/phim/[slug]/page.tsx` — Movie Detail

- Full-width backdrop image
- Movie info: title, year, quality, description, cast, episodes
- Episode list (for series)
- Add to favorites button
- Similar movies section

#### [NEW] `src/app/xem-phim/[slug]/[episode]/page.tsx` — Video Player

- HLS video player using `hls.js`
- Episode navigation
- Progress tracking → save to Supabase

#### [NEW] `src/app/tim-kiem/page.tsx` — Search Page

- Search bar with instant results
- Filter by: genre, country, year, type
- Grid layout results

#### [NEW] `src/app/the-loai/[slug]/page.tsx` — Genre Page
#### [NEW] `src/app/quoc-gia/[slug]/page.tsx` — Country Page

- Paginated movie grid filtered by genre/country

#### [NEW] `src/app/danh-sach-cua-toi/page.tsx` — My List (Protected)

- User's saved favorites, grid display

#### [NEW] `src/app/lich-su/page.tsx` — Watch History (Protected)

- Recently watched with progress indicator

#### [NEW] `src/app/dang-nhap/page.tsx` — Login Page
#### [NEW] `src/app/dang-ky/page.tsx` — Register Page

---

### 5. Core Components

#### [NEW] `src/components/`

| Component | Purpose |
|-----------|---------|
| `Navbar` | Fixed top nav with search, user menu, genre dropdown |
| `HeroBanner` | Large featured movie banner |
| `MovieRow` | Horizontal scrollable movie carousel |
| `MovieCard` | Thumbnail with hover preview |
| `MovieGrid` | Grid layout for browse/search pages |
| `VideoPlayer` | HLS player with controls |
| `EpisodeList` | Episode selector for series |
| `SearchBar` | Auto-complete search |
| `Footer` | Site footer |
| `AuthGuard` | Route protection wrapper |
| `SkeletonLoader` | Loading placeholders |

---

### 6. Styling (Netflix Dark Theme)

#### [NEW] `src/app/globals.css`

- CSS custom properties for design tokens
- Color palette: dark background `#141414`, red accent `#E50914`
- Typography: Inter font, responsive font sizes
- Smooth animations & transitions
- Mobile-first responsive breakpoints

---

## Verification Plan

### Browser Testing
1. **Start dev server**: `cd "/Users/ledat/Documents/Software/Vibe code/NetCaChill" && npm run dev`
2. **Home Page**: Open `http://localhost:3000`, verify hero banner loads, movie carousels scroll, hover effects work
3. **Search**: Type a movie name, verify results appear
4. **Movie Detail**: Click a movie → verify detail page loads with info + episodes
5. **Video Player**: Click play → verify HLS video plays
6. **Auth Flow**: Register → Login → verify protected routes work
7. **Favorites**: Add/remove from list → verify persistence
8. **Responsive**: Resize browser to mobile/tablet widths → verify layout adapts

### Manual Verification
- User should test on real mobile device for touch interactions
- Verify video playback works across browsers (Chrome, Safari, Firefox)
