import { randomInt } from '@/lib/randomGenerator';
import { createRange, createRangeFrom, randomIntFromRange, renderCircle } from './shared';

export function renderCitySkyline(context) {
    const geometry = createSkylineGeometry(context);
    return `${renderBuildings(context, geometry)}${renderHorizon(context, geometry)}`;
}

export function renderMountains(context) {
    return [renderMountainSun(context), ...renderMountainLayers(context)].join('');
}

export function renderStarsOrbits(context) {
    return [...renderStars(context), ...renderOrbits(context)].join('');
}

function createSkylineGeometry({ width, motifSettings, random }) {
    const count = randomIntFromRange(motifSettings.buildingCountRange, random);
    return { count, horizon: randomIntFromRange(motifSettings.horizonRange, random), buildingWidth: width / count };
}

function renderBuildings(context, geometry) {
    return createRange(geometry.count).map((index) => renderBuilding(context, geometry, index)).join('');
}

function renderBuilding(context, geometry, index) {
    const building = createBuilding(context, geometry, index);
    return `${renderBuildingBody(context, building)}${renderWindows(context, building)}`;
}

function createBuilding({ random }, { horizon, buildingWidth }, index) {
    const height = randomInt(70, horizon - 70, random);
    return { x: index * buildingWidth, y: horizon - height, width: buildingWidth, height };
}

function renderBuildingBody({ palette }, { x, y, width, height }) {
    return `<rect x="${x}" y="${y}" width="${width + 1}" height="${height}" fill="${palette.primary}" opacity="0.78" />`;
}

function renderWindows(context, building) {
    return createWindowPoints(building)
        .filter(() => context.random() > 0.62)
        .map((point) => renderWindow(context.palette, point))
        .join('');
}

function createWindowPoints(building) {
    return createRangeFrom(building.y + 16, building.y + building.height - 12, 22)
        .flatMap((wy) => createWindowRow(building, wy));
}

function createWindowRow({ x, width }, wy) {
    return createRangeFrom(x + 10, x + width - 8, 18).map((wx) => [wx, wy]);
}

function renderWindow(palette, [x, y]) {
    return `<rect x="${x}" y="${y}" width="6" height="9" fill="${palette.accent}" opacity="0.72" />`;
}

function renderHorizon({ width, height, palette }, { horizon }) {
    return `<rect x="0" y="${horizon}" width="${width}" height="${height - horizon}" fill="${palette.muted}" opacity="0.86" />`;
}

function renderMountainSun({ palette, motifSettings, random }) {
    const cx = randomInt(120, 480, random);
    const cy = randomInt(120, 260, random);
    return renderCircle(cx, cy, randomIntFromRange(motifSettings.sunRadiusRange, random), palette.secondary, 0.84);
}

function renderMountainLayers(context) {
    return createRange(randomIntFromRange(context.motifSettings.layerCountRange, context.random))
        .map((layer) => renderMountainLayer(context, layer));
}

function renderMountainLayer(context, layer) {
    const points = createMountainPoints(context, layer);
    return `<polygon points="${points.join(' ')}" fill="${getMountainColor(context.palette, layer)}" opacity="${0.42 + layer * 0.08}" />`;
}

function createMountainPoints(context, layer) {
    const baseY = context.height - 80 + layer * 10;
    return [`0,${baseY}`, ...createMountainPeaks(context, layer, baseY), `${context.width},${baseY}`];
}

function createMountainPeaks(context, layer, baseY) {
    return createRange(randomIntFromRange(context.motifSettings.peakCountRange, context.random))
        .map((index, _, points) => createMountainPeak(context, layer, baseY, index, points.length));
}

function createMountainPeak({ width, random }, layer, baseY, index, count) {
    return `${(index * (width / (count - 1))).toFixed(1)},${randomInt(160 + layer * 30, baseY - 80, random)}`;
}

function getMountainColor(palette, layer) {
    return [palette.primary, palette.muted, palette.secondary][layer % 3];
}

function renderStars({ width, height, palette, motifSettings, random }) {
    return createRange(randomIntFromRange(motifSettings.starCountRange, random)).map(() => renderStar(width, height, palette, random));
}

function renderStar(width, height, palette, random) {
    return renderCircle(randomInt(0, width, random), randomInt(0, height, random), randomInt(1, 3, random), palette.text, 0.35 + random() * 0.55);
}

function renderOrbits({ palette, motifSettings, random }) {
    return createRange(randomIntFromRange(motifSettings.orbitCountRange, random)).map(() => renderOrbit(palette, random));
}

function renderOrbit(palette, random) {
    return `<ellipse cx="300" cy="300" rx="${randomInt(80, 250, random)}" ry="${randomInt(30, 130, random)}" fill="none" stroke="${palette.accent}" stroke-width="2" opacity="0.3" transform="rotate(${randomInt(0, 180, random)} 300 300)" />`;
}
