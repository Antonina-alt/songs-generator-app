import PRNG from 'xoshiro-js';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

const MAX_UINT64 = (1n << 64n) - 1n;
const UINT64_BYTES = 8;

function parseSeed64(seed) {
    const value = String(seed ?? '').trim();

    if (!value) {
        throw new Error('Seed is required');
    }

    const isDecimal = /^\d+$/.test(value);
    const isHex = /^0x[0-9a-f]+$/i.test(value);

    if (!isDecimal && !isHex) {
        throw new Error('Seed must be a 64-bit unsigned integer, for example 123456789 or 0xFFFFFFFFFFFFFFFF');
    }

    const seed64 = BigInt(value);

    if (seed64 < 0n || seed64 > MAX_UINT64) {
        throw new Error('Seed must be between 0 and 18446744073709551615');
    }

    return seed64;
}

function bytesToUint64(bytes) {
    let result = 0n;

    for (let i = 0; i < UINT64_BYTES; i++) {
        result = (result << 8n) | BigInt(bytes[i]);
    }

    return result;
}

function deriveScopedSeed64({ scope, region, seed, index, extra }) {
    const userSeed64 = parseSeed64(seed);

    const input = [
        scope,
        region,
        userSeed64.toString(),
        index,
        ...extra
    ].join(':');

    const hash = sha256(utf8ToBytes(input));

    return bytesToUint64(hash);
}

export function createRng(scope, region, seed, index, ...extra) {
    const scopedSeed = deriveScopedSeed64({ scope, region, seed, index, extra });
    const rng = new PRNG(scopedSeed);

    return function random() {
        return rng.getFloat64();
    };
}

export function pickRandom(array, random) {
    const index = Math.floor(random() * array.length);
    return array[index];
}

export function randomInt(min, max, random) {
    return Math.floor(random() * (max - min + 1)) + min;
}

export function isValidSeed64(seed) {
    try {
        parseSeed64(seed);
        return true;
    } catch {
        return false;
    }
}

export function createRandomSeed64() {
    const array = new BigUint64Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0].toString();
}