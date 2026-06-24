import { z } from 'zod';

export const MAX_UINT64 = (1n << 64n) - 1n;

const SEED_PATTERN = /^(?:\d+|0x[0-9a-f]+)$/i;

export const seed64Schema = z.preprocess(
    normalizeSeed,
    z.string().regex(SEED_PATTERN, getSeedFormatMessage()).transform(toBigInt).refine(isUint64, { message: getSeedRangeMessage() })
);

export function parseSeed64(seed) {
    return seed64Schema.parse(seed);
}

export function isValidSeed64(seed) {
    return seed64Schema.safeParse(seed).success;
}

export function getSeedFormatMessage() {
    return 'Seed must be a 64-bit unsigned integer, for example 123456789 or 0xFFFFFFFFFFFFFFFF';
}

export function getSeedRangeMessage() {
    return 'Seed must be between 0 and 18446744073709551615';
}

function normalizeSeed(seed) {
    return String(seed ?? '').trim();
}

function toBigInt(seed) {
    return BigInt(seed);
}

function isUint64(seed) {
    return seed >= 0n && seed <= MAX_UINT64;
}
