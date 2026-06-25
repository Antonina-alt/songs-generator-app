import { randomInt } from '@/lib/randomGenerator';

export function randomIntFromRange(range, random, fallback = [1, 1]) {
    const [min, max] = Array.isArray(range) ? range : fallback;
    return randomInt(min, max, random);
}

export function createRotation({ motifSettings, random }) {
    return randomIntFromRange(motifSettings.rotationRange, random);
}

export function wrapRotate(content, rotation, cx, cy) {
    return `<g transform="rotate(${rotation} ${cx} ${cy})">${content}</g>`;
}

export function renderCircle(cx, cy, radius, fill, opacity = 1) {
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" opacity="${opacity}" />`;
}

export function createShapeRotation({ rotation, x, y, size }) {
    return `rotate(${rotation} ${x + size / 2} ${y + size / 2})`;
}

export function createRange(length) {
    return Array.from({ length }, (_, index) => index);
}

export function createRangeFrom(start, end, step) {
    return Array.from({ length: Math.max(0, Math.ceil((end - start) / step)) }, (_, index) => start + index * step);
}
