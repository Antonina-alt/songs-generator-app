import { randomInt } from '../randomGenerator';
import { pickValue, renderPattern } from './text';

export function generateSongTitle(localeData, random) {
    const { songTitle } = localeData;
    const pattern = pickValue(songTitle.patterns, random, '{adjective} {noun}');
    return renderPattern(pattern, createTitleValues(songTitle, random)).trim();
}

function createTitleValues(songTitle, random) {
    return {
        adjective: pickValue(songTitle.adjectives, random),
        noun: pickValue(songTitle.nouns, random),
        suffix: pickValue(songTitle.suffixes, random),
        number: randomInt(1, 99, random)
    };
}
