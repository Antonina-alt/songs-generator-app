import { NextResponse } from 'next/server';
import { generateBatch } from '@/lib/generateBatch';
import { DEFAULT_LIKES, DEFAULT_PAGE, DEFAULT_REGION, DEFAULT_SEED, SONGS_PAGE_SIZE } from '@/lib/songs/constants';

export function GET(request) {
    const params = getSongsParams(request);
    return NextResponse.json(createSongsResponse(params));
}

function getSongsParams(request) {
    const searchParams = getSearchParams(request);
    return {
        region: searchParams.get('region') || DEFAULT_REGION,
        seed: searchParams.get('seed') || DEFAULT_SEED,
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
