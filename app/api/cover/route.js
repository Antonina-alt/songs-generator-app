import { createRng } from '@/lib/randomGenerator';
import { generateSong } from '@/lib/generateSong';
import { createCoverSvg } from '@/lib/cover/svg';
import { DEFAULT_REGION, DEFAULT_SEED } from '@/lib/songs/constants';

export function GET(request) {
    const params = getCoverParams(request);
    const song = generateSong({ ...params, likes: 0 });
    return createSvgResponse(createCoverSvg({ song, random: createCoverRandom(params) }));
}

function getCoverParams(request) {
    const searchParams = new URL(request.url).searchParams;
    return {
        region: searchParams.get('region') || DEFAULT_REGION,
        seed: searchParams.get('seed') || DEFAULT_SEED,
        index: Number(searchParams.get('index') || '1')
    };
}

function createCoverRandom({ region, seed, index }) {
    return createRng('cover', region, seed, index);
}

function createSvgResponse(svg) {
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
