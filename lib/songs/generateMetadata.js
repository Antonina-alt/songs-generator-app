import { pickRandom, randomInt } from '@/lib/randomGenerator';
import { generateCoverMeta as createCoverMeta } from '@/lib/cover/generateCoverMeta';
import { TEMPO_RANGES } from '@/lib/music/constants';

export function generateCoverMeta(_localeData, random) {
    return createCoverMeta(random);
}

export function generateTempo(random) {
    const tempoRange = pickTempoRange(random);
    return randomInt(tempoRange.min, tempoRange.max, random);
}

function pickTempoRange(random) {
    return pickValue(TEMPO_RANGES, random, getDefaultTempoRange());
}

function getDefaultTempoRange() {
    return TEMPO_RANGES.find((range) => range.label === 'medium') || TEMPO_RANGES[0];
}

function pickValue(array, random, fallback = '') {
    if (!Array.isArray(array) || array.length === 0) return fallback;
    return pickRandom(array, random);
}