export function fitTextBlock(options) {
    return findFittingBlock(options) ?? createForcedBlock(options);
}

export function fitSingleLineText(options) {
    return findFittingLine(options) ?? createForcedLine(options);
}

function findFittingBlock(options) {
    return createFontRange(options.maxFontSize, options.minFontSize, 2)
        .map((fontSize) => createBlockCandidate(options, fontSize))
        .find((candidate) => fitsBlock(candidate, options))?.block;
}

function fitsBlock(candidate, options) {
    return !candidate.truncated && candidate.block.height <= getMaxHeight(options);
}

function getMaxHeight(options) {
    return options.maxHeight ?? Number.POSITIVE_INFINITY;
}

function createForcedBlock(options) {
    return createBlockCandidate(options, options.minFontSize, true).block;
}

function createBlockCandidate(options, fontSize, forceEllipsis = false) {
    const maxChars = getMaxChars(options, fontSize);
    const result = wrapText(options.text, maxChars, options.maxLines, forceEllipsis);
    return { truncated: result.truncated, block: createFittedBlock(result.lines, fontSize, options.lineHeight ?? 1.08) };
}

function findFittingLine(options) {
    const fontSize = createFontRange(options.maxFontSize, options.minFontSize).find((size) => fitsLine(options, size));
    return fontSize ? { text: options.text, fontSize } : null;
}

function fitsLine(options, fontSize) {
    return estimateLineWidth(options.text, fontSize, options.letterSpacing) <= options.width;
}

function createForcedLine(options) {
    const maxChars = getMaxChars(options, options.minFontSize);
    return { text: ellipsize(options.text, maxChars), fontSize: options.minFontSize };
}

function createFontRange(max, min, step = 1) {
    return Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, index) => max - index * step);
}

function createFittedBlock(lines, fontSize, lineHeight) {
    return { lines, fontSize, lineHeight, height: calculateBlockHeight(lines.length, fontSize, lineHeight) };
}

function wrapText(text, maxChars, maxLines, forceEllipsis = false) {
    const state = normalizeWords(text, maxChars).reduce((current, word) => appendWrappedWord(current, word), createWrapState(maxChars, maxLines));
    return finalizeWrapState(state, forceEllipsis);
}

function createWrapState(maxChars, maxLines) {
    return { lines: [], currentLine: '', maxChars, maxLines, stopped: false };
}

function appendWrappedWord(state, word) {
    if (state.stopped) return state;
    if (canAppendToCurrentLine(state, word)) return updateCurrentLine(state, word);
    return startNextLine(state, word);
}

function finalizeWrapState(state, forceEllipsis) {
    const lines = state.currentLine ? [...state.lines, state.currentLine] : state.lines;
    return createWrapResult(lines, state.maxChars, state.maxLines, forceEllipsis || state.stopped);
}

function createWrapResult(lines, maxChars, maxLines, forceEllipsis) {
    if (lines.length <= maxLines && !forceEllipsis) return { lines, truncated: false };
    return { lines: addEllipsis(lines.slice(0, maxLines), maxChars), truncated: true };
}

function canAppendToCurrentLine({ currentLine, maxChars }, word) {
    return !currentLine || createNextLine(currentLine, word).length <= maxChars;
}

function updateCurrentLine(state, word) {
    return { ...state, currentLine: createNextLine(state.currentLine, word) };
}

function startNextLine(state, word) {
    const lines = state.currentLine ? [...state.lines, state.currentLine] : state.lines;
    return { ...state, lines, currentLine: word, stopped: lines.length === state.maxLines };
}

function normalizeWords(text, maxChars) {
    return getWords(text).flatMap((word) => breakLongWord(word, maxChars));
}

function breakLongWord(word, maxChars) {
    if (word.length <= maxChars) return [word];
    return createLongWordParts(word, maxChars);
}

function createLongWordParts(word, maxChars) {
    const count = Math.ceil(word.length / Math.max(1, maxChars - 1));
    return Array.from({ length: count }, (_, index) => createLongWordPart(word, maxChars, index)).filter(Boolean);
}

function createLongWordPart(word, maxChars, index) {
    const size = Math.max(1, maxChars - 1);
    const part = word.slice(index * size, (index + 1) * size);
    return shouldHyphenatePart(word, size, index) ? `${part}-` : part;
}

function shouldHyphenatePart(word, size, index) {
    return (index + 1) * size < word.length;
}

function addEllipsis(lines, maxChars) {
    if (!lines.length) return lines;
    return replaceLast(lines, (line) => ellipsize(line, maxChars));
}

function replaceLast(values, replace) {
    return values.map((value, index) => index === values.length - 1 ? replace(value) : value);
}

function createNextLine(currentLine, word) {
    return currentLine ? `${currentLine} ${word}` : word;
}

function getWords(value) {
    return String(value).trim().split(/\s+/).filter(Boolean);
}

function getMaxChars({ width, letterSpacing = 0 }, fontSize) {
    return estimateCharsPerLine(width, fontSize, letterSpacing);
}

function calculateBlockHeight(lineCount, fontSize, lineHeight) {
    if (lineCount <= 0) return 0;
    return fontSize + (lineCount - 1) * fontSize * lineHeight;
}

function estimateCharsPerLine(width, fontSize, letterSpacing) {
    return Math.max(4, Math.floor(width / getAverageCharWidth(fontSize, letterSpacing)));
}

function estimateLineWidth(text, fontSize, letterSpacing = 0) {
    return String(text).length * getAverageCharWidth(fontSize, letterSpacing);
}

function getAverageCharWidth(fontSize, letterSpacing = 0) {
    return fontSize * 0.68 + Math.max(letterSpacing, 0);
}

function ellipsize(value, maxChars) {
    if (value.length <= maxChars) return value;
    if (maxChars <= 1) return '…';
    return `${value.slice(0, maxChars - 1)}…`;
}
