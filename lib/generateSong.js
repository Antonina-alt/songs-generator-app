import { createRng } from './randomGenerator';
import { generateMusic } from './generateMusic';
import { generateLikes } from './generateLikes';
import { loadLocaleData } from './locales';
import { generateAlbumTitle } from './songs/generateAlbum';
import { generateArtist } from './songs/generateArtist';
import { generateCoverMeta, generateMusicMeta } from './songs/generateMetadata';
import { generateReview } from './songs/generateReview';
import { generateSongTitle } from './songs/generateTitle';
import { pickValue } from './songs/text';
import { generateLyrics } from './generateLyrics';

export function generateSong(params) {
    const localeData = loadLocaleData(params.region);
    const randoms = createSongRandoms(params);
    return createSong(createSongData(params, localeData, randoms));
}

function createSongData(params, localeData, randoms) {
    return {
        ...params,
        ...createSongFields({ localeData, region: params.region, randoms, likes: params.likes }),
        lyrics: generateLyrics({ ...params, localeData })
    };
}

function createSongRandoms({ region, seed, index, likes }) {
    return Object.fromEntries(createRandomNames().map((name) => [name, createSongRng(name, region, seed, index, likes)]));
}

function createRandomNames() {
    return ['title', 'artist', 'album', 'genre', 'review', 'cover', 'music', 'likes'];
}

function createSongRng(name, region, seed, index, likes) {
    const key = name === 'music' ? 'music-meta' : name;
    return name === 'likes' ? createRng(key, region, seed, index, likes) : createRng(key, region, seed, index);
}

function createSongFields(context) {
    return {
        ...createTextFields(context),
        ...createGeneratedFields(context)
    };
}

function createTextFields({ localeData, region, randoms }) {
    return {
        title: generateSongTitle(localeData, randoms.title),
        artist: generateArtist(localeData, region, randoms.artist),
        album: generateAlbumTitle(localeData, randoms.album),
        genre: pickValue(localeData.genres, randoms.genre, 'Pop')
    };
}

function createGeneratedFields({ localeData, randoms, likes }) {
    return {
        likes: generateLikes(likes, randoms.likes),
        review: generateReview(localeData, randoms.review),
        coverMeta: generateCoverMeta(localeData, randoms.cover),
        musicMeta: generateMusicMeta(localeData, randoms.music)
    };
}

function createSong(song) {
    return { ...song, music: createSongMusic(song), coverUrl: createCoverUrl(song) };
}

function createSongMusic({ region, seed, index, musicMeta }) {
    return generateMusic({ region, seed, index, tempo: musicMeta.tempo });
}

function createCoverUrl({ region, seed, index }) {
    return `/api/cover?region=${region}&seed=${seed}&index=${index}`;
}
