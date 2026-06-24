import { allFakers, fakerEN_US } from '@faker-js/faker';

export const GENERATORS = {
    fakerMusic: 'fakerMusic',
    customFaker: 'customFaker'
};

const FAKER_SEED_MAX = 2 ** 31 - 1;

export function getFaker(region) {
    return allFakers[getLocaleKey(region)] ?? allFakers[getLanguageKey(region)] ?? fakerEN_US;
}

export function getSeededFaker(region, random) {
    const faker = getFaker(region);
    faker.seed(createFakerSeed(random));
    return faker;
}

export function normalizeFakerText(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function pickFakerValue(faker, array, fallback = '') {
    if (!Array.isArray(array) || array.length === 0) return fallback;
    return faker.helpers.arrayElement(array);
}

export function renderFakerPattern(pattern, values) {
    return String(pattern ?? '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function getLocaleKey(region) {
    return String(region).replace('-', '_');
}

function getLanguageKey(region) {
    return String(region).split('-')[0];
}

function createFakerSeed(random) {
    return Math.floor(random() * FAKER_SEED_MAX);
}