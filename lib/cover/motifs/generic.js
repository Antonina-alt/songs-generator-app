import { randomInt } from '@/lib/randomGenerator';
import { pickSchemeColor } from '../colors';
import { createRange, createShapeRotation, renderCircle } from './shared';

export function renderGenericMotif({ width, height, scheme, random }) {
    return createRange(randomInt(8, 18, random))
        .map(() => renderGenericShape({ width, height, scheme, random }))
        .join('');
}

function renderGenericShape(context) {
    const shape = createGenericShape(context);
    return [renderGenericCircle, renderGenericRect, renderGenericTriangle][shape.type]?.(shape) ?? renderGenericTriangle(shape);
}

function createGenericShape({ width, height, scheme, random }) {
    return {
        type: randomInt(0, 2, random),
        color: pickSchemeColor(scheme, random),
        x: randomInt(40, width - 120, random),
        y: randomInt(70, height - 160, random),
        size: randomInt(42, 160, random),
        rotation: randomInt(-28, 28, random),
        opacity: (0.22 + random() * 0.42).toFixed(3),
        random
    };
}

function renderGenericCircle({ x, y, size, color, opacity }) {
    return renderCircle(x, y, size / 2, color, opacity);
}

function renderGenericRect(shape) {
    return `<rect x="${shape.x}" y="${shape.y}" width="${shape.size}" height="${shape.size * 0.72}" rx="${randomInt(8, 48, shape.random)}" fill="${shape.color}" opacity="${shape.opacity}" transform="${createShapeRotation(shape)}" />`;
}

function renderGenericTriangle(shape) {
    return `<polygon points="${shape.x},${shape.y + shape.size} ${shape.x + shape.size / 2},${shape.y} ${shape.x + shape.size},${shape.y + shape.size}" fill="${shape.color}" opacity="${shape.opacity}" transform="${createShapeRotation(shape)}" />`;
}
