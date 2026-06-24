import { createRng } from './randomGenerator';
import { generateMusic } from './generateMusic';
import { generateLikes } from './generateLikes';
import { loadLocaleData } from './locales';
import { generateCoverMeta, generateMusicMeta } from './songs/generateMetadata';
import { generateReview } from './songs/generateReview';
import { generateLyrics, getLyricsDurationSeconds } from './generateLyrics';
import { generateAlbumTitle } from './songs/generateAlbum';
import { generateArtist } from './songs/generateArtist';
import { generateSongTitle } from './songs/generateTitle';
import { generateGenre } from './songs/generateGenre';

const RANDOM_SCOPES = ['title', 'artist', 'album', 'genre', 'review', 'cover', 'music', 'likes'];

export function generateSong(params) {
    const localeData = loadLocaleData(params.region);
    const context = createSongContext(params, localeData);
    return createSong(context);
}

function createSongContext(params, localeData) {
    return { params, localeData, randoms: createSongRandoms(params) };
}

function createSong(context) {
    const song = createSongData(context);
    return { ...song, music: createSongMusic(song), coverUrl: createCoverUrl(song) };
}

function createSongData({ params, localeData, randoms }) {
    return {
        ...params,
        ...createTextFields(params.region, localeData, randoms),
        ...createGeneratedFields(localeData, randoms, params.likes),
        lyrics: generateLyrics({ ...params, localeData })
    };
}

function createSongRandoms({ region, seed, index, likes }) {
    return Object.fromEntries(RANDOM_SCOPES.map((name) => createRandomEntry(name, region, seed, index, likes)));
}

function createRandomEntry(name, region, seed, index, likes) {
    return [name, createSongRng(name, region, seed, index, likes)];
}

function createSongRng(name, region, seed, index, likes) {
    if (name === 'likes') return createRng(name, region, seed, index, likes);
    return createRng(getRandomScope(name), region, seed, index);
}

function getRandomScope(name) {
    return name === 'music' ? 'music-meta' : name;
}

function createTextFields(region, localeData, randoms) {
    return {
        title: generateSongTitle(localeData, region, randoms.title),
        artist: generateArtist(localeData, region, randoms.artist),
        album: generateAlbumTitle(localeData, region, randoms.album),
        genre: generateGenre(localeData, region, randoms.genre)
    };
}

function createGeneratedFields(localeData, randoms, likes) {
    return {
        likes: generateLikes(likes, randoms.likes),
        review: generateReview(localeData, randoms.review),
        coverMeta: generateCoverMeta(localeData, randoms.cover),
        musicMeta: generateMusicMeta(localeData, randoms.music)
    };
}

function createSongMusic(song) {
    return generateMusic(createMusicParams(song));
}

function createMusicParams({ region, seed, index, musicMeta, lyrics }) {
    return { region, seed, index, tempo: musicMeta.tempo, durationSeconds: getMusicDuration(lyrics), lyrics };
}

function getMusicDuration(lyrics) {
    return Math.max(32, getLyricsDurationSeconds(lyrics) + 3);
}

function createCoverUrl({ region, seed, index }) {
    return `/api/cover?region=${region}&seed=${seed}&index=${index}`;
}
