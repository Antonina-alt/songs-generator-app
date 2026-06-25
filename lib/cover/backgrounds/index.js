import { randomInt } from '@/lib/randomGenerator';
import { adjustLightness, createColorScheme, pickSchemeColor, rotateHue } from '../colors';
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
    return getBackgroundRenderer(context.background.id)(withScheme(context));
}

function getBackgroundRenderer(backgroundId) {
    return BACKGROUND_RENDERERS[backgroundId] ?? renderSmoothGradient;
}

function withScheme(context) {
    return { ...context, scheme: context.scheme ?? createColorScheme(context) };
}

function renderSmoothGradient(context) {
    return [renderGradientDefs(renderLinearGradient(context.scheme.backgroundGradient)), renderCanvasRect(context, 'url(#cover-bg)')].join('');
}

function renderRadialSpotlight(context) {
    const origin = createRadialOrigin(context);
    return [renderGradientDefs(renderRadialGradient(context, origin)), renderCanvasRect(context, 'url(#cover-bg)')].join('');
}

function renderSplitBlocks(context) {
    const geometry = createSplitGeometry(context);
    return [renderCanvasRect(context, context.scheme.background), ...renderSplitLayers(context, geometry)].join('');
}

function renderLargeCutoutShapes(context) {
    return [renderCanvasRect(context, context.scheme.background), ...renderCutoutShapes(context)].join('');
}

function renderWaveLayers(context) {
    return [renderCanvasRect(context, context.scheme.background), ...createRange(5).map((index) => renderWaveLayer(context, index))].join('');
}

function renderSunAndHorizon(context) {
    const geometry = createSunHorizonGeometry(context);
    return [renderCanvasRect(context, context.scheme.background), renderSun(context, geometry), renderHorizonBlock(context, geometry), renderHorizonLine(context, geometry)].join('');
}

function renderOffsetRectangles(context) {
    return [renderCanvasRect(context, context.scheme.background), ...createRange(12).map(() => renderOffsetRectangle(context))].join('');
}

function renderDiagonalFields(context) {
    return [renderCanvasRect(context, context.scheme.background), ...createDiagonalPolygons(context)].join('');
}

function renderConcentricRings(context) {
    const center = createRingCenter(context.random);
    return [renderCanvasRect(context, context.scheme.background), ...createRingRadii().map((radius) => renderRing(center, radius, context.scheme))].join('');
}

function renderLinearGradient(colors) {
    const step = 100 / (colors.length - 1);
    return ['<linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">', ...colors.map((color, index) => renderStop(index * step, color)), '</linearGradient>'].join('');
}

function renderRadialGradient(context, { cx, cy }) {
    const colors = createSpotlightColors(context);
    return [`<radialGradient id="cover-bg" cx="${cx}" cy="${cy}" r="0.86">`, ...colors.map(([offset, color]) => renderStop(offset, color)), '</radialGradient>'].join('');
}

function createSpotlightColors({ scheme, variant }) {
    const glow = rotateHue(scheme.highlightSoft, variant * 10);
    return [[0, adjustLightness(glow, 0.08)], [54, scheme.mainSoft], [100, scheme.background]];
}

function renderGradientDefs(content) {
    return `<defs>${content}</defs>`;
}

function renderStop(offset, color) {
    return `<stop offset="${offset}%" stop-color="${color}" />`;
}

function createRadialOrigin({ width, height, random }) {
    return { cx: randomInt(150, 450, random) / width, cy: randomInt(120, 420, random) / height };
}

function createSplitGeometry({ random }) {
    return { splitX: randomInt(180, 420, random), circleY: randomInt(170, 430, random), circleRadius: randomInt(110, 230, random) };
}

function renderSplitLayers(context, geometry) {
    return [renderSplitLeft(context, geometry), renderSplitRight(context, geometry), renderSplitCircle(context, geometry), renderSplitAccentCircle(context, geometry)];
}

function renderSplitLeft({ height, scheme }, { splitX }) {
    return `<rect x="0" y="0" width="${splitX}" height="${height}" fill="${scheme.main}" opacity="0.86" />`;
}

