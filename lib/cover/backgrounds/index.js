import { randomInt } from '@/lib/randomGenerator';
import { renderLowPolyBackground } from './lowPoly';
import { createColorScheme, pickSchemeColor } from '../colors';

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

function renderSmoothGradient({ width, height, palette, variant }) {
    const [from, middle, to] = getPaletteScheme({ palette, variant });

    return [
        '<defs>',
        '<linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">',
        `<stop offset="0%" stop-color="${from}" />`,
        `<stop offset="55%" stop-color="${middle}" />`,
        `<stop offset="100%" stop-color="${to}" />`,
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

function renderSplitBlocks(context) {
    const { width, height, random } = context;
    const scheme = createColorScheme(context);
    const splitX = randomInt(180, 420, random);
    const circleY = randomInt(170, 430, random);
    const circleRadius = randomInt(110, 230, random);

    return [
        `<rect width="${width}" height="${height}" fill="${scheme.background}" />`,
        `<rect x="0" y="0" width="${splitX}" height="${height}" fill="${scheme.main}" opacity="0.86" />`,
        `<rect x="${splitX}" y="0" width="${width - splitX}" height="${height}" fill="${scheme.quiet}" opacity="0.95" />`,
        `<circle cx="${splitX}" cy="${circleY}" r="${circleRadius}" fill="${scheme.support}" opacity="0.34" />`,
        `<circle cx="${width - splitX}" cy="${height - circleY}" r="${circleRadius * 0.55}" fill="${scheme.highlight}" opacity="0.22" />`
    ].join('');
}

function renderLargeCutoutShapes(context) {
    const { width, height } = context;
    const scheme = createColorScheme(context);

    const shapes = Array.from({ length: 7 }, () =>
        renderCutoutShape({ ...context, scheme })
    );

    return `<rect width="${width}" height="${height}" fill="${scheme.background}" />${shapes.join('')}`;
}

function renderCutoutShape({ width, height, random, scheme }) {
    const color = pickSchemeColor(scheme, random);
    const x = randomInt(-80, width - 60, random);
    const y = randomInt(-80, height - 60, random);
    const size = randomInt(90, 260, random);
    const rotation = randomInt(-28, 28, random);
    const opacity = (0.46 + random() * 0.34).toFixed(2);

    if (random() > 0.5) {
        return [
            `<rect`,
            `x="${x}"`,
            `y="${y}"`,
            `width="${size}"`,
            `height="${size * 0.72}"`,
            `rx="${randomInt(12, 70, random)}"`,
            `fill="${color}"`,
            `opacity="${opacity}"`,
            `transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})"`,
            `/>`
        ].join(' ');
    }

    return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2}" fill="${color}" opacity="${opacity}" />`;
}

function renderWaveLayers(context) {
    const { width, height } = context;
    const scheme = createColorScheme(context);

    const layers = Array.from({ length: 5 }, (_, index) =>
        renderWaveLayer({ ...context, scheme, index })
    );

    return `<rect width="${width}" height="${height}" fill="${scheme.background}" />${layers.join('')}`;
}

function renderWaveLayer({ width, height, random, scheme, index }) {
    const y = 155 + index * 82;
    const amplitude = randomInt(28, 72, random);
    const color = scheme.colors[index % scheme.colors.length];
    const opacity = (0.26 + index * 0.09).toFixed(2);

    return [
        `<path`,
        `d="M 0 ${y}`,
        `C 120 ${y - amplitude}, 220 ${y + amplitude}, 340 ${y}`,
        `S 520 ${y - amplitude}, ${width} ${y + amplitude}`,
        `L ${width} ${height} L 0 ${height} Z"`,
        `fill="${color}"`,
        `opacity="${opacity}"`,
        `/>`
    ].join(' ');
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

function renderConcentricRings(context) {
    const { width, height, random } = context;
    const scheme = createColorScheme(context);
    const cx = randomInt(180, 420, random);
    const cy = randomInt(180, 420, random);
    const rings = [];

    for (let radius = 70; radius < 620; radius += 44) {
        const color = scheme.colors[Math.floor(radius / 44) % scheme.colors.length];
        const strokeWidth = radius % 88 === 0 ? 4 : 2;

        rings.push(
            `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="0.18" />`
        );
    }

    return `<rect width="${width}" height="${height}" fill="${scheme.background}" />${rings.join('')}`;
}

function getPaletteScheme({ palette, variant }) {
    const schemes = [
        [palette.primary, palette.secondary, palette.accent],
        [palette.background, palette.primary, palette.secondary],
        [palette.muted, palette.primary, palette.accent],
        [palette.secondary, palette.accent, palette.background],
        [palette.accent, palette.primary, palette.muted],
        [palette.primary, palette.accent, palette.text]
    ];

    return schemes[(variant - 1) % schemes.length];
}