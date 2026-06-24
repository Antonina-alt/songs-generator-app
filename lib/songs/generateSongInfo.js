import { randomInt } from '@/lib/randomGenerator';
import { GENERATORS, getSeededFaker, normalizeFakerText, pickFakerValue, renderFakerPattern } from './faker';

const SINGLE_CHANCE = 0.25;
const PERSONAL_ARTIST_CHANCE = 0.5;
const LINE_DURATION_SECONDS = 3.4;
const DEFAULT_TITLE_PATTERN = '{adjective} {noun}';
const DEFAULT_ARTIST_PATTERN = '{firstName} {lastName}';
const DEFAULT_REVIEW_PATTERN = '{opening} {middle} {ending}';
const DEFAULT_LYRIC_SECTIONS = ['openings', 'middles', 'choruses', 'choruses', 'openings', 'middles', 'choruses', 'endings'];

export function generateSongInfo({ localeData, region, randoms }) {
    return Object.fromEntries(createSongInfoEntries(localeData, region, randoms));
}

export function getLyricsDurationSeconds(lyrics = []) {
    if (!lyrics.length) return 30;
    return lyrics.at(-1).time + LINE_DURATION_SECONDS;
}

function createSongInfoEntries(localeData, region, randoms) {
    return [
        ['title', generateSongTitle(localeData, region, randoms.title)],
        ['artist', generateArtist(localeData, region, randoms.artist)],
        ['album', generateAlbumTitle(localeData, region, randoms.album)],
        ['genre', generateGenre(localeData, region, randoms.genre)],
        ['review', generateReview(localeData, region, randoms.review)],
        ['lyrics', generateLyrics(localeData, region, randoms.lyrics)]
    ];
}

function generateSongTitle(localeData, region, random) {
    return useFakerMusic(localeData, 'songTitle') ? generateFakerSongTitle(region, random) : generatePatternTitle(localeData, region, random);
}

function generateAlbumTitle(localeData, region, random) {
    if (isSingle(random)) return getSingleLiteral(localeData);
    return useFakerMusic(localeData, 'albumTitle') ? generateFakerAlbum(region, random) : generatePatternAlbum(localeData, region, random);
}

function generateArtist(localeData, region, random) {
    return useFakerMusic(localeData, 'artist') ? generateFakerArtist(region, random) : generateCustomArtist(localeData, region, random);
}

function generateGenre(localeData, region, random) {
    if (useFakerMusic(localeData, 'genre')) return normalizeFakerText(getSeededFaker(region, random).music.genre());
    return normalizeFakerText(pickFakerValue(getSeededFaker(region, random), localeData.genres));
}

function generateReview(localeData, region, random) {
    const faker = getSeededFaker(region, random);
    const reviews = getLocaleSection(localeData, 'reviews');
    return normalizeFakerText(renderFakerPattern(pickReviewPattern(faker, reviews), createReviewValues(faker, reviews)));
}

function generateLyrics(localeData, region, random) {
    const faker = getSeededFaker(region, random);
    const lyrics = getLocaleSection(localeData, 'lyrics');
    return getLyricSequence(lyrics).map((name, index) => createLyricLine(faker, lyrics, name, index)).filter(Boolean);
}

function generateFakerSongTitle(region, random) {
    return normalizeFakerText(getSeededFaker(region, random).music.songName());
}

function generateFakerAlbum(region, random) {
    return normalizeFakerText(getSeededFaker(region, random).music.album());
}

function generatePatternTitle(localeData, region, random) {
    return generateCustomPatternText(localeData, region, random, 'songTitle', DEFAULT_TITLE_PATTERN, createTitleValues);
}

function generatePatternAlbum(localeData, region, random) {
    return generateCustomPatternText(localeData, region, random, 'albumTitle', DEFAULT_TITLE_PATTERN, createAlbumValues);
}

function isSingle(random) {
    return random() < SINGLE_CHANCE;
}

function getSingleLiteral(localeData) {
    return normalizeFakerText(getLocaleSection(localeData, 'albumTitle').singleLiteral ?? 'Single');
}

function pickReviewPattern(faker, reviews) {
    return pickFakerValue(faker, reviews.patterns, DEFAULT_REVIEW_PATTERN);
}

function createReviewValues(faker, reviews) {
    return { opening: pickFakerValue(faker, reviews.openings), middle: pickFakerValue(faker, reviews.middles), ending: pickFakerValue(faker, reviews.endings) };
}

function getLyricSequence(lyrics) {
    return lyrics.sequence ?? DEFAULT_LYRIC_SECTIONS;
}

