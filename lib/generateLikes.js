export function generateLikes(averageLikes, random) {
    const value = clampLikes(Number(averageLikes));
    const base = Math.floor(value);
    return base + Number(random() < value - base);
}

function clampLikes(value) {
    return Math.min(Math.max(value, 0), 10);
}
