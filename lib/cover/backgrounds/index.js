import { randomInt } from '@/lib/randomGenerator';
import { renderLowPolyBackground } from './lowPoly';

const BACKGROUND_RENDERERS = {
    smooth_gradient: renderSmoothGradient,
    radial_spotlight: renderRadialSpotlight,
    split_blocks: renderSplitBlocks,
    low_poly: renderLowPolyBackground,
    large_cutout_shapes: renderLargeCutoutShapes,
    wave_layers: renderWaveLayers,
    sun_and_horizon: renderSunAndHorizon,
    offset_rectangles: renderOffsetRectangles,
    diagonal_fields: renderDiagonalFields,
    concentric_rings: renderConcentricRings
};

export function renderBackground(context) {
    const renderer = BACKGROUND_RENDERERS[context.background.id] ?? renderSmoothGradient;
    return renderer(context);
}

function renderSmoothGradient({ width, height, palette }) {
    return [
        '<defs>',
        '<linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">',
        `<stop offset="0%" stop-color="${palette.primary}" />`,
        `<stop offset="55%" stop-color="${palette.background}" />`,
        `<stop offset="100%" stop-color="${palette.muted}" />`,
        '</linearGradient>',
        '</defs>',
        `<rect width="${width}" height="${height}" fill="url(#cover-bg)" />`
    ].join('');
}

function renderRadialSpotlight({ width, height, palette, random }) {
    const cx = randomInt(180, 420, random);
    const cy = randomInt(150, 390, random);

    return [
        '<defs>',
        `<radialGradient id="cover-bg" cx="${cx / width}" cy="${cy / height}" r="0.8">`,
        `<stop offset="0%" stop-color="${palette.secondary}" />`,
        `<stop offset="50%" stop-color="${palette.primary}" />`,
        `<stop offset="100%" stop-color="${palette.background}" />`,
        '</radialGradient>',
        '</defs>',
        `<rect width="${width}" height="${height}" fill="url(#cover-bg)" />`
    ].join('');
}

function renderSplitBlocks({ width, height, palette, random }) {
    const splitX = randomInt(180, 420, random);

    return [
        `<rect width="${width}" height="${height}" fill="${palette.background}" />`,
        `<rect x="0" y="0" width="${splitX}" height="${height}" fill="${palette.primary}" opacity="0.86" />`,
        `<rect x="${splitX}" y="0" width="${width - splitX}" height="${height}" fill="${palette.muted}" />`,
        `<circle cx="${splitX}" cy="${randomInt(170, 430, random)}" r="${randomInt(110, 230, random)}" fill="${palette.secondary}" opacity="0.34" />`
    ].join('');
}

function renderLargeCutoutShapes({ width, height, palette, random }) {
    const shapes = Array.from({ length: 7 }, () => renderCutoutShape({ width, height, palette, random }));

    return `<rect width="${width}" height="${height}" fill="${palette.background}" />${shapes.join('')}`;
}

function renderCutoutShape({ width, height, palette, random }) {
    const colors = [palette.primary, palette.secondary, palette.accent, palette.muted];
    const color = colors[randomInt(0, colors.length - 1, random)];
    const x = randomInt(-80, width - 60, random);
    const y = randomInt(-80, height - 60, random);
    const size = randomInt(90, 260, random);
    const rotation = randomInt(-28, 28, random);

    if (random() > 0.5) {
        return `<rect x="${x}" y="${y}" width="${size}" height="${size * 0.72}" rx="${randomInt(12, 70, random)}" fill="${color}" opacity="0.72" transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})" />`;
    }

    return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2}" fill="${color}" opacity="0.68" />`;
}

function renderWaveLayers({ width, height, palette, random }) {
    const layers = Array.from({ length: 5 }, (_, index) =>
        renderWaveLayer({ width, height, palette, random, index })
    );

    return `<rect width="${width}" height="${height}" fill="${palette.background}" />${layers.join('')}`;
}

function renderWaveLayer({ width, height, palette, random, index }) {
    const y = 170 + index * 78;
    const amplitude = randomInt(28, 72, random);
    const color = [palette.primary, palette.secondary, palette.accent, palette.muted][index % 4];

    return `<path d="M 0 ${y} C 120 ${y - amplitude}, 220 ${y + amplitude}, 340 ${y} S 520 ${y - amplitude}, ${width} ${y + amplitude} L ${width} ${height} L 0 ${height} Z" fill="${color}" opacity="${0.28 + index * 0.08}" />`;
}

function renderSunAndHorizon({ width, height, palette, random }) {
    const sunX = randomInt(170, 430, random);
    const sunY = randomInt(150, 280, random);
    const radius = randomInt(58, 112, random);
    const horizonY = randomInt(340, 470, random);

    return [
        `<rect width="${width}" height="${height}" fill="${palette.background}" />`,
        `<circle cx="${sunX}" cy="${sunY}" r="${radius}" fill="${palette.secondary}" opacity="0.9" />`,
        `<rect x="0" y="${horizonY}" width="${width}" height="${height - horizonY}" fill="${palette.muted}" opacity="0.88" />`,
        `<line x1="0" y1="${horizonY}" x2="${width}" y2="${horizonY}" stroke="${palette.text}" stroke-width="3" opacity="0.35" />`
    ].join('');
}

function renderOffsetRectangles({ width, height, palette, random }) {
    const rects = Array.from({ length: 12 }, () => {
        const x = randomInt(-50, width - 80, random);
        const y = randomInt(-50, height - 80, random);
        const w = randomInt(80, 260, random);
        const h = randomInt(40, 180, random);
        const colors = [palette.primary, palette.secondary, palette.accent, palette.muted];
        const color = colors[randomInt(0, colors.length - 1, random)];

        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="0.35" transform="rotate(${randomInt(-18, 18, random)} ${x + w / 2} ${y + h / 2})" />`;
    });

    return `<rect width="${width}" height="${height}" fill="${palette.background}" />${rects.join('')}`;
}

function renderDiagonalFields({ width, height, palette }) {
    return [
        `<rect width="${width}" height="${height}" fill="${palette.background}" />`,
        `<polygon points="0,0 420,0 180,600 0,600" fill="${palette.primary}" opacity="0.8" />`,
        `<polygon points="600,0 600,600 250,600 480,0" fill="${palette.secondary}" opacity="0.42" />`,
        `<polygon points="120,0 600,430 600,600 20,120" fill="${palette.accent}" opacity="0.22" />`
    ].join('');
}

function renderConcentricRings({ width, height, palette, random }) {
    const cx = randomInt(180, 420, random);
    const cy = randomInt(180, 420, random);
    const rings = [];

    for (let radius = 70; radius < 620; radius += 44) {
        rings.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${palette.secondary}" stroke-width="3" opacity="0.18" />`);
    }

    return `<rect width="${width}" height="${height}" fill="${palette.background}" />${rings.join('')}`;
}