import { CYRILLIC_VOWELS, LATIN_VOWELS } from './constants';

export function splitLineIntoSyllables(text, region) {
    return splitLyricTokens(text).flatMap((token) => splitTokenIntoSyllables(token, region)).filter(Boolean);
}

function splitLyricTokens(text) {
    return String(text).split(/\s+/).flatMap(splitByDash).map(sanitizeLyricToken).filter(Boolean);
}

function splitByDash(word) {
    return word.split(/[-–—]/);
}

function splitTokenIntoSyllables(token, region) {
    if (String(region).startsWith('ru')) return splitTokenByVowelTransitions(token, CYRILLIC_VOWELS);
    return splitEnglishTokenIntoSyllables(token);
}

function splitEnglishTokenIntoSyllables(token) {
    if (isShortToken(token)) return [token];
    return splitEstimatedEnglishSyllables(token);
}

function isShortToken(token) {
    return Array.from(token).length <= 5;
}

function splitEstimatedEnglishSyllables(token) {
    const estimatedSyllables = estimateEnglishSyllableCount(token);
    if (estimatedSyllables <= 1) return [token];
    return splitTokenByVowelTransitions(token, LATIN_VOWELS, estimatedSyllables);
}

function estimateEnglishSyllableCount(token) {
    return getEnglishSpokenToken(token).match(/[aeiouy]+/g)?.length || 1;
}

function getEnglishSpokenToken(token) {
    return removeSilentEnding(removePluralEnding(String(token).toLowerCase().replace(/'s$/u, 's')));
}

function removePluralEnding(token) {
    if (token.endsWith('s') && !/(ses|xes|zes|ces|ges|ches|shes)$/u.test(token)) return token.slice(0, -1);
    return token;
}

function removeSilentEnding(token) {
    return removeSilentFinalE(removeSilentEd(token));
}

function removeSilentEd(token) {
    if (token.endsWith('ed') && !/(ted|ded)$/u.test(token)) return token.slice(0, -2);
    return token;
}

function removeSilentFinalE(token) {
    if (hasSilentFinalE(token)) return token.slice(0, -1);
    return token;
}

function hasSilentFinalE(token) {
    return token.length > 3 && token.endsWith('e') && !/[bcdfghjklmnpqrstvwxyz]le$/u.test(token);
}

function splitTokenByVowelTransitions(token, vowels, maxSyllables = Infinity) {
    const chars = Array.from(token);
    if (shouldKeepTokenWhole(chars, vowels)) return [token];
    return mergeTooShortSyllables(findSyllables(chars, vowels, maxSyllables));
}

function shouldKeepTokenWhole(chars, vowels) {
    return chars.length <= 3 || !chars.some((char) => isVowel(char, vowels));
}

function findSyllables(chars, vowels, maxSyllables) {
    const state = createSplitState();
    chars.slice(0, -1).forEach((char, index) => advanceSplitState(state, chars, vowels, maxSyllables, index));
    return [...state.syllables, chars.slice(state.start).join('')].filter(Boolean);
}

function createSplitState() {
    return { syllables: [], start: 0, currentHasVowel: false };
}

function advanceSplitState(state, chars, vowels, maxSyllables, index) {
    if (state.syllables.length >= maxSyllables - 1) return;
    state.currentHasVowel = state.currentHasVowel || isVowel(chars[index], vowels);
    if (shouldSplitBeforeNext(state, chars, vowels, index)) splitAtIndex(state, chars, index);
}

function shouldSplitBeforeNext(state, chars, vowels, index) {
    return state.currentHasVowel && !isVowel(chars[index], vowels) && isVowel(chars[index + 1], vowels);
}

function splitAtIndex(state, chars, index) {
    state.syllables.push(chars.slice(state.start, index).join(''));
    state.start = index;
    state.currentHasVowel = false;
}

function mergeTooShortSyllables(syllables) {
    return syllables.reduce(mergeSyllable, []);
}

function mergeSyllable(result, syllable) {
    if (shouldMergeWithPrevious(result, syllable)) result[result.length - 1] += syllable;
    else result.push(syllable);
    return result;
}

function shouldMergeWithPrevious(result, syllable) {
    return Boolean(result[result.length - 1] && syllable.length === 1);
}

function isVowel(char, vowels) {
    return vowels.includes(char);
}

function sanitizeLyricToken(token) {
    return token.replace(/[^\p{L}\p{N}\s']/gu, '').trim();
}
