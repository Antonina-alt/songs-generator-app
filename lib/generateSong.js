import { createRng } from './randomGenerator';
import { generateMusic } from './generateMusic';
import { generateLikes } from './generateLikes';
import { loadLocaleData } from './locales';
import { generateCoverMeta, generateTempo } from './songs/generateMetadata';
import { generateSongInfo, getLyricsDurationSeconds } from './songs/generateSongInfo';

const RANDOM_SCOPES = ['title', 'artist', 'album', 'genre', 'review', 'lyrics', 'cover', 'music', 'likes'];

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
    return { ...song, music: createSongMusic(song, context.localeData), coverUrl: createCoverUrl(song) };
}

function createSongData({ params, localeData, randoms }) {
    return { ...params, ...createSongInfo(params, localeData, randoms), ...createGeneratedFields(localeData, randoms, params.likes) };
}

function createSongInfo(params, localeData, randoms) {
    return generateSongInfo({ localeData, region: params.region, randoms });
}

function createSongRandoms({ region, seed, page, index, likes }) {
    return Object.fromEntries(
        RANDOM_SCOPES.map((name) => createRandomEntry(name, region, seed, page, index, likes))
    );
}

function createRandomEntry(name, region, seed, page, index, likes) {
    return [name, createSongRng(name, region, seed, page, index, likes)];
}

function createSongRng(name, region, seed, page, index, likes) {
    const pageIndex = createPageIndex(page, index);
    if (name === 'likes') {
        return createRng(name, region, seed, pageIndex, likes);
    }
    return createRng(getRandomScope(name), region, seed, pageIndex);
}

function createPageIndex(page, index) {
    return `${page}:${index}`;
}

function getRandomScope(name) {
    return name === 'music' ? 'music-meta' : name;
}

function createGeneratedFields(localeData, randoms, likes) {
    return {
        likes: generateLikes(likes, randoms.likes),
        coverMeta: generateCoverMeta(localeData, randoms.cover),
        tempo: generateTempo(randoms.music)
    };
}

function createSongMusic(song, localeData) {
    return generateMusic(createMusicParams(song, localeData));
}

function createMusicParams({ region, seed, page, index, tempo, lyrics }, localeData) {
    return { region, seed, page, index, tempo, durationSeconds: getMusicDuration(lyrics), lyrics, phonetics: localeData.phonetics };
}

function getMusicDuration(lyrics) {
    return Math.max(32, getLyricsDurationSeconds(lyrics) + 3);
}

function createCoverUrl({ region, seed, page, index }) {
    return `/api/cover?${createCoverQuery(region, seed, page, index)}`;
}

function createCoverQuery(region, seed, page, index) {
    return new URLSearchParams({region, seed, page: String(page), index: String(index)});
}
