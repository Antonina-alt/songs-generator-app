import { escapeXml } from './xml';

export function renderTextLines({ lines, x, y, fontSize, color, weight = 700, lineHeight = 1.08, anchor = 'start', opacity = 1 }) {
    const tspans = lines.map((line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : fontSize * lineHeight}">${escapeXml(line)}</tspan>`
    );

    return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${color}" opacity="${opacity}">${tspans.join('')}</text>`;
}

export function renderSingleLineText({ text, x, y, fontSize, color, weight = 500, anchor = 'start', opacity = 1 }) {
    return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${color}" opacity="${opacity}">${escapeXml(text)}</text>`;
}