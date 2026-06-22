import { randomInt } from '../randomGenerator';
import { pickValue, renderPattern } from './text';

export function generateAlbumTitle(localeData, random) {
    const { albumTitle } = localeData;
    if (isSingle(random)) return albumTitle.singleLiteral;
    return renderAlbumPattern(albumTitle, random);
}

function isSingle(random) {
    return random() < 0.25;
}

function renderAlbumPattern(albumTitle, random) {
    const pattern = pickValue(albumTitle.patterns, random, '{adjective} {noun}');
    return renderPattern(pattern, createAlbumValues(albumTitle, random)).trim();
}

function createAlbumValues(albumTitle, random) {
    return {
        adjective: pickValue(albumTitle.adjectives, random),
        noun: pickValue(albumTitle.nouns, random),
        number: randomInt(1, 10, random)
    };
}
