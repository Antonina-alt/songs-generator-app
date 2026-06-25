import { pickRandom, randomInt } from '../randomGenerator';
import { clamp, clampIndex, sum } from '../utils/math';
import { getScaleNotes } from './harmony';

const VOCAL_PATTERNS = [
    [0, 1, 2, 2, 1],
    [0, 0, 2, 4, 4],
    [3, 3, 2, 1, 0],
    [0, 2, 4, 2, 0],
    [1, 2, 3, 4, 3],
    [4, 3, 2, 2, 0]
];

export function createVocalEvents(context) {
    if (!canCreateVocals(context)) return [];
    return context.lyrics.flatMap((line, lineIndex) => createVocalPhrase(createPhraseContext(context, line, lineIndex)));
}

function canCreateVocals({ lyrics, vocalRandom }) {
    return Boolean(lyrics?.length && vocalRandom);
}

function createPhraseContext(context, line, lineIndex) {
    const vocalNotes = createVocalNoteRange(context);
    return { line, vocalNotes, lineDuration: getLineDuration(context.lyrics, lineIndex), ...createPhraseMelody(context.vocalRandom, vocalNotes) };
}

function createPhraseMelody(random, vocalNotes) {
    return { random, phrasePattern: pickRandom(VOCAL_PATTERNS, random), phraseBaseIndex: randomInt(1, Math.max(1, vocalNotes.length - 6), random) };
}

function getLineDuration(lyrics, lineIndex) {
    const nextLine = lyrics[lineIndex + 1];
    return nextLine ? nextLine.time - lyrics[lineIndex].time : 3.4;
}

function createVocalPhrase(context) {
    const words = splitWords(context.line.text);
    if (!words.length) return [];
    return createPhraseEvents({ ...context, words, slots: createWordSlots(context.line.time, context.lineDuration, words, context.phonetics) });
}

function createPhraseEvents(context) {
    return context.words.map((word, wordIndex) => createVocalEvent(context, word, wordIndex));
}

function createWordSlots(lineTime, lineDuration, words, phonetics) {
    const weights = words.map((word) => getWordWeight(word, phonetics));
    return words.map((_, index) =>
        createWordSlot({ lineTime, lineDuration, weights, index, isLast: index === words.length - 1 })
    );
}

function createWordSlot(context) {
    const slot = getSlotDuration(context);
    return { startTime: getSlotStartTime(context), slot, isLast: context.isLast };
}

function getSlotDuration({ lineDuration, weights, index }) {
    return getUsableDuration(lineDuration) * (weights[index] / sum(weights));
}

function getSlotStartTime({ lineTime, lineDuration, weights, index }) {
    return lineTime + lineDuration * 0.04 + getSlotOffset(lineDuration, weights, index);
}

function getSlotOffset(lineDuration, weights, index) {
    return getUsableDuration(lineDuration) * sum(weights.slice(0, index)) / sum(weights);
}

function createVocalEvent(context, word, wordIndex) {
    const slot = context.slots[wordIndex];
    return createEventPayload(context, word, wordIndex, slot);
}

function createEventPayload(context, word, wordIndex, slot) {
    return { text: word, time: slot.startTime, note: getPhraseNote(context, wordIndex), durationSeconds: getWordDuration(word, slot), velocity: getWordVelocity(slot) };
}

function getPhraseNote({ vocalNotes, phrasePattern, phraseBaseIndex }, wordIndex) {
    const patternStep = phrasePattern[wordIndex % phrasePattern.length];
    return vocalNotes[clampIndex(phraseBaseIndex + patternStep, vocalNotes.length)];
}

function getWordDuration(word, { slot, isLast }) {
    const multiplier = isLast ? 1.08 : 0.92;
    return clamp(slot * multiplier, getMinWordDuration(word), Math.min(getMaxWordDuration(word), slot * 1.15));
}

function getWordVelocity({ isLast }) {
    return isLast ? 0.82 : 0.68;
}

function createVocalNoteRange(context) {
    const safeScale = getSafeScale(context);
    return [...safeScale.map(toFourthOctave), ...safeScale.slice(0, 5).map(toFifthOctave)];
}

function getSafeScale(context) {
    const scale = getScaleNotes(context);
    return scale.length ? scale : ['C', 'D', 'E', 'G', 'A'];
}

function getUsableDuration(lineDuration) {
    return Math.max(1.2, lineDuration * 0.92);
}

function toFourthOctave(note) {
    return `${note}4`;
}

function toFifthOctave(note) {
    return `${note}5`;
}

function getWordWeight(word, phonetics) {
    const cleanWord = sanitizeWord(word);
    return 0.8
        + Math.min(cleanWord.length * 0.16, 2.2)
        + Math.min(countVowelGroups(cleanWord, phonetics) * 0.28, 1.1);
}

function countVowelGroups(word, phonetics) {
    const vowels = phonetics?.vowels;
    if (!vowels) return 1;
    return word.match(createVowelPattern(vowels))?.length ?? 1;
}

function createVowelPattern(vowels) {
    return new RegExp(`[${escapeRegex(vowels)}]+`, 'giu');
}

function escapeRegex(value) {
    return String(value).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

function getMinWordDuration(word) {
    return clamp(0.22 + sanitizeWord(word).length * 0.025, 0.28, 0.72);
}

function getMaxWordDuration(word) {
    return clamp(0.42 + sanitizeWord(word).length * 0.065, 0.58, 1.45);
}

function sanitizeWord(word) {
    return String(word).replace(/[^\p{L}\p{N}]/gu, '');
}

function splitWords(text) {
    return String(text).split(/\s+/).map((word) => word.trim()).filter(Boolean);
}
