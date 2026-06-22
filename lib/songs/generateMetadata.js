import { randomInt } from '../randomGenerator';
import { pickValue } from './text';

export function generateCoverMeta(localeData, random) {
    const { cover } = localeData;
    return createCoverMeta(cover, random);
}

export function generateMusicMeta(localeData, random) {
    const tempoRange = pickTempoRange(localeData.music, random);
    return createMusicMeta(localeData.music, tempoRange, random);
}

function createCoverMeta(cover, random) {
    return {
        paletteName: pickValue(cover.paletteNames, random),
        visualMotif: pickValue(cover.visualMotifs, random),
        layoutStyle: pickValue(cover.layoutStyles, random)
    };
}

function pickTempoRange(music, random) {
    return pickValue(music.tempoRanges, random, getDefaultTempoRange());
}

function createMusicMeta(music, tempoRange, random) {
    return {
        mood: pickValue(music.moods, random),
        instrument: pickValue(music.instruments, random),
        tempoRangeLabel: tempoRange.label,
        tempo: randomInt(tempoRange.min, tempoRange.max, random)
    };
}

function getDefaultTempoRange() {
    return { label: 'medium', min: 96, max: 125 };
}
