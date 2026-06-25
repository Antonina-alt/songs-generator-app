import { NextResponse } from 'next/server';
import { z } from 'zod';
import localeManifest from '@/data/locales/manifest.json';
import { DEFAULT_LIKES, DEFAULT_PAGE, DEFAULT_REGION, DEFAULT_SEED, SONGS_PAGE_SIZE } from '@/lib/songs/constants';
import { seed64Schema } from '@/lib/seed/schema';

const optionalParam = (fallback) => (value) => isEmptyParam(value) ? fallback : value;

const regionSchema = z.preprocess(optionalParam(DEFAULT_REGION), z.string().transform(toSupportedRegion));
const seedSchema = z.preprocess(optionalParam(DEFAULT_SEED), seed64Schema.transform(String));
const pageSchema = createNumberSchema(DEFAULT_PAGE, z.number().int().min(1));
const pageSizeSchema = createNumberSchema(SONGS_PAGE_SIZE, z.number().int().min(1).max(100));
const likesSchema = createNumberSchema(DEFAULT_LIKES, z.number().min(0).max(10));

const songsParamsSchema = z.object({
    region: regionSchema,
    seed: seedSchema,
    page: pageSchema,
    pageSize: pageSizeSchema,
    likes: likesSchema
});

const coverParamsSchema = z.object({
    region: regionSchema,
    seed: seedSchema,
    page: pageSchema,
    index: pageSchema
});

export function parseSongsParams(request) {
    return parseSearchParams(request, songsParamsSchema);
}

export function parseCoverParams(request) {
    return parseSearchParams(request, coverParamsSchema);
}

export function createErrorResponse(error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
}

function createNumberSchema(fallback, schema) {
    return z.preprocess(optionalParam(fallback), z.coerce.number().pipe(schema));
}

function parseSearchParams(request, schema) {
    return schema.parse(Object.fromEntries(new URL(request.url).searchParams));
}

function toSupportedRegion(region) {
    if (localeManifest.regions.includes(region)) return region;
    return DEFAULT_REGION;
}

function getErrorMessage(error) {
    return error.issues?.[0]?.message || error.message || 'request.invalid';
}

function isEmptyParam(value) {
    return value === undefined || value === null || value === '';
}
