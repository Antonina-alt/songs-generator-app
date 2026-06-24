export function splitText(value, maxChars, maxLines) {
    const words = String(value).trim().split(/\s+/);
    const lines = words.reduce((result, word) => appendWord(result, word, maxChars), []);

    return limitLines(lines, maxLines);
}

function appendWord(lines, word, maxChars) {
    const current = lines.at(-1);

    if (!current) return [word];

    if (`${current} ${word}`.length > maxChars) {
        return [...lines, word];
    }

    return [...lines.slice(0, -1), `${current} ${word}`];
}

function limitLines(lines, maxLines) {
    if (lines.length <= maxLines) return lines;

    const visibleLines = lines.slice(0, maxLines);
    const lastIndex = visibleLines.length - 1;

    visibleLines[lastIndex] = `${visibleLines[lastIndex]}…`;

    return visibleLines;
}