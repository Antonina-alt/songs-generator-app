import { escapeXml } from './xml';

const TEXT_FONT = 'Arial, sans-serif';

export function renderTextLines(options) {
    return renderTextTag(options, createTextLines(options));
}

export function renderSingleLineText(options) {
    return renderTextTag(options, escapeXml(options.text));
}

function createTextLines({ lines, x, fontSize, lineHeight = 1.08 }) {
    return lines.map((line, index) => renderTspan({ line, x, index, fontSize, lineHeight })).join('');
}

function renderTspan({ line, x, index, fontSize, lineHeight }) {
    return `<tspan x="${x}" dy="${index === 0 ? 0 : fontSize * lineHeight}">${escapeXml(line)}</tspan>`;
}

function renderTextTag(options, content) {
    return `<text ${renderTextAttrs(createTextAttrs(options))}>${content}</text>`;
}

function createTextAttrs(options) {
    return { x: options.x, y: options.y, ...createTextStyleAttrs(options) };
}

function createTextStyleAttrs({ color, fontSize, weight = 700, anchor = 'start', opacity = 1, letterSpacing = 0 }) {
    return { 'text-anchor': anchor, 'font-family': TEXT_FONT, 'font-size': fontSize, 'font-weight': weight, fill: color, opacity, 'letter-spacing': letterSpacing };
}

function renderTextAttrs(attrs) {
    return Object.entries(attrs).map(([name, value]) => `${name}="${value}"`).join(' ');
}
