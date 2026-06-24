import { randomInt } from '@/lib/randomGenerator';
import {
    GENERATORS,
    getSeededFaker,
    normalizeFakerText,
    pickFakerValue,
    renderFakerPattern
} from './faker';

const SINGLE_CHANCE = 0.25;
const PERSONAL_ARTIST_CHANCE = 0.5;
const LINE_DURATION_SECONDS = 3.4;

const DEFAULT_LYRIC_SECTIONS = [
    'openings',
    'middles',
    'choruses',
    'choruses',
    'openings',
    'middles',
    'choruses',
    'endings'
];

export function generateSongInfo({ localeData, region, randoms }) {
    return {
        title: generateSongTitle(localeData, region, randoms.title),
        artist: generateArtist(localeData, region, randoms.artist),
        album: generateAlbumTitle(localeData, region, randoms.album),
        genre: generateGenre(localeData, region, randoms.genre),
        review: generateReview(localeData, region, randoms.review),
        lyrics: generateLyrics(localeData, region, randoms.lyrics)
    };
}

export function getLyricsDurationSeconds(lyrics = []) {
    if (!lyrics.length) return 30;
    return lyrics[lyrics.length - 1].time + LINE_DURATION_SECONDS;
}

function generateSongTitle(localeData, region, random) {
    if (shouldUseFakerMusic(localeData, 'songTitle')) {
        return normalizeFakerText(getSeededFaker(region, random).music.songName());
    }

    return generateCustomPatternText({
        localeData,
        region,
        random,
        sectionName: 'songTitle',
        fallbackPattern: '{adjective} {noun}',
        createValues: createTitleValues
    });
}

function generateAlbumTitle(localeData, region, random) {
    const section = getLocaleSection(localeData, 'albumTitle');

    if (random() < SINGLE_CHANCE) {
        return normalizeFakerText(section.singleLiteral ?? 'Single');
    }

    if (shouldUseFakerMusic(localeData, 'albumTitle')) {
        return normalizeFakerText(getSeededFaker(region, random).music.album());
    }

    return generateCustomPatternText({
        localeData,
        region,
        random,
        sectionName: 'albumTitle',
        fallbackPattern: '{adjective} {noun}',
        createValues: createAlbumValues
    });
}

function generateArtist(localeData, region, random) {
    if (shouldUseFakerMusic(localeData, 'artist')) {
        return generateFakerArtist(region, random);
    }

    return generateCustomArtist(localeData, region, random);
}

function generateGenre(localeData, region, random) {
    if (shouldUseFakerMusic(localeData, 'genre')) {
        return normalizeFakerText(getSeededFaker(region, random).music.genre());
    }

    const faker = getSeededFaker(region, random);
    return normalizeFakerText(pickFakerValue(faker, localeData.genres));
}

function generateReview(localeData, region, random) {
    const faker = getSeededFaker(region, random);
    const reviews = getLocaleSection(localeData, 'reviews');

    const pattern = pickFakerValue(
        faker,
        reviews.patterns,
        '{opening} {middle} {ending}'
    );

    return normalizeFakerText(
        renderFakerPattern(pattern, {
            opening: pickFakerValue(faker, reviews.openings),
            middle: pickFakerValue(faker, reviews.middles),
            ending: pickFakerValue(faker, reviews.endings)
        })
    );
}

function generateLyrics(localeData, region, random) {
    const faker = getSeededFaker(region, random);
    const lyrics = getLocaleSection(localeData, 'lyrics');
    const sequence = lyrics.sequence ?? DEFAULT_LYRIC_SECTIONS;

    return sequence
        .map((sectionName, lineIndex) => createLyricLine(faker, lyrics, sectionName, lineIndex))
        .filter(Boolean);
}

function createLyricLine(faker, lyrics, sectionName, lineIndex) {
    const text = pickFakerValue(faker, lyrics[sectionName]);

    if (!text) return null;

    return {
        time: lineIndex * LINE_DURATION_SECONDS,
        text: normalizeFakerText(text)
    };
}

