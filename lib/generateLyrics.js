import { createRng, pickRandom } from './randomGenerator';

const LINE_DURATION_SECONDS = 3;

export function generateLyrics({ localeData, region, seed, index }) {
    const random = createRng('lyrics', region, seed, index);
    const lyrics = getLyricsData(localeData);
    const lines = createLyricsLines(lyrics, random);

    return createTimedLyrics(lines);
}

function getLyricsData(localeData) {
    return localeData.lyrics || getFallbackLyrics();
}

function createLyricsLines(lyrics, random) {
    return [
        pickRandom(lyrics.openings, random),
        pickRandom(lyrics.middles, random),
        pickRandom(lyrics.choruses, random),
        pickRandom(lyrics.choruses, random),
        pickRandom(lyrics.openings, random),
        pickRandom(lyrics.middles, random),
        pickRandom(lyrics.choruses, random),
        pickRandom(lyrics.endings, random)
    ];
}

function createTimedLyrics(lines) {
    return lines.map((text, lineIndex) => ({
        time: lineIndex * LINE_DURATION_SECONDS,
        text
    }));
}

function getFallbackLyrics() {
    return {
        openings: ['Silent lights are moving through the night'],
        middles: ['and every sound is fading into blue'],
        choruses: ['Hold on, hold on, we are still alive'],
        endings: ['until the morning finds us again']
    };
}