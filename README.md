# Song Catalog Generator App

A single-page music store showcase built with Next.js.  
The application generates an endless fake music catalog with localized song titles, artists, albums, genres, reviews, album covers, likes, and playable audio previews.

The project focuses on deterministic generation: the same region, seed, and page always produce the same songs, covers, and audio output.

Live app: https://songs-generator-app.onrender.com

## Features

* Localized music catalog generation
* English and additional region support
* 64-bit seed input
* Random seed generation
* Average likes per song with fractional probabilistic distribution
* Table View with pagination
* Gallery View with infinite scrolling
* Expandable song rows with detailed information
* Generated album and single covers
* Playable browser-based audio previews
* Generated lyrics display with synchronized live scrolling during playback
* Server-side song batch generation
* Deterministic output based on region, seed, and page
* Independent likes generation, so changing likes does not change song metadata
* No authentication or database required


## Tech Stack

- Next.js
- React
- Material UI
- TanStack React Query
- Faker.js
- Tone.js
- Tonal.js
- Culori
- Zod
- Xoshiro RNG

## Project Structure

```txt
.
├── app
│   ├── api
│   │   ├── cover
│   │   └── songs
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components
│   ├── common
│   ├── song
│   ├── toolbar
│   ├── AppToolbar.jsx
│   ├── AudioPlayer.jsx
│   ├── GalleryView.jsx
│   ├── LyricsDisplay.jsx
│   ├── QueryProvider.jsx
│   ├── SongCard.jsx
│   ├── SongDetails.jsx
│   ├── SongsTable.jsx
│   └── ViewSwitcher.jsx
│
├── data
│   ├── app
│   ├── covers
│   ├── locales
│   └── music
│
├── hooks
│   ├── useAudioPreview.js
│   ├── useInfiniteSongsQuery.js
│   ├── useSongFilters.js
│   └── useSongsQuery.js
│
├── lib
│   ├── api
│   ├── audio
│   ├── cover
│   ├── music
│   ├── seed
│   ├── songs
│   ├── utils
│   ├── generateBatch.js
│   ├── generateLikes.js
│   ├── generateMusic.js
│   ├── generateSong.js
│   ├── locales.js
│   ├── randomGenerator.js
│   └── uiText.js
│
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md
```


