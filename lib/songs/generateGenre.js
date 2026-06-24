import { getSeededFaker, normalizeFakerText } from './faker';
import { pickFakerValue } from '../patternGenerator';
import { shouldUseFakerMusic } from './generationStrategy';

export function generateGenre(localeData, region, random) {
    if (shouldUseFakerMusic(localeData, 'genre')) return generateFakerGenre(region, random);
    return generateLocaleGenre(localeData, region, random);
}

function generateFakerGenre(region, random) {
    return normalizeFakerText(getSeededFaker(region, random).music.genre());
}

function generateLocaleGenre(localeData, region, random) {
    const faker = getSeededFaker(region, random);
    return normalizeFakerText(pickFakerValue(faker, localeData.genres));
}
