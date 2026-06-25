import { randomInt } from '@/lib/randomGenerator';
import { createColorScheme } from '../colors';

const TEXTURE_RENDERERS = {
    grain: renderGrain,
    halftone: renderHalftone,
    noise_dots: renderNoiseDots,
    scanlines: renderScanlines,
    paper_fibers: renderPaperFibers,
    soft_grid: renderSoftGrid,
    light_leaks: renderLightLeaks,
    fold_marks: renderFoldMarks
};

export function renderTexture(context) {
    return getTextureRenderer(context.texture.id)(withScheme(context));
}

function getTextureRenderer(textureId) {
    return TEXTURE_RENDERERS[textureId] ?? renderGrain;
}

function withScheme(context) {
    return { ...context, scheme: context.scheme ?? createColorScheme(context) };
}

function renderGrain(context) {
    return createTextureItems(context).map(() => renderGrainDot(context)).join('');
}

function renderHalftone(context) {
    const points = createGridPoints(context, randomInt(18, 34, context.random));
    return points.map((point) => renderHalftoneDot(context, point)).join('');
}

function renderNoiseDots(context) {
    return createTextureItems(context).map(() => renderNoiseDot(context)).join('');
}

function renderScanlines(context) {
    const gap = randomIntFromRange(context.texture.gapRange, context.random);
    return createYLines(context, gap).map((y) => renderHorizontalLine(context, y)).join('');
}

function renderPaperFibers(context) {
    return createTextureItems(context).map(() => renderPaperFiber(context)).join('');
}

function renderSoftGrid(context) {
    const gap = getGridGap(context);
    return [...renderVerticalGridLines(context, gap), ...renderHorizontalGridLines(context, gap)].join('');
}

function renderLightLeaks(context) {
    return createTextureItems(context).map(() => renderLightLeak(context)).join('');
}

function renderFoldMarks(context) {
    return createTextureItems(context).map(() => renderFoldMark(context)).join('');
}

function renderGrainDot({ width, height, scheme, texture, random }) {
    return `<circle cx="${randomInt(0, width, random)}" cy="${randomInt(0, height, random)}" r="${1 + random() * 1.8}" fill="${scheme.text}" opacity="${getOpacity(texture, random)}" />`;
}

function renderHalftoneDot(context, [x, y]) {
    return `<circle cx="${x}" cy="${y}" r="${(1 + context.random() * 5).toFixed(1)}" fill="${context.scheme.text}" opacity="${getOpacity(context.texture, context.random)}" />`;
}

function renderNoiseDot({ width, height, scheme, texture, random }) {
    return `<rect x="${randomInt(0, width, random)}" y="${randomInt(0, height, random)}" width="1" height="1" fill="${scheme.text}" opacity="${getOpacity(texture, random)}" />`;
}

function renderHorizontalLine({ width, scheme, texture, random }, y) {
    return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${scheme.text}" stroke-width="1" opacity="${getOpacity(texture, random)}" />`;
}

function renderPaperFiber(context) {
    const fiber = createPaperFiber(context);
    return `<line x1="${fiber.x}" y1="${fiber.y}" x2="${fiber.x + fiber.length}" y2="${fiber.y + fiber.skew}" stroke="${context.scheme.text}" stroke-width="1" opacity="${getOpacity(context.texture, context.random)}" />`;
}

function renderVerticalGridLines(context, gap) {
    return createXLines(context, gap).map((x) => renderVerticalLine(context, x));
}

function renderHorizontalGridLines(context, gap) {
    return createYLines(context, gap).map((y) => renderGridHorizontalLine(context, y));
}

function renderVerticalLine({ height, scheme, texture, random }, x) {
    return `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${scheme.text}" opacity="${getOpacity(texture, random)}" />`;
}

function renderGridHorizontalLine({ width, scheme, texture, random }, y) {
    return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${scheme.text}" opacity="${getOpacity(texture, random)}" />`;
}

function renderLightLeak({ width, height, scheme, texture, random }) {
    const radius = randomInt(80, 220, random);
    return `<circle cx="${randomInt(-40, width + 40, random)}" cy="${randomInt(-40, height + 40, random)}" r="${radius}" fill="${scheme.highlightSoft}" opacity="${getOpacity(texture, random)}" />`;
}

function renderFoldMark(context) {
    const x = randomInt(70, context.width - 70, context.random);
    return `<line x1="${x}" y1="40" x2="${x + randomInt(-20, 20, context.random)}" y2="${context.height - 40}" stroke="${context.scheme.text}" stroke-width="1" opacity="${getOpacity(context.texture, context.random)}" />`;
}

function createPaperFiber({ width, height, random }) {
    return { x: randomInt(0, width, random), y: randomInt(0, height, random), length: randomInt(10, 42, random), skew: randomInt(-5, 5, random) };
}

function createTextureItems({ texture, random }) {
    return Array.from({ length: randomIntFromRange(texture.densityRange, random) });
}

function createGridPoints(context, gap) {
    return createYLines(context, gap).flatMap((y) => createXLines(context, gap).map((x) => [x, y]));
}

function createXLines({ width }, gap) {
    return createRangeFrom(0, width + 1, gap);
}

function createYLines({ height }, gap) {
    return createRangeFrom(0, height + 1, gap);
}

function getGridGap({ texture, random }) {
    return randomIntFromRange(texture.gapRange, random);
}

function getOpacity(texture, random) {
    return randomRange(texture.opacityRange, random);
}

function randomRange(range, random, fallback = [0, 1]) {
    const [min, max] = Array.isArray(range) ? range : fallback;
    return min + (max - min) * random();
}

function randomIntFromRange(range, random, fallback = [1, 1]) {
    const [min, max] = Array.isArray(range) ? range : fallback;
    return randomInt(min, max, random);
}

function createRangeFrom(start, end, step) {
    return Array.from({ length: Math.ceil((end - start) / step) }, (_, index) => start + index * step);
}