function renderSplitRight({ width, height, scheme }, { splitX }) {
    return `<rect x="${splitX}" y="0" width="${width - splitX}" height="${height}" fill="${scheme.quiet}" opacity="0.95" />`;
}

function renderSplitCircle({ scheme }, { splitX, circleY, circleRadius }) {
    return `<circle cx="${splitX}" cy="${circleY}" r="${circleRadius}" fill="${scheme.supportSoft}" opacity="0.72" />`;
}

function renderSplitAccentCircle({ width, height, scheme }, { splitX, circleY, circleRadius }) {
    return `<circle cx="${width - splitX}" cy="${height - circleY}" r="${circleRadius * 0.55}" fill="${scheme.highlightSoft}" opacity="0.68" />`;
}

function renderCutoutShapes(context) {
    return createRange(7).map(() => renderCutoutShape(createCutoutShape(context)));
}

function createCutoutShape({ width, height, scheme, random }) {
    const size = randomInt(90, 260, random);
    return { color: pickSchemeColor(scheme, random), x: randomInt(-80, width - 60, random), y: randomInt(-80, height - 60, random), size, rotation: randomInt(-28, 28, random), opacity: (0.44 + random() * 0.34).toFixed(2), radius: randomInt(12, 70, random), isRect: random() > 0.5 };
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

function renderWaveLayer(context, index) {
    const y = 155 + index * 82;
    const color = context.scheme.colors[index % context.scheme.colors.length];
    return renderWavePath(context, y, createWaveAmplitude(context.random), color, (0.24 + index * 0.1).toFixed(2));
}

function createWaveAmplitude(random) {
    return randomInt(28, 72, random);
}

function renderWavePath({ width, height }, y, amplitude, color, opacity) {
    return `<path d="M 0 ${y} C 120 ${y - amplitude}, 220 ${y + amplitude}, 340 ${y} S 520 ${y - amplitude}, ${width} ${y + amplitude} L ${width} ${height} L 0 ${height} Z" fill="${color}" opacity="${opacity}" />`;
}

function createSunHorizonGeometry({ random }) {
    return { sunX: randomInt(170, 430, random), sunY: randomInt(150, 280, random), radius: randomInt(58, 112, random), horizonY: randomInt(340, 470, random) };
}

function renderSun({ scheme }, { sunX, sunY, radius }) {
    return `<circle cx="${sunX}" cy="${sunY}" r="${radius}" fill="${scheme.highlight}" opacity="0.9" />`;
}

function renderHorizonBlock({ width, height, scheme }, { horizonY }) {
    return `<rect x="0" y="${horizonY}" width="${width}" height="${height - horizonY}" fill="${scheme.quiet}" opacity="0.88" />`;
}

function renderHorizonLine({ width, scheme }, { horizonY }) {
    return `<line x1="0" y1="${horizonY}" x2="${width}" y2="${horizonY}" stroke="${scheme.text}" stroke-width="3" opacity="0.35" />`;
}

function renderOffsetRectangle(context) {
    const shape = createOffsetRectangle(context);
    return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.color}" opacity="0.35" transform="${createShapeRotation(shape)}" />`;
}

function createOffsetRectangle({ width, height, scheme, random }) {
    return { x: randomInt(-50, width - 80, random), y: randomInt(-50, height - 80, random), width: randomInt(80, 260, random), height: randomInt(40, 180, random), color: pickSchemeColor(scheme, random), rotation: randomInt(-18, 18, random) };
}

function createDiagonalPolygons({ scheme }) {
    return [
        renderPolygon('0,0 420,0 180,600 0,600', scheme.main, 0.82),
        renderPolygon('600,0 600,600 250,600 480,0', scheme.supportSoft, 0.72),
        renderPolygon('120,0 600,430 600,600 20,120', scheme.highlightSoft, 0.76)
    ];
}

function createRingCenter(random) {
    return { cx: randomInt(180, 420, random), cy: randomInt(180, 420, random) };
}

function createRingRadii() {
    return createRangeFrom(70, 620, 44);
}

function renderRing({ cx, cy }, radius, scheme) {
    const color = scheme.colors[Math.floor(radius / 44) % scheme.colors.length];
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="${radius % 88 === 0 ? 4 : 2}" opacity="0.2" />`;
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
