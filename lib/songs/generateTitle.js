import { getSeededFaker, normalizeFakerText } from './faker';
import { createPatternNumber, generatePatternText, pickFakerValue } from '../patternGenerator';
import { shouldUseFakerMusic } from './generationStrategy';

export function generateSongTitle(localeData, region, random) {
    if (shouldUseFakerMusic(localeData, 'songTitle')) return generateFakerSongTitle(region, random);
    return generatePatternSongTitle(localeData, region, random);
}

function generateFakerSongTitle(region, random) {
    return normalizeFakerText(getSeededFaker(region, random).music.songName());
}

function generatePatternSongTitle(localeData, region, random) {
    return generatePatternText(createTitlePatternContext(localeData, region, random));
}

function createTitlePatternContext(localeData, region, random) {
    return { localeData, region, random, sectionName: 'songTitle', fallbackPattern: '{adjective} {noun}', createValues: createTitleValues };
}

function createTitleValues({ section, faker, random }) {
    return {
        adjective: pickFakerValue(faker, section.adjectives),
        noun: pickFakerValue(faker, section.nouns),
        suffix: pickFakerValue(faker, section.suffixes),
        number: createPatternNumber(random, 1, 99)
    };
}
