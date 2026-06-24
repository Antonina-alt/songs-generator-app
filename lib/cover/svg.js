import { renderBackground } from './backgrounds';
import { renderMotif } from './motifs';
import { renderTexture } from './textures';
import { renderFrame } from './frames';
import { renderTypography } from './typography';

const LAYER_RENDERERS = [renderBackground, renderMotif, renderTexture, renderFrame, renderClippedTypography];

export function createCoverSvg({ song, random }) {
    const context = createCoverContext(song, random);
    return renderSvg(renderLayers(context), context);
}

function createCoverContext(song, random) {
    return { song, random, ...createCanvasContext(song.coverMeta), ...createCoverMetaContext(song.coverMeta) };
}

function createCanvasContext({ canvas }) {
    return { canvas, width: canvas.width, height: canvas.height, safeArea: canvas.safeArea };
}

function createCoverMetaContext(meta) {
    const { palette, variant, background, motif, motifSettings, layout, texture, frame, typography } = meta;
    return { palette, variant, background, motif, motifSettings, layout, texture, frame, typography };
}

function renderLayers(context) {
    return LAYER_RENDERERS.map((renderLayer) => renderLayer(context));
}

function renderSvg(layers, { width, height }) {
    return [`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`, ...layers, '</svg>'].join('');
}

function renderClippedTypography(context) {
    const { safeArea } = context;
    const id = `text-clip-${context.song.index}`;

    return [
        '<defs>',
        `<clipPath id="${id}">`,
        `<rect x="${safeArea.x}" y="${safeArea.y}" width="${safeArea.width}" height="${safeArea.height}" />`,
        '</clipPath>',
        '</defs>',
        `<g clip-path="url(#${id})">`,
        renderTypography(context),
        '</g>'
    ].join('');
}
