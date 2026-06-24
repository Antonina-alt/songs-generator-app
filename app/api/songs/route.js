import { NextResponse } from 'next/server';
import { generateBatch } from '@/lib/generateBatch';
import { createErrorResponse, parseSongsParams } from '@/lib/api/params';

export function GET(request) {
    try {
        const params = parseSongsParams(request);
        return NextResponse.json(createSongsResponse(params));
    } catch (error) {
        return createErrorResponse(error);
    }
}

function createSongsResponse(params) {
    return { page: params.page, pageSize: params.pageSize, items: generateBatch(params) };
}
