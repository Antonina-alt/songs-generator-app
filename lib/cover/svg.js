import { renderBackground } from './backgrounds';
import { renderMotif } from './motifs';
import { renderTexture } from './textures';
import { renderFrame } from './frames';
import { renderTypography } from './typography';

export function createCoverSvg({ song, random }) {
    const context = createCoverContext(song, random);

    return renderSvg([
        renderBackground(context),
        renderMotif(context),
        renderTexture(context),
        renderFrame(context),
        renderTypography(context)
    ], context);
}

function createCoverContext(song, random) {
    const canvas = song.coverMeta.canvas;
    const palette = song.coverMeta.palette;

    return {
        song,
        random,
        canvas,
        palette,
        background: song.coverMeta.background,
        motif: song.coverMeta.motif,
        motifSettings: song.coverMeta.motifSettings,
        layout: song.coverMeta.layout,
        texture: song.coverMeta.texture,
        frame: song.coverMeta.frame,
        typography: song.coverMeta.typography,
        effect: song.coverMeta.effect,
        rough: song.coverMeta.rough,
        width: canvas.width,
        height: canvas.height,
        safeArea: canvas.safeArea
    };
}

function renderSvg(layers, { width, height }) {
    return [
        `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`,
        ...layers,
        '</svg>'
    ].join('');
}