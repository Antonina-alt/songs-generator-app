import { createRng } from '@/lib/randomGenerator';
import { generateSong } from '@/lib/generateSong';
import { createCoverSvg } from '@/lib/cover/svg';
import { createErrorResponse, parseCoverParams } from '@/lib/api/params';

export function GET(request) {
    try {
        const params = parseCoverParams(request);
        return createSvgResponse(createSongCoverSvg(params));
    } catch (error) {
        return createErrorResponse(error);
    }
}

function createSongCoverSvg(params) {
    const song = generateSong({ ...params, likes: 0 });
    return createCoverSvg({ song, random: createCoverRandom(params) });
}

function createCoverRandom({ region, seed, index }) {
    return createRng('cover-art', region, seed, index);
}

function createSvgResponse(svg) {
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
