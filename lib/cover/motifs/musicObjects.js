import { randomInt } from '@/lib/randomGenerator';
import { getSchemeColor } from '../colors';
import { createRange, createRotation, randomIntFromRange, renderCircle, wrapRotate } from './shared';

export function renderVinyl(context) {
    const geometry = createVinylGeometry(context);
    return wrapRotate(renderVinylParts(context, geometry), createRotation(context), geometry.cx, geometry.cy);
}

export function renderCassette(context) {
    const geometry = createCassetteGeometry(context);
    return wrapRotate(renderCassetteParts(context, geometry), geometry.rotation, 300, 300);
}

export function renderCompactDisc(context) {
    const geometry = createDiscGeometry(context);
    return [renderDiscBase(context, geometry), renderDiscShines(context, geometry), renderDiscHole(context, geometry), renderDiscStroke(context, geometry)].join('');
}

export function renderTapeReel(context) {
    const count = randomIntFromRange(context.motifSettings.reelCountRange, context.random);
    return createRange(count).map((index) => renderTapeReelSet(context, count, index)).join('');
}

function createVinylGeometry({ motifSettings, random }) {
    return {
        cx: randomInt(230, 370, random),
        cy: randomInt(210, 330, random),
        radius: randomInt(145, 225, random),
        ringCount: randomIntFromRange(motifSettings.ringCountRange, random)
    };
}

function renderVinylParts(context, geometry) {
    return [
        renderVinylBase(context, geometry),
        ...renderVinylRings(context, geometry),
        renderVinylCenter(context, geometry),
        renderVinylHole(context, geometry)
    ].join('');
}

function renderVinylBase({ scheme }, { cx, cy, radius }) {
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${scheme.main}" opacity="0.92" />`;
}

function renderVinylRings({ scheme }, geometry) {
    return createRange(geometry.ringCount).map((index) => renderVinylRing(scheme, geometry, index));
}

function renderVinylRing(scheme, geometry, index) {
    const radius = 42 + index * ((geometry.radius - 48) / geometry.ringCount);
    return `<circle cx="${geometry.cx}" cy="${geometry.cy}" r="${radius}" fill="none" stroke="${getSchemeColor(scheme, index + 1)}" stroke-width="1.5" opacity="0.22" />`;
}

function renderVinylCenter({ motifSettings, random, scheme }, { cx, cy }) {
    return `<circle cx="${cx}" cy="${cy}" r="${randomIntFromRange(motifSettings.centerRadiusRange, random)}" fill="${scheme.support}" opacity="0.94" />`;
}

function renderVinylHole({ scheme }, { cx, cy }) {
    return `<circle cx="${cx}" cy="${cy}" r="14" fill="${scheme.background}" />`;
}

function createCassetteGeometry({ motifSettings, random }) {
    return {
        x: 82,
        y: randomInt(130, 230, random),
        width: 436,
        height: 260,
        labelHeight: randomIntFromRange(motifSettings.labelHeightRange, random),
        rotation: createRotation({ motifSettings, random })
    };
}

function renderCassetteParts({ palette }, geometry) {
    return [
        renderCassetteBody(palette, geometry),
        renderCassetteLabel(palette, geometry),
        renderCassetteReels(palette, geometry),
        renderCassetteWindow(palette, geometry),
        renderScrews(geometry, palette)
    ].join('');
}

function renderCassetteBody(palette, { x, y, width, height }) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="28" fill="${palette.primary}" opacity="0.92" />`;
}

function renderCassetteLabel(palette, { x, y, width, labelHeight }) {
    return `<rect x="${x + 36}" y="${y + 34}" width="${width - 72}" height="${labelHeight}" rx="14" fill="${palette.text}" opacity="0.86" />`;
}

function renderCassetteReels(palette, { x, y }) {
    return [renderCassetteReel(x + 140, y + 164, palette), renderCassetteReel(x + 296, y + 164, palette)].join('');
}

function renderCassetteWindow(palette, { x, y }) {
    return `<rect x="${x + 142}" y="${y + 206}" width="152" height="34" rx="8" fill="${palette.background}" opacity="0.82" />`;
}

function renderCassetteReel(cx, cy, palette) {
    return [
        renderCircle(cx, cy, 54, palette.background, 0.92),
        renderCircle(cx, cy, 28, palette.muted),
        renderCircle(cx, cy, 8, palette.text, 0.7)
    ].join('');
}

function renderScrews(geometry, palette) {
    return getScrewPoints(geometry).map(([cx, cy]) => renderCircle(cx, cy, 7, palette.text, 0.55)).join('');
}

function getScrewPoints({ x, y, width, height }) {
    return [[x + 24, y + 24], [x + width - 24, y + 24], [x + 24, y + height - 24], [x + width - 24, y + height - 24]];
}

function createDiscGeometry({ random }) {
    return { cx: 300, cy: randomInt(230, 330, random), radius: randomInt(150, 230, random) };
}

function renderDiscBase({ palette }, { cx, cy, radius }) {
    return renderCircle(cx, cy, radius, palette.secondary, 0.72);
}

function renderDiscShines({ motifSettings, palette, random }, geometry) {
    return createRange(randomIntFromRange(motifSettings.shineCountRange, random)).map(() => renderDiscShine(palette, geometry, random)).join('');
}

function renderDiscShine(palette, { cx, cy, radius }, random) {
    return `<path d="M ${cx} ${cy} L ${cx + radius} ${cy - 18} L ${cx + radius} ${cy + 18} Z" fill="${palette.text}" opacity="0.08" transform="rotate(${randomInt(0, 360, random)} ${cx} ${cy})" />`;
}

function renderDiscHole({ motifSettings, palette, random }, { cx, cy }) {
    return renderCircle(cx, cy, randomIntFromRange(motifSettings.holeRadiusRange, random), palette.background, 0.92);
}

function renderDiscStroke({ palette }, { cx, cy, radius }) {
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${palette.text}" stroke-width="3" opacity="0.25" />`;
}

function renderTapeReelSet({ palette, motifSettings, random }, count, index) {
    const geometry = createTapeReelGeometry(motifSettings, random, count, index);

    return [
        renderCircle(geometry.cx, geometry.cy, geometry.radius, palette.primary, 0.42),
        renderCircle(geometry.cx, geometry.cy, geometry.radius * 0.55, palette.background, 0.72),
        renderCircle(geometry.cx, geometry.cy, geometry.radius * 0.15, palette.text, 0.75)
    ].join('');
}

function createTapeReelGeometry(motifSettings, random, count, index) {
    return {
        cx: 130 + index * (340 / Math.max(1, count - 1)),
        cy: randomInt(220, 350, random),
        radius: randomIntFromRange(motifSettings.radiusRange, random)
    };
}
