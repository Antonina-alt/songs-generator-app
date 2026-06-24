import { renderBackground } from './backgrounds';
import { renderFrame } from './frames';
import { renderMotif } from './motifs';
import { renderTexture } from './textures';
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
    return [renderTypographyClipDef(context), renderTypographyClipGroup(context)].join('');
}

function renderTypographyClipDef(context) {
    return ['<defs>', renderClipPath(context), '</defs>'].join('');
}

function renderTypographyClipGroup(context) {
    return [`<g clip-path="url(#${createClipId(context)})">`, renderTypography(context), '</g>'].join('');
}

function renderClipPath(context) {
    return [`<clipPath id="${createClipId(context)}">`, renderSafeAreaRect(context.safeArea), '</clipPath>'].join('');
}

function renderSafeAreaRect({ x, y, width, height }) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" />`;
}

function createClipId({ song }) {
    return `text-clip-${song.index}`;
}
