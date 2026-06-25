import PRNG from 'xoshiro-js';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
import { parseSeed64 } from './seed/validation';

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

export function createRandomSeed64() {
    const array = new BigUint64Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0].toString();
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
