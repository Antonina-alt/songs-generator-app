import { randomInt } from '@/lib/randomGenerator';
import { createColorScheme, pickSchemeColor } from '../colors';
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

const PALETTE_SCHEMES = [
    ['primary', 'secondary', 'accent'],
    ['background', 'primary', 'secondary'],
    ['muted', 'primary', 'accent'],
    ['secondary', 'accent', 'background'],
    ['accent', 'primary', 'muted'],
    ['primary', 'accent', 'text']
];

export function renderBackground(context) {
    return getBackgroundRenderer(context.background.id)(context);
}

function getBackgroundRenderer(backgroundId) {
    return BACKGROUND_RENDERERS[backgroundId] ?? renderSmoothGradient;
}

function renderSmoothGradient(context) {
    const colors = getPaletteScheme(context);
    return [renderGradientDefs(renderLinearStops(colors)), renderCanvasRect(context, 'url(#cover-bg)')].join('');
}

function renderRadialSpotlight(context) {
    const origin = createRadialOrigin(context);
    return [renderGradientDefs(renderRadialStops(context.palette, origin)), renderCanvasRect(context, 'url(#cover-bg)')].join('');
}

function renderSplitBlocks(context) {
    const geometry = createSplitGeometry(context);
    return [renderCanvasRect(context, geometry.scheme.background), ...renderSplitLayers(context, geometry)].join('');
}

function renderLargeCutoutShapes(context) {
    const scheme = createColorScheme(context);
    return [renderCanvasRect(context, scheme.background), ...renderCutoutShapes(context, scheme)].join('');
}

function renderWaveLayers(context) {
    const scheme = createColorScheme(context);
    return [renderCanvasRect(context, scheme.background), ...createRange(5).map((index) => renderWaveLayer(context, scheme, index))].join('');
}

function renderSunAndHorizon(context) {
    const geometry = createSunHorizonGeometry(context);
    return [renderCanvasRect(context, context.palette.background), renderSun(context, geometry), renderHorizonBlock(context, geometry), renderHorizonLine(context, geometry)].join('');
}

function renderOffsetRectangles(context) {
    return [renderCanvasRect(context, context.palette.background), ...createRange(12).map(() => renderOffsetRectangle(context))].join('');
}

function renderDiagonalFields(context) {
    return [renderCanvasRect(context, context.palette.background), renderPolygon('0,0 420,0 180,600 0,600', context.palette.primary, 0.8), renderPolygon('600,0 600,600 250,600 480,0', context.palette.secondary, 0.42), renderPolygon('120,0 600,430 600,600 20,120', context.palette.accent, 0.22)].join('');
}

function renderConcentricRings(context) {
    const scheme = createColorScheme(context);
    const center = createRingCenter(context.random);
    return [renderCanvasRect(context, scheme.background), ...createRingRadii().map((radius) => renderRing(center, radius, scheme))].join('');
}

function renderLinearStops([from, middle, to]) {
    return ['<linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">', renderStop(0, from), renderStop(55, middle), renderStop(100, to), '</linearGradient>'].join('');
}

function renderRadialStops(palette, { cx, cy }) {
    return [`<radialGradient id="cover-bg" cx="${cx}" cy="${cy}" r="0.8">`, renderStop(0, palette.secondary), renderStop(50, palette.primary), renderStop(100, palette.background), '</radialGradient>'].join('');
}

function renderGradientDefs(content) {
    return `<defs>${content}</defs>`;
}

function renderStop(offset, color) {
    return `<stop offset="${offset}%" stop-color="${color}" />`;
}

function createRadialOrigin({ width, height, random }) {
    return { cx: randomInt(180, 420, random) / width, cy: randomInt(150, 390, random) / height };
}

function createSplitGeometry(context) {
    return { scheme: createColorScheme(context), splitX: randomInt(180, 420, context.random), circleY: randomInt(170, 430, context.random), circleRadius: randomInt(110, 230, context.random) };
}

function renderSplitLayers(context, geometry) {
    return [renderSplitLeft(context, geometry), renderSplitRight(context, geometry), renderSplitCircle(context, geometry), renderSplitAccentCircle(context, geometry)];
}

function renderSplitLeft({ height }, { scheme, splitX }) {
    return `<rect x="0" y="0" width="${splitX}" height="${height}" fill="${scheme.main}" opacity="0.86" />`;
}

function renderSplitRight({ width, height }, { scheme, splitX }) {
    return `<rect x="${splitX}" y="0" width="${width - splitX}" height="${height}" fill="${scheme.quiet}" opacity="0.95" />`;
}

function renderSplitCircle(_, { scheme, splitX, circleY, circleRadius }) {
    return `<circle cx="${splitX}" cy="${circleY}" r="${circleRadius}" fill="${scheme.support}" opacity="0.34" />`;
}

