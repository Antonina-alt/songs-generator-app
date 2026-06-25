import { z } from 'zod';
import { MAX_UINT64, SEED_ERROR_CODES, normalizeSeed } from './validation';

const SEED_PATTERN = /^(?:\d+|0x[0-9a-f]+)$/i;

export const seed64Schema = z.preprocess(
    normalizeSeed,
    z.string()
        .regex(SEED_PATTERN, SEED_ERROR_CODES.invalidFormat)
        .transform(toBigInt)
        .refine(isUint64, { message: SEED_ERROR_CODES.outOfRange })
);

function toBigInt(seed) {
    return BigInt(seed);
}

function isUint64(seed) {
    return seed >= 0n && seed <= MAX_UINT64;
}
