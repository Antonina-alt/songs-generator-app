import { pickRandom } from '../randomGenerator';

export function pickValue(array, random, fallback = '') {
    if (!Array.isArray(array) || array.length === 0) return fallback;
    return pickRandom(array, random);
}
