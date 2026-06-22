import { getFaker } from './faker';
import { pickValue, renderPattern } from './text';

export function generateArtist(localeData, region, random) {
    const { artist } = localeData;
    const pattern = pickValue(artist.patterns, random, '{firstName} {lastName}');
    return renderPattern(pattern, createArtistValues(artist, region, random)).trim();
}

function createArtistValues(artist, region, random) {
    return {
        ...createBandValues(artist, random),
        ...createSoloValues(artist, region, random)
    };
}

function createBandValues(artist, random) {
    return {
        bandPrefix: pickValue(artist.bandPrefixes, random),
        bandNoun: pickValue(artist.bandNouns, random),
        bandSuffix: pickValue(artist.bandSuffixes, random)
    };
}

function createSoloValues(artist, region, random) {
    const faker = getFaker(region);
    return {
        soloStagePrefix: pickValue(artist.soloStagePrefixes, random),
        stageNameNoun: pickValue(artist.stageNameNouns, random),
        firstName: pickValue(artist.firstNames, random, faker.person.firstName()),
        lastName: pickValue(artist.lastNames, random, faker.person.lastName())
    };
}
