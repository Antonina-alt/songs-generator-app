import { getSeededFaker, normalizeFakerText } from './faker';
import { generatePatternText, pickFakerValue } from '../patternGenerator';
import { shouldUseFakerMusic } from './generationStrategy';

const PERSONAL_ARTIST_CHANCE = 0.5;

export function generateArtist(localeData, region, random) {
    if (shouldUseFakerMusic(localeData, 'artist')) return generateFakerArtist(region, random);
    return generatePatternArtist(localeData, region, random);
}

function generateFakerArtist(region, random) {
    const faker = getSeededFaker(region, random);
    if (isPersonalArtist(random)) return generatePersonalArtist(faker);
    return normalizeFakerText(faker.music.artist());
}

function generatePersonalArtist(faker) {
    const sex = faker.person.sexType();
    return normalizeFakerText(`${faker.person.firstName(sex)} ${faker.person.lastName(sex)}`);
}

function isPersonalArtist(random) {
    return random() < PERSONAL_ARTIST_CHANCE;
}

function generatePatternArtist(localeData, region, random) {
    return generatePatternText(createArtistPatternContext(localeData, region, random));
}

function createArtistPatternContext(localeData, region, random) {
    return { localeData, region, random, sectionName: 'artist', fallbackPattern: '{firstName} {lastName}', createValues: createArtistValues };
}

function createArtistValues({ section, faker }) {
    return {
        bandPrefix: pickFakerValue(faker, section.bandPrefixes),
        bandNoun: pickFakerValue(faker, section.bandNouns),
        bandSuffix: pickFakerValue(faker, section.bandSuffixes),
        soloStagePrefix: pickFakerValue(faker, section.soloStagePrefixes),
        stageNameNoun: pickFakerValue(faker, section.stageNameNouns),
        firstName: pickFakerValue(faker, section.firstNames),
        lastName: pickFakerValue(faker, section.lastNames)
    };
}