function renderSplitAccentCircle({ width, height }, { scheme, splitX, circleY, circleRadius }) {
    return `<circle cx="${width - splitX}" cy="${height - circleY}" r="${circleRadius * 0.55}" fill="${scheme.highlight}" opacity="0.22" />`;
}

function renderCutoutShapes(context, scheme) {
    return createRange(7).map(() => renderCutoutShape(createCutoutShape(context, scheme)));
}

function createCutoutShape({ width, height, random }, scheme) {
    const size = randomInt(90, 260, random);
    return { color: pickSchemeColor(scheme, random), x: randomInt(-80, width - 60, random), y: randomInt(-80, height - 60, random), size, rotation: randomInt(-28, 28, random), opacity: (0.46 + random() * 0.34).toFixed(2), radius: randomInt(12, 70, random), isRect: random() > 0.5 };
}

function renderCutoutShape(shape) {
    return shape.isRect ? renderCutoutRect(shape) : renderCutoutCircle(shape);
}

function renderCutoutRect(shape) {
    return `<rect x="${shape.x}" y="${shape.y}" width="${shape.size}" height="${shape.size * 0.72}" rx="${shape.radius}" fill="${shape.color}" opacity="${shape.opacity}" transform="${createShapeRotation(shape)}" />`;
}

function renderCutoutCircle({ x, y, size, color, opacity }) {
    return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2}" fill="${color}" opacity="${opacity}" />`;
}

function renderWaveLayer({ width, height, random }, scheme, index) {
    const y = 155 + index * 82;
    return renderWavePath(width, height, y, createWaveAmplitude(random), scheme.colors[index % scheme.colors.length], (0.26 + index * 0.09).toFixed(2));
}

function createWaveAmplitude(random) {
    return randomInt(28, 72, random);
}

function renderWavePath(width, height, y, amplitude, color, opacity) {
    return `<path d="M 0 ${y} C 120 ${y - amplitude}, 220 ${y + amplitude}, 340 ${y} S 520 ${y - amplitude}, ${width} ${y + amplitude} L ${width} ${height} L 0 ${height} Z" fill="${color}" opacity="${opacity}" />`;
}

function createSunHorizonGeometry({ random }) {
    return { sunX: randomInt(170, 430, random), sunY: randomInt(150, 280, random), radius: randomInt(58, 112, random), horizonY: randomInt(340, 470, random) };
}

function renderSun({ palette }, { sunX, sunY, radius }) {
    return `<circle cx="${sunX}" cy="${sunY}" r="${radius}" fill="${palette.secondary}" opacity="0.9" />`;
}

function renderHorizonBlock({ width, height, palette }, { horizonY }) {
    return `<rect x="0" y="${horizonY}" width="${width}" height="${height - horizonY}" fill="${palette.muted}" opacity="0.88" />`;
}

function renderHorizonLine({ width, palette }, { horizonY }) {
    return `<line x1="0" y1="${horizonY}" x2="${width}" y2="${horizonY}" stroke="${palette.text}" stroke-width="3" opacity="0.35" />`;
}

function renderOffsetRectangle(context) {
    const shape = createOffsetRectangle(context);
    return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.color}" opacity="0.35" transform="${createShapeRotation(shape)}" />`;
}

function createOffsetRectangle({ width, height, palette, random }) {
    return { x: randomInt(-50, width - 80, random), y: randomInt(-50, height - 80, random), width: randomInt(80, 260, random), height: randomInt(40, 180, random), color: pickBackgroundColor(palette, random), rotation: randomInt(-18, 18, random) };
}

function pickBackgroundColor(palette, random) {
    return [palette.primary, palette.secondary, palette.accent, palette.muted][randomInt(0, 3, random)];
}

function createRingCenter(random) {
    return { cx: randomInt(180, 420, random), cy: randomInt(180, 420, random) };
}

function createRingRadii() {
    return createRangeFrom(70, 620, 44);
}

function renderRing({ cx, cy }, radius, scheme) {
    const color = scheme.colors[Math.floor(radius / 44) % scheme.colors.length];
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="${radius % 88 === 0 ? 4 : 2}" opacity="0.18" />`;
}

function getPaletteScheme({ palette, variant }) {
    return PALETTE_SCHEMES[(variant - 1) % PALETTE_SCHEMES.length].map((name) => palette[name]);
}

function renderCanvasRect({ width, height }, fill) {
    return `<rect width="${width}" height="${height}" fill="${fill}" />`;
}

function renderPolygon(points, fill, opacity) {
    return `<polygon points="${points}" fill="${fill}" opacity="${opacity}" />`;
}

function createShapeRotation({ rotation, x, y, size, width = size, height = size }) {
    return `rotate(${rotation} ${x + width / 2} ${y + height / 2})`;
}

function createRange(length) {
    return Array.from({ length }, (_, index) => index);
}

function createRangeFrom(start, end, step) {
    return Array.from({ length: Math.ceil((end - start) / step) }, (_, index) => start + index * step);
}
