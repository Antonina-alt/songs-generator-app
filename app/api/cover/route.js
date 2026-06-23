import { createRng } from '@/lib/randomGenerator';
import { generateSong } from '@/lib/generateSong';
import { createCoverSvg } from '@/lib/cover/svg';
import { DEFAULT_REGION, DEFAULT_SEED } from '@/lib/songs/constants';
import { isValidSeed64 } from '@/lib/randomGenerator';
import {NextResponse} from "next/server";

export function GET(request) {
    try {
        const params = getCoverParams(request);
        const song = generateSong({ ...params, likes: 0 });
        return createSvgResponse(createCoverSvg({ song, random: createCoverRandom(params) }));
    } catch (error) {
        return Response.json(
            { message: error.message || 'Failed to generate songs' },
            { status: 400 }
        );
    }
}

function getCoverParams(request) {
    const searchParams = new URL(request.url).searchParams;
    const seed = searchParams.get('seed') || DEFAULT_SEED;
    if (!isValidSeed64(seed)) {
        throw new Error('Invalid seed. Seed must be a 64-bit unsigned integer.');
    }
    return {
        region: searchParams.get('region') || DEFAULT_REGION,
        seed,
        index: Number(searchParams.get('index') || '1')
    };
}

function createCoverRandom({ region, seed, index }) {
    return createRng('cover', region, seed, index);
}

function createSvgResponse(svg) {
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
