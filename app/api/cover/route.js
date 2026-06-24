import { createRng } from '@/lib/randomGenerator';
import { generateSong } from '@/lib/generateSong';
import { createCoverSvg } from '@/lib/cover/svg';
import { DEFAULT_PAGE } from '@/lib/songs/constants';
import { createErrorResponse, getNumberParam, getRegionParam, getSearchParams, getSeedParam } from '@/lib/api/params';

export function GET(request) {
    try {
        const params = getCoverParams(request);
        const svg = createSongCoverSvg(params);
        return createSvgResponse(svg);
    } catch (error) {
        return createErrorResponse(error);
    }
}

function getCoverParams(request) {
    const searchParams = getSearchParams(request);

    return {
        region: getRegionParam(searchParams),
        seed: getSeedParam(searchParams),
        index: getNumberParam(searchParams, 'index', DEFAULT_PAGE)
    };
}

function createSongCoverSvg(params) {
    const song = generateSong({ ...params, likes: 0 });
    return createCoverSvg({ song, random: createCoverRandom(params) });
}

function createCoverRandom({ region, seed, index }) {
    return createRng('cover', region, seed, index);
}

function createSvgResponse(svg) {
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
