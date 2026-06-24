import { NextResponse } from 'next/server';
import { generateBatch } from '@/lib/generateBatch';
import { DEFAULT_LIKES, DEFAULT_PAGE, SONGS_PAGE_SIZE } from '@/lib/songs/constants';
import { createErrorResponse, getNumberParam, getRegionParam, getSearchParams, getSeedParam } from '@/lib/api/params';

export function GET(request) {
    try {
        const params = getSongsParams(request);
        return NextResponse.json(createSongsResponse(params));
    } catch (error) {
        return createErrorResponse(error);
    }
}

function getSongsParams(request) {
    const searchParams = getSearchParams(request);

    return {
        region: getRegionParam(searchParams),
        seed: getSeedParam(searchParams),
        page: getNumberParam(searchParams, 'page', DEFAULT_PAGE),
        pageSize: getNumberParam(searchParams, 'pageSize', SONGS_PAGE_SIZE),
        likes: getNumberParam(searchParams, 'likes', DEFAULT_LIKES)
    };
}

function createSongsResponse(params) {
    return { page: params.page, pageSize: params.pageSize, items: generateBatch(params) };
}
