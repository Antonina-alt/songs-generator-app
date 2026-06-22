import { NextResponse } from 'next/server';
import { generateBatch } from '@/lib/generateBatch';

export function GET(request) {
    const params = getSongsParams(request);
    return NextResponse.json(createSongsResponse(params));
}

function getSongsParams(request) {
    const { searchParams } = new URL(request.url);
    return {
        region: searchParams.get('region') || 'en-US',
        seed: searchParams.get('seed') || '123456789',
        page: searchParams.get('page') || '1',
        pageSize: searchParams.get('pageSize') || '20',
        likes: searchParams.get('likes') || '3'
    };
}

function createSongsResponse(params) {
    return {
        page: Number(params.page),
        pageSize: Number(params.pageSize),
        items: generateBatch(params)
    };
}
