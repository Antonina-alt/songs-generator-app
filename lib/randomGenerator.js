import prand from 'pure-rand';

function hashStringToNumber(value) {
    let hash = 2166136261;

    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

export function createRng(...parts) {
    const seedString = parts.join(':');
    const seed = hashStringToNumber(seedString);

    let rng = prand.xoroshiro128plus(seed);

    return function random() {
        const [result, nextRng] = prand.uniformIntDistribution(0, 1_000_000_000, rng);
        rng = nextRng;
        return result / 1_000_000_000;
    };
}

export function pickRandom(array, random) {
    const index = Math.floor(random() * array.length);
    return array[index];
}

export function randomInt(min, max, random) {
    return Math.floor(random() * (max - min + 1)) + min;
}