function createLyricLine(faker, lyrics, sectionName, lineIndex) {
    const text = pickFakerValue(faker, lyrics[sectionName]);
    if (!text) return null;
    return { time: lineIndex * LINE_DURATION_SECONDS, text: normalizeFakerText(text) };
}

function generateFakerArtist(region, random) {
    const faker = getSeededFaker(region, random);
    return isPersonalArtist(random) ? generateFakerPersonalArtist(faker) : normalizeFakerText(faker.music.artist());
}

function generateFakerPersonalArtist(faker) {
    const sex = faker.person.sexType();
    return normalizeFakerText(`${faker.person.firstName(sex)} ${faker.person.lastName(sex)}`);
}

function generateCustomArtist(localeData, region, random) {
    const faker = getSeededFaker(region, random);
    const section = getLocaleSection(localeData, 'artist');
    return normalizeFakerText(renderFakerPattern(pickArtistPattern(faker, section, random), createArtistValues(section, faker)));
}

function pickArtistPattern(faker, section, random) {
    return pickFakerValue(faker, getArtistPatterns(section, random), DEFAULT_ARTIST_PATTERN);
}

function getArtistPatterns(section, random) {
    return isPersonalArtist(random) ? getPersonalArtistPatterns(section) : getBandArtistPatterns(section);
}

function isPersonalArtist(random) {
    return random() < PERSONAL_ARTIST_CHANCE;
}

function getPersonalArtistPatterns(section) {
    return getExplicitPatterns(section.personalPatterns) ?? getFilteredPatterns(section.patterns, isPersonalArtistPattern) ?? ['{firstName} {lastName}', '{firstName} {stageNameNoun}', '{soloStagePrefix} {stageNameNoun}'];
}

function getBandArtistPatterns(section) {
    return getExplicitPatterns(section.bandPatterns) ?? getFilteredPatterns(section.patterns, isBandArtistPattern) ?? ['{bandPrefix} {bandNoun}', '{bandSuffix} {bandPrefix} {bandNoun}'];
}

function getExplicitPatterns(patterns) {
    return Array.isArray(patterns) && patterns.length > 0 ? patterns : null;
}

function getFilteredPatterns(patterns, predicate) {
    const filtered = Array.isArray(patterns) ? patterns.filter(predicate) : [];
    return filtered.length > 0 ? filtered : null;
}

function isPersonalArtistPattern(pattern) {
    return ['firstName', 'lastName', 'soloStagePrefix'].some((token) => pattern.includes(token));
}

function isBandArtistPattern(pattern) {
    return ['bandPrefix', 'bandNoun', 'bandSuffix'].some((token) => pattern.includes(token));
}

function generateCustomPatternText(localeData, region, random, sectionName, fallbackPattern, createValues) {
    const faker = getSeededFaker(region, random);
    const section = getLocaleSection(localeData, sectionName);
    return normalizeFakerText(renderFakerPattern(pickFakerValue(faker, section.patterns, fallbackPattern), createValues(section, faker, random)));
}

function createTitleValues(section, faker, random) {
    return { adjective: pickFakerValue(faker, section.adjectives), noun: pickFakerValue(faker, section.nouns), suffix: pickFakerValue(faker, section.suffixes), number: randomInt(1, 99, random) };
}

function createAlbumValues(section, faker, random) {
    return { adjective: pickFakerValue(faker, section.adjectives), noun: pickFakerValue(faker, section.nouns), number: randomInt(1, 10, random) };
}

function createArtistValues(section, faker) {
    return { ...createBandValues(section, faker), ...createPersonalValues(section, faker) };
}

function createBandValues(section, faker) {
    return { bandPrefix: pickFakerValue(faker, section.bandPrefixes), bandNoun: pickFakerValue(faker, section.bandNouns), bandSuffix: pickFakerValue(faker, section.bandSuffixes) };
}

function createPersonalValues(section, faker) {
    return { soloStagePrefix: pickFakerValue(faker, section.soloStagePrefixes), stageNameNoun: pickFakerValue(faker, section.stageNameNouns), firstName: pickFakerValue(faker, section.firstNames, faker.person.firstName()), lastName: pickFakerValue(faker, section.lastNames, faker.person.lastName()) };
}

function useFakerMusic(localeData, sectionName) {
    return localeData?.generators?.[sectionName] === GENERATORS.fakerMusic;
}

function getLocaleSection(localeData, sectionName) {
    return localeData?.[sectionName] ?? {};
}
