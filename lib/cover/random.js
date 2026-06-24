import { randomInt } from '@/lib/randomGenerator';

export function pickWeighted(items, random) {
    const totalWeight = items.reduce((sum, item) => sum + getWeight(item), 0);
    const target = random() * totalWeight;

    return pickByTarget(items, target);
}

function pickByTarget(items, target) {
    let current = 0;

    for (const item of items) {
        current += getWeight(item);

        if (target <= current) return item;
    }

    return items.at(-1);
}

function getWeight(item) {
    return Number.isFinite(item?.weight) ? item.weight : 1;
}

export function randomFromRange(range, random) {
    const [min, max] = Array.isArray(range) ? range : [0, 1];
    return min + (max - min) * random();
}

export function randomIntFromRange(range, random) {
    const [min, max] = Array.isArray(range) ? range : [0, 0];
    return randomInt(min, max, random);
}