function generateFakerArtist(region, random) {
    const faker = getSeededFaker(region, random);

    if (random() < PERSONAL_ARTIST_CHANCE) {
        return generateFakerPersonalArtist(faker);
    }

    return normalizeFakerText(faker.music.artist());
}

function generateFakerPersonalArtist(faker) {
    const sex = faker.person.sexType();
    return normalizeFakerText(`${faker.person.firstName(sex)} ${faker.person.lastName(sex)}`);
}

function generateCustomArtist(localeData, region, random) {
    const faker = getSeededFaker(region, random);
    const section = getLocaleSection(localeData, 'artist');

    const pattern = pickFakerValue(
        faker,
        getArtistPatterns(section, random),
        '{firstName} {lastName}'
    );

    return normalizeFakerText(renderFakerPattern(pattern, createArtistValues({ section, faker })));
}

function getArtistPatterns(section, random) {
    if (random() < PERSONAL_ARTIST_CHANCE) {
        return getPersonalArtistPatterns(section);
    }

    return getBandArtistPatterns(section);
}

function getPersonalArtistPatterns(section) {
    if (Array.isArray(section.personalPatterns) && section.personalPatterns.length > 0) {
        return section.personalPatterns;
    }

    if (Array.isArray(section.patterns)) {
        return section.patterns.filter(isPersonalArtistPattern);
    }

    return ['{firstName} {lastName}', '{firstName} {stageNameNoun}', '{soloStagePrefix} {stageNameNoun}'];
}

function getBandArtistPatterns(section) {
    if (Array.isArray(section.bandPatterns) && section.bandPatterns.length > 0) {
        return section.bandPatterns;
    }

    if (Array.isArray(section.patterns)) {
        return section.patterns.filter(isBandArtistPattern);
    }

    return ['{bandPrefix} {bandNoun}', '{bandSuffix} {bandPrefix} {bandNoun}'];
}

function isPersonalArtistPattern(pattern) {
    return pattern.includes('firstName') || pattern.includes('lastName') || pattern.includes('soloStagePrefix');
}

function isBandArtistPattern(pattern) {
    return pattern.includes('bandPrefix') || pattern.includes('bandNoun') || pattern.includes('bandSuffix');
}

function generateCustomPatternText({ localeData, region, random, sectionName, fallbackPattern, createValues }) {
    const faker = getSeededFaker(region, random);
    const section = getLocaleSection(localeData, sectionName);
    const pattern = pickFakerValue(faker, section.patterns, fallbackPattern);
    const values = createValues({ section, faker, random });

    return normalizeFakerText(renderFakerPattern(pattern, values));
}

function createTitleValues({ section, faker, random }) {
    return {
        adjective: pickFakerValue(faker, section.adjectives),
        noun: pickFakerValue(faker, section.nouns),
        suffix: pickFakerValue(faker, section.suffixes),
        number: randomInt(1, 99, random)
    };
}

function createAlbumValues({ section, faker, random }) {
    return {
        adjective: pickFakerValue(faker, section.adjectives),
        noun: pickFakerValue(faker, section.nouns),
        number: randomInt(1, 10, random)
    };
}

function createArtistValues({ section, faker }) {
    return {
        bandPrefix: pickFakerValue(faker, section.bandPrefixes),
        bandNoun: pickFakerValue(faker, section.bandNouns),
        bandSuffix: pickFakerValue(faker, section.bandSuffixes),
        soloStagePrefix: pickFakerValue(faker, section.soloStagePrefixes),
        stageNameNoun: pickFakerValue(faker, section.stageNameNouns),
        firstName: pickFakerValue(faker, section.firstNames, faker.person.firstName()),
        lastName: pickFakerValue(faker, section.lastNames, faker.person.lastName())
    };
}

function shouldUseFakerMusic(localeData, sectionName) {
    return localeData?.generators?.[sectionName] === GENERATORS.fakerMusic;
}

function getLocaleSection(localeData, sectionName) {
    return localeData?.[sectionName] ?? {};
}