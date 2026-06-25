export const MAX_UINT64 = (1n << 64n) - 1n;

export const SEED_ERROR_CODES = {
    invalidFormat: 'seed.invalidFormat',
    outOfRange: 'seed.outOfRange'
};

const SEED_PATTERN = /^(?:\d+|0x[0-9a-f]+)$/i;

export function parseSeed64(seed) {
    const normalizedSeed = normalizeSeed(seed);

    if (!SEED_PATTERN.test(normalizedSeed)) {
        throw createSeedError(SEED_ERROR_CODES.invalidFormat);
    }

    return parseUint64Seed(normalizedSeed);
}

export function isValidSeed64(seed) {
    try {
        parseSeed64(seed);
        return true;
    } catch {
        return false;
    }
}

export function normalizeSeed(seed) {
    return String(seed ?? '').trim();
}

function parseUint64Seed(seed) {
    const parsedSeed = BigInt(seed);

    if (!isUint64(parsedSeed)) {
        throw createSeedError(SEED_ERROR_CODES.outOfRange);
    }

    return parsedSeed;
}

function isUint64(seed) {
    return seed >= 0n && seed <= MAX_UINT64;
}

function createSeedError(message) {
    return new Error(message);
}
