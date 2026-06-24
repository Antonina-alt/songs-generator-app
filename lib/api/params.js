import { NextResponse } from 'next/server';
import { DEFAULT_REGION, DEFAULT_SEED } from '@/lib/songs/constants';
import { isValidSeed64 } from '@/lib/randomGenerator';

export function getSearchParams(request) {
    return new URL(request.url).searchParams;
}

export function getRegionParam(searchParams) {
    return searchParams.get('region') || DEFAULT_REGION;
}

export function getSeedParam(searchParams) {
    const seed = searchParams.get('seed') || DEFAULT_SEED;
    validateSeed(seed);
    return seed;
}

export function getNumberParam(searchParams, name, fallback) {
    return Number(searchParams.get(name) || fallback);
}

export function createErrorResponse(error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
}

function validateSeed(seed) {
    if (!isValidSeed64(seed)) throw new Error(getSeedErrorMessage());
}

function getSeedErrorMessage() {
    return 'Invalid seed. Seed must be a 64-bit unsigned integer.';
}

function getErrorMessage(error) {
    return error.message || 'Failed to process request';
}
