import { pickRandom } from '../randomGenerator';

export function pickValue(array, random, fallback = '') {
    if (!Array.isArray(array) || array.length === 0) return fallback;
    return pickRandom(array, random);
}

export function renderPattern(pattern, values) {
    return pattern.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}
