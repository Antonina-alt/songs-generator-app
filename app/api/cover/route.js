import { createRng } from '@/lib/randomGenerator';
import { generateSong } from '@/lib/generateSong';
import { createCoverSvg } from '@/lib/cover/svg';

export function GET(request) {
    const params = getCoverParams(request);
    const song = generateSong({ ...params, likes: 0 });
    const random = createRng('cover', params.region, params.seed, params.index);
    return createSvgResponse(createCoverSvg({ song, random }));
}

function getCoverParams(request) {
    const { searchParams } = new URL(request.url);
    return {
        region: searchParams.get('region') || 'en-US',
        seed: searchParams.get('seed') || '123456789',
        index: Number(searchParams.get('index') || '1')
    };
}

function createSvgResponse(svg) {
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
