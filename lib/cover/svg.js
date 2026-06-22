import { randomInt } from '../randomGenerator';

const SVG_SIZE = 600;
const CIRCLE_COUNT = 12;

export function createCoverSvg({ song, random }) {
    const gradient = createGradient(random);
    const circles = createCircles(random).join('');
    return renderCoverSvg({ gradient, circles, song });
}

function createGradient(random) {
    return { from: randomInt(0, 360, random), to: randomInt(0, 360, random) };
}

function createCircles(random) {
    return Array.from({ length: CIRCLE_COUNT }, () => createCircle(random));
}

function createCircle(random) {
    const props = createCircleProps(random);
    return `<circle cx="${props.x}" cy="${props.y}" r="${props.r}" fill="white" opacity="${props.opacity}" />`;
}

function createCircleProps(random) {
    return {
        x: randomInt(0, SVG_SIZE, random),
        y: randomInt(0, SVG_SIZE, random),
        r: randomInt(20, 120, random),
        opacity: 0.08 + random() * 0.22
    };
}

function renderCoverSvg({ gradient, circles, song }) {
    return `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">${renderDefs(gradient)}${renderBackground()}${circles}${renderFrame()}${renderTitle(song)}${renderArtist(song)}</svg>`;
}

function renderDefs({ from, to }) {
    return `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(${from}, 70%, 45%)"/><stop offset="100%" stop-color="hsl(${to}, 70%, 25%)"/></linearGradient></defs>`;
}

function renderBackground() {
    return '<rect width="600" height="600" fill="url(#bg)" />';
}

function renderFrame() {
    return '<rect x="40" y="40" width="520" height="520" fill="none" stroke="white" stroke-width="6" opacity="0.65"/>';
}

function renderTitle(song) {
    return `<text x="60" y="420" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="white">${escapeXml(song.title)}</text>`;
}

function renderArtist(song) {
    return `<text x="60" y="475" font-family="Arial, sans-serif" font-size="28" fill="white" opacity="0.9">${escapeXml(song.artist)}</text>`;
}

function escapeXml(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
