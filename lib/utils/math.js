export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function clampIndex(index, length) {
    return clamp(index, 0, length - 1);
}

export function sum(values) {
    return values.reduce((total, value) => total + value, 0);
}
