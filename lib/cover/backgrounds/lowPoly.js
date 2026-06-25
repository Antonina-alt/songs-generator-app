import Delaunator from 'delaunator';
import { randomInt } from '@/lib/randomGenerator';
import { adjustLightness, createColorScheme, pickSchemeColor } from '../colors';

const GRID_STEP = 120;
const POINT_JITTER = 44;
const EDGE_POINT_COUNT = 12;

export function renderLowPolyBackground(context) {
    const next = { ...context, scheme: context.scheme ?? createColorScheme(context) };
    const points = createPoints(next);
    const triangles = Delaunator.from(points).triangles;
    return `${renderCanvas(next)}${renderTriangles(triangles, points, next)}`;
}

function createPoints(context) {
    return [...createGridPoints(context), ...createCornerPoints(context), ...createEdgePoints(context)];
}

function createGridPoints({ width, height, random }) {
    return createYSteps(height).flatMap((y) => createXSteps(width).map((x) => createJitteredPoint({ x, y, width, height, random })));
}

function createJitteredPoint({ x, y, width, height, random }) {
    return [clamp(x + randomInt(-POINT_JITTER, POINT_JITTER, random), 0, width), clamp(y + randomInt(-POINT_JITTER, POINT_JITTER, random), 0, height)];
}

function createCornerPoints({ width, height }) {
    return [[0, 0], [width, 0], [width, height], [0, height]];
}

function createEdgePoints(context) {
    return Array.from({ length: EDGE_POINT_COUNT }, () => createEdgePoint(context));
}

function createEdgePoint({ width, height, random }) {
    const side = randomInt(0, 3, random);
    if (side === 0) return [randomInt(0, width, random), 0];
    if (side === 1) return [width, randomInt(0, height, random)];
    if (side === 2) return [randomInt(0, width, random), height];
    return [0, randomInt(0, height, random)];
}

function renderCanvas({ width, height, scheme }) {
    return `<rect width="${width}" height="${height}" fill="${scheme.background}" />`;
}

function renderTriangles(triangles, points, context) {
    return createTriangleIndexes(triangles).map((index) => renderTriangle(triangles, points, context, index)).join('');
}

function createTriangleIndexes(triangles) {
    return Array.from({ length: triangles.length / 3 }, (_, index) => index * 3);
}

function renderTriangle(triangles, points, context, index) {
    const polygon = createTrianglePolygon(triangles, points, index);
    return `<polygon points="${formatPoints(polygon)}" fill="${pickColor(context)}" opacity="${createOpacity(context.random)}" />`;
}

function createTrianglePolygon(triangles, points, index) {
    return [points[triangles[index]], points[triangles[index + 1]], points[triangles[index + 2]]];
}

function formatPoints(points) {
    return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function pickColor({ scheme, random }) {
    const lightness = random() * 0.16 - 0.08;
    return adjustLightness(pickSchemeColor(scheme, random), lightness);
}

function createOpacity(random) {
    return (0.48 + random() * 0.32).toFixed(3);
}

function createXSteps(width) {
    return createSteps(width);
}

function createYSteps(height) {
    return createSteps(height);
}

function createSteps(limit) {
    return Array.from({ length: Math.floor(limit / GRID_STEP) + 1 }, (_, index) => index * GRID_STEP);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
