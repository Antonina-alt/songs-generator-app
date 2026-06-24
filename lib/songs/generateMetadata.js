import { pickRandom, randomInt } from '@/lib/randomGenerator';
import { generateCoverMeta as createCoverMeta } from '@/lib/cover/generateCoverMeta';

export function generateCoverMeta(_localeData, random) {
    return createCoverMeta(random);
}

export function generateMusicMeta(localeData, random) {
    const tempoRange = pickTempoRange(localeData.music, random);

    return {
        mood: pickValue(localeData.music.moods, random),
        instrument: pickValue(localeData.music.instruments, random),
        tempoRangeLabel: tempoRange.label,
        tempo: randomInt(tempoRange.min, tempoRange.max, random)
    };
}

function pickTempoRange(music, random) {
    return pickValue(music.tempoRanges, random, getDefaultTempoRange());
}

function getDefaultTempoRange() {
    return {
        label: 'medium',
        min: 96,
        max: 125
    };
}

function pickValue(array, random, fallback = '') {
    if (!Array.isArray(array) || array.length === 0) return fallback;
    return pickRandom(array, random);
}