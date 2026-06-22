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

export function generateSong({ region, seed, index, likes }) {
    const localeData = loadLocaleData(region);
    const randoms = createSongRandoms({ region, seed, index, likes });
    const song = createSongFields({ localeData, region, randoms, likes });
    return createSong({ ...song, region, seed, index, lyrics: generateLyrics({ localeData, region, seed, index }) });
}

function createSongRandoms({ region, seed, index, likes }) {
    return {
        title: createRng('title', region, seed, index),
        artist: createRng('artist', region, seed, index),
        album: createRng('album', region, seed, index),
        genre: createRng('genre', region, seed, index),
        review: createRng('review', region, seed, index),
        cover: createRng('cover', region, seed, index),
        music: createRng('music-meta', region, seed, index),
        likes: createRng('likes', region, seed, index, likes)
    };
}

function createSongFields({ localeData, region, randoms, likes }) {
    const musicMeta = generateMusicMeta(localeData, randoms.music);
    return {
        title: generateSongTitle(localeData, randoms.title),
        artist: generateArtist(localeData, region, randoms.artist),
        album: generateAlbumTitle(localeData, randoms.album),
        genre: pickValue(localeData.genres, randoms.genre, 'Pop'),
        likes: generateLikes(likes, randoms.likes),
        review: generateReview(localeData, randoms.review),
        coverMeta: generateCoverMeta(localeData, randoms.cover),
        musicMeta
    };
}

function createSong(song) {
    return {
        ...song,
        music: createSongMusic(song),
        coverUrl: createCoverUrl(song)
    };
}

function createSongMusic({ region, seed, index, musicMeta }) {
    return generateMusic({ region, seed, index, tempo: musicMeta.tempo });
}

function createCoverUrl({ region, seed, index }) {
    return `/api/cover?region=${region}&seed=${seed}&index=${index}`;
}
