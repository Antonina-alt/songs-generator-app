import { createRng, pickRandom } from './randomGenerator';

const LINE_DURATION_SECONDS = 3.4;
const LYRIC_SECTIONS = ['openings', 'middles', 'choruses', 'choruses', 'openings', 'middles', 'choruses', 'endings'];

export function generateLyrics({ localeData, region, seed, index }) {
    const random = createRng('lyrics', region, seed, index);
    return createTimedLyrics(createLyricsLines(localeData.lyrics, random));
}

export function getLyricsDurationSeconds(lyrics = []) {
    if (!lyrics.length) return 30;
    return getLastLyricLine(lyrics).time + LINE_DURATION_SECONDS;
}

function createLyricsLines(lyrics, random) {
    if (!lyrics) return [];
    return LYRIC_SECTIONS.map((section) => pickRandom(lyrics[section], random));
}

function createTimedLyrics(lines) {
    return lines.map((text, lineIndex) => createTimedLine(text, lineIndex));
}

function createTimedLine(text, lineIndex) {
    return { time: lineIndex * LINE_DURATION_SECONDS, text };
}

function getLastLyricLine(lyrics) {
    return lyrics[lyrics.length - 1];
}
