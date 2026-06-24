import { randomInt } from '@/lib/randomGenerator';

export function pickWeighted(items, random) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const target = random() * totalWeight;

    return pickByTarget(items, target);
}

function pickByTarget(items, target) {
    let current = 0;

    for (const item of items) {
        current += item.weight;
        if (target <= current) return item;
    }

    return items.at(-1);
}

export function randomFromRange(range, random) {
    const [min, max] = range;
    return min + (max - min) * random();
}

export function randomIntFromRange(range, random) {
    const [min, max] = range;
    return randomInt(min, max, random);
}

export function pickRandomValue(values, random) {
    return values[Math.floor(random() * values.length)];
}