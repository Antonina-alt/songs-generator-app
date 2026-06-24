import { getSeededFaker, normalizeFakerText } from './faker';
import { createPatternNumber, generatePatternText, pickFakerValue } from '../patternGenerator';
import { getLocaleSection, shouldUseFakerMusic } from './generationStrategy';

const SINGLE_CHANCE = 0.25;

export function generateAlbumTitle(localeData, region, random) {
    if (isSingle(random)) return getSingleLiteral(localeData);
    if (shouldUseFakerMusic(localeData, 'albumTitle')) return generateFakerAlbum(region, random);
    return generatePatternAlbum(localeData, region, random);
}

function getSingleLiteral(localeData) {
    return normalizeFakerText(getLocaleSection(localeData, 'albumTitle').singleLiteral);
}

function generateFakerAlbum(region, random) {
    return normalizeFakerText(getSeededFaker(region, random).music.album());
}

function generatePatternAlbum(localeData, region, random) {
    return generatePatternText(createAlbumPatternContext(localeData, region, random));
}

function createAlbumPatternContext(localeData, region, random) {
    return { localeData, region, random, sectionName: 'albumTitle', fallbackPattern: '{adjective} {noun}', createValues: createAlbumValues };
}

function isSingle(random) {
    return random() < SINGLE_CHANCE;
}

function createAlbumValues({ section, faker, random }) {
    return {
        adjective: pickFakerValue(faker, section.adjectives),
        noun: pickFakerValue(faker, section.nouns),
        number: createPatternNumber(random, 1, 10)
    };
}
