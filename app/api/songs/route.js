import { NextResponse } from 'next/server';
import { generateBatch } from '@/lib/generateBatch';
import { DEFAULT_LIKES, DEFAULT_PAGE, DEFAULT_REGION, DEFAULT_SEED, SONGS_PAGE_SIZE } from '@/lib/songs/constants';
import { isValidSeed64 } from '@/lib/randomGenerator';


export function GET(request) {
    try {
        const params = getSongsParams(request);
        return NextResponse.json(createSongsResponse(params));
    } catch (error) {
        return Response.json(
            { message: error.message || 'Failed to generate songs' },
            { status: 400 }
        );
    }
}

function getSongsParams(request) {
    const searchParams = getSearchParams(request);
    const seed = searchParams.get('seed') || DEFAULT_SEED;
    if (!isValidSeed64(seed)) {
        throw new Error('Invalid seed. Seed must be a 64-bit unsigned integer.');
    }
    return {
        region: searchParams.get('region') || DEFAULT_REGION,
        seed,
        page: getNumberParam(searchParams, 'page', DEFAULT_PAGE),
        pageSize: getNumberParam(searchParams, 'pageSize', SONGS_PAGE_SIZE),
        likes: getNumberParam(searchParams, 'likes', DEFAULT_LIKES)
    };
}

function createSongsResponse(params) {
    return {
        page: params.page,
        pageSize: params.pageSize,
        items: generateBatch(params)
    };
}

function getSearchParams(request) {
    return new URL(request.url).searchParams;
}

function getNumberParam(searchParams, name, fallback) {
    return Number(searchParams.get(name) || fallback);
}
