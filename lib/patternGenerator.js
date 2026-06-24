import { randomInt } from './randomGenerator';
import { getSeededFaker, normalizeFakerText } from './songs/faker';

export function generatePatternText(context) {
    const faker = getSeededFaker(context.region, context.random);
    const section = getPatternSection(context.localeData, context.sectionName);
    const pattern = pickFakerValue(faker, section.patterns, context.fallbackPattern);
    const values = context.createValues({ section, faker, random: context.random });

    return normalizeFakerText(renderPattern(pattern, values));
}

export function pickFakerValue(faker, array, fallback = '') {
    if (!Array.isArray(array) || array.length === 0) return fallback;
    return faker.helpers.arrayElement(array);
}

export function createPatternNumber(random, min, max) {
    return randomInt(min, max, random);
}

function getPatternSection(localeData, sectionName) {
    return localeData?.[sectionName] ?? {};
}

function renderPattern(pattern, values) {
    return String(pattern ?? '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}
