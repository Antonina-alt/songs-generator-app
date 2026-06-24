import PRNG from 'xoshiro-js';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

const MAX_UINT64 = (1n << 64n) - 1n;
const UINT64_BYTES = 8;

export function createRng(scope, region, seed, index, ...extra) {
    const scopedSeed = deriveScopedSeed64({ scope, region, seed, index, extra });
    const rng = new PRNG(scopedSeed);
    return () => rng.getFloat64();
}

export function pickRandom(array, random) {
    return array[Math.floor(random() * array.length)];
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

function parseSeed64(seed) {
    const value = normalizeSeed(seed);
    validateSeedFormat(value);
    return validateSeedRange(BigInt(value));
}

function normalizeSeed(seed) {
    const value = String(seed ?? '').trim();
    if (!value) throw new Error('Seed is required');
    return value;
}

function validateSeedFormat(value) {
    if (!isDecimalSeed(value) && !isHexSeed(value)) throw new Error(getSeedFormatError());
}

function validateSeedRange(seed64) {
    if (seed64 < 0n || seed64 > MAX_UINT64) throw new Error(getSeedRangeError());
    return seed64;
}

function deriveScopedSeed64({ scope, region, seed, index, extra }) {
    return bytesToUint64(sha256(utf8ToBytes(createSeedInput(scope, region, seed, index, extra))));
}

function createSeedInput(scope, region, seed, index, extra) {
    return [scope, region, parseSeed64(seed).toString(), index, ...extra].join(':');
}

function bytesToUint64(bytes) {
    return bytes.slice(0, UINT64_BYTES).reduce(appendByte, 0n);
}

function appendByte(result, byte) {
    return (result << 8n) | BigInt(byte);
}

function isDecimalSeed(value) {
    return /^\d+$/.test(value);
}

function isHexSeed(value) {
    return /^0x[0-9a-f]+$/i.test(value);
}

function getSeedFormatError() {
    return 'Seed must be a 64-bit unsigned integer, for example 123456789 or 0xFFFFFFFFFFFFFFFF';
}

function getSeedRangeError() {
    return 'Seed must be between 0 and 18446744073709551615';
}
