import Delaunator from 'delaunator';
import { randomInt } from '@/lib/randomGenerator';

const GRID_STEP = 120;
const POINT_JITTER = 44;
const EDGE_POINT_COUNT = 12;

export function renderLowPolyBackground(context) {
    const { width, height, random, palette } = context;
    const points = createPoints({ width, height, random });
    const delaunay = Delaunator.from(points);
    const triangles = renderTriangles(delaunay.triangles, points, palette, random);

    return `<rect width="${width}" height="${height}" fill="${palette.background}" />${triangles}`;
}

function createPoints({ width, height, random }) {
    return [
        ...createGridPoints({ width, height, random }),
        ...createCornerPoints(width, height),
        ...createEdgePoints({ width, height, random })
    ];
}

function createGridPoints({ width, height, random }) {
    const points = [];

    for (let y = 0; y <= height; y += GRID_STEP) {
        for (let x = 0; x <= width; x += GRID_STEP) {
            points.push(createJitteredPoint({ x, y, width, height, random }));
        }
    }

    return points;
}

function createJitteredPoint({ x, y, width, height, random }) {
    return [
        clamp(x + randomInt(-POINT_JITTER, POINT_JITTER, random), 0, width),
        clamp(y + randomInt(-POINT_JITTER, POINT_JITTER, random), 0, height)
    ];
}

function createCornerPoints(width, height) {
    return [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height]
    ];
}

function createEdgePoints({ width, height, random }) {
    return Array.from({ length: EDGE_POINT_COUNT }, () => createEdgePoint({ width, height, random }));
}

function createEdgePoint({ width, height, random }) {
    const side = randomInt(0, 3, random);
    const x = randomInt(0, width, random);
    const y = randomInt(0, height, random);

    if (side === 0) return [x, 0];
    if (side === 1) return [width, y];
    if (side === 2) return [x, height];

    return [0, y];
}

function renderTriangles(triangles, points, palette, random) {
    const result = [];

    for (let index = 0; index < triangles.length; index += 3) {
        result.push(renderTriangle(triangles, points, palette, random, index));
    }

    return result.join('');
}

function renderTriangle(triangles, points, palette, random, index) {
    const trianglePoints = [
        points[triangles[index]],
        points[triangles[index + 1]],
        points[triangles[index + 2]]
    ];

    return `<polygon points="${formatPoints(trianglePoints)}" fill="${pickColor(palette, random)}" opacity="${createOpacity(random)}" />`;
}

function formatPoints(points) {
    return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function pickColor(palette, random) {
    const colors = [palette.primary, palette.secondary, palette.accent, palette.muted];
    return colors[randomInt(0, colors.length - 1, random)];
}

function createOpacity(random) {
    return (0.48 + random() * 0.32).toFixed(3);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}