import { randomInt } from '@/lib/randomGenerator';
import { createColorScheme, getSchemeColor, pickSchemeColor } from '../colors';

const MOTIF_RENDERERS = {
    vinyl: renderVinyl,
    cassette: renderCassette,
    compact_disc: renderCompactDisc,
    equalizer: renderEqualizer,
    waveform: renderWaveform,
    city_skyline: renderCitySkyline,
    mountains: renderMountains,
    stars_orbits: renderStarsOrbits,
    drum_circles: renderDrumCircles,
    tape_reel: renderTapeReel
};

export function renderMotif(context) {
    const renderer = MOTIF_RENDERERS[context.motif.id] ?? renderGenericMotif;
    return renderer({ ...context, scheme: createColorScheme(context) });
}

function renderVinyl(context) {
    const geometry = createVinylGeometry(context);
    return wrapRotate(renderVinylParts(context, geometry), createRotation(context), geometry.cx, geometry.cy);
}

function createVinylGeometry({ motifSettings, random }) {
    return { cx: randomInt(230, 370, random), cy: randomInt(210, 330, random), radius: randomInt(145, 225, random), ringCount: randomIntFromRange(motifSettings.ringCountRange, random) };
}

function renderVinylParts(context, geometry) {
    return [renderVinylBase(context, geometry), ...renderVinylRings(context, geometry), renderVinylCenter(context, geometry), renderVinylHole(context, geometry)].join('');
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

function renderCassette(context) {
    const geometry = createCassetteGeometry(context);
    return wrapRotate(renderCassetteParts(context, geometry), geometry.rotation, 300, 300);
}

function createCassetteGeometry({ motifSettings, random }) {
    return { x: 82, y: randomInt(130, 230, random), width: 436, height: 260, labelHeight: randomIntFromRange(motifSettings.labelHeightRange, random), rotation: createRotation({ motifSettings, random }) };
}

function renderCassetteParts({ palette }, geometry) {
    return [renderCassetteBody(palette, geometry), renderCassetteLabel(palette, geometry), renderCassetteReels(palette, geometry), renderCassetteWindow(palette, geometry), renderScrews(geometry, palette)].join('');
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
    return [renderCircle(cx, cy, 54, palette.background, 0.92), renderCircle(cx, cy, 28, palette.muted), renderCircle(cx, cy, 8, palette.text, 0.7)].join('');
}

function renderScrews(geometry, palette) {
    return getScrewPoints(geometry).map(([cx, cy]) => renderCircle(cx, cy, 7, palette.text, 0.55)).join('');
}

function getScrewPoints({ x, y, width, height }) {
    return [[x + 24, y + 24], [x + width - 24, y + 24], [x + 24, y + height - 24], [x + width - 24, y + height - 24]];
}

function renderCompactDisc(context) {
    const geometry = createDiscGeometry(context);
    return [renderDiscBase(context, geometry), renderDiscShines(context, geometry), renderDiscHole(context, geometry), renderDiscStroke(context, geometry)].join('');
}

function createDiscGeometry({ random }) {
    return { cx: 300, cy: randomInt(230, 330, random), radius: randomInt(150, 230, random) };
}

function renderDiscBase({ palette }, { cx, cy, radius }) {
    return renderCircle(cx, cy, radius, palette.secondary, 0.72);
}

function renderDiscShines({ motifSettings, palette, random }, geometry) {
    return createRange(randomIntFromRange(motifSettings.shineCountRange, random)).map((index) => renderDiscShine(palette, geometry, random, index)).join('');
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

function renderEqualizer(context) {
    const geometry = createEqualizerGeometry(context);
    return createRange(geometry.count).map((index) => renderEqualizerBar(context, geometry, index)).join('');
}

function createEqualizerGeometry({ width, motifSettings, random }) {
    const count = randomIntFromRange(motifSettings.barCountRange, random);
    return { count, gap: 4, areaWidth: width - 96 };
}

function renderEqualizerBar(context, geometry, index) {
    const bar = createEqualizerBar(context, geometry, index);
    return `<rect x="${bar.x.toFixed(1)}" y="${bar.y}" width="${bar.width.toFixed(1)}" height="${bar.height}" rx="3" fill="${bar.color}" opacity="0.68" />`;
}

function createEqualizerBar({ height, scheme, motifSettings, random }, geometry, index) {
    const barHeight = randomIntFromRange(motifSettings.barHeightRange, random);
    return { x: 48 + index * (getBarWidth(geometry) + geometry.gap), y: height - 92 - barHeight, width: getBarWidth(geometry), height: barHeight, color: getSchemeColor(scheme, index) };
}

function getBarWidth({ areaWidth, gap, count }) {
    return Math.max(4, Math.min(16, (areaWidth - gap * count) / count));
}

function renderWaveform(context) {
    const points = createWaveformPoints(context);
    return [renderWaveformLine(context, points, 8, 0.14, pickSchemeColor(context.scheme, context.random)), renderWaveformLine(context, points, 0, 0.86, pickSchemeColor(context.scheme, context.random))].join('');
}

function createWaveformPoints(context) {
    const geometry = createWaveformGeometry(context);
    return createRange(geometry.count).map((index) => createWaveformPoint(context, geometry, index)).join(' ');
}

function createWaveformGeometry({ width, motifSettings, random }) {
    return { count: randomIntFromRange(motifSettings.pointCountRange, random), amplitude: randomIntFromRange(motifSettings.amplitudeRange, random), centerY: randomInt(210, 390, random), width };
}

function createWaveformPoint({ random }, geometry, index) {
    const x = 42 + index * ((geometry.width - 84) / (geometry.count - 1));
    return `${x.toFixed(1)},${(geometry.centerY + (random() - 0.5) * geometry.amplitude).toFixed(1)}`;
}

function renderWaveformLine({ motifSettings, random }, points, extraWidth, opacity, color) {
    const width = randomIntFromRange(motifSettings.strokeWidthRange, random) + extraWidth;
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" />`;
}

function renderCitySkyline(context) {
    const geometry = createSkylineGeometry(context);
    return `${renderBuildings(context, geometry)}${renderHorizon(context, geometry)}`;
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
    return createWindowPoints(building).filter(() => context.random() > 0.62).map((point) => renderWindow(context.palette, point)).join('');
}

function createWindowPoints(building) {
    return createRangeFrom(building.y + 16, building.y + building.height - 12, 22).flatMap((wy) => createWindowRow(building, wy));
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

function renderMountains(context) {
    return [renderMountainSun(context), ...renderMountainLayers(context)].join('');
}

function renderMountainSun({ palette, motifSettings, random }) {
    const cx = randomInt(120, 480, random);
    const cy = randomInt(120, 260, random);
    return renderCircle(cx, cy, randomIntFromRange(motifSettings.sunRadiusRange, random), palette.secondary, 0.84);
}

function renderMountainLayers(context) {
    return createRange(randomIntFromRange(context.motifSettings.layerCountRange, context.random)).map((layer) => renderMountainLayer(context, layer));
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
    return createRange(randomIntFromRange(context.motifSettings.peakCountRange, context.random)).map((index, _, points) => createMountainPeak(context, layer, baseY, index, points.length));
}

function createMountainPeak({ width, random }, layer, baseY, index, count) {
    return `${(index * (width / (count - 1))).toFixed(1)},${randomInt(160 + layer * 30, baseY - 80, random)}`;
}

function getMountainColor(palette, layer) {
    return [palette.primary, palette.muted, palette.secondary][layer % 3];
}

function renderStarsOrbits(context) {
    return [...renderStars(context), ...renderOrbits(context)].join('');
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

function renderDrumCircles({ palette, motifSettings, random }) {
    return createRange(randomIntFromRange(motifSettings.circleCountRange, random)).map((index) => renderDrumCircle(palette, motifSettings, random, index)).join('');
}

function renderDrumCircle(palette, motifSettings, random, index) {
    const stroke = index % 2 ? palette.secondary : palette.primary;
    return `<circle cx="${randomInt(80, 520, random)}" cy="${randomInt(90, 460, random)}" r="${randomIntFromRange(motifSettings.radiusRange, random)}" fill="none" stroke="${stroke}" stroke-width="${randomInt(4, 14, random)}" opacity="0.42" />`;
}

function renderTapeReel(context) {
    const count = randomIntFromRange(context.motifSettings.reelCountRange, context.random);
    return createRange(count).map((index) => renderTapeReelSet(context, count, index)).join('');
}

function renderTapeReelSet({ palette, motifSettings, random }, count, index) {
    const geometry = createTapeReelGeometry(motifSettings, random, count, index);
    return [renderCircle(geometry.cx, geometry.cy, geometry.radius, palette.primary, 0.42), renderCircle(geometry.cx, geometry.cy, geometry.radius * 0.55, palette.background, 0.72), renderCircle(geometry.cx, geometry.cy, geometry.radius * 0.15, palette.text, 0.75)].join('');
}

function createTapeReelGeometry(motifSettings, random, count, index) {
    return { cx: 130 + index * (340 / Math.max(1, count - 1)), cy: randomInt(220, 350, random), radius: randomIntFromRange(motifSettings.radiusRange, random) };
}

function renderGenericMotif({ width, height, scheme, random }) {
    return createRange(randomInt(8, 18, random)).map(() => renderGenericShape({ width, height, scheme, random })).join('');
}

function renderGenericShape(context) {
    const shape = createGenericShape(context);
    return renderShape(shape, [renderGenericCircle, renderGenericRect, renderGenericTriangle]);
}

function createGenericShape({ width, height, scheme, random }) {
    return { type: randomInt(0, 2, random), color: pickSchemeColor(scheme, random), x: randomInt(40, width - 120, random), y: randomInt(70, height - 160, random), size: randomInt(42, 160, random), rotation: randomInt(-28, 28, random), opacity: (0.22 + random() * 0.42).toFixed(3), random };
}

function renderShape(shape, renderers) {
    return renderers[shape.type]?.(shape) ?? renderGenericTriangle(shape);
}

function renderGenericCircle({ x, y, size, color, opacity }) {
    return renderCircle(x, y, size / 2, color, opacity);
}

function renderGenericRect(shape) {
    return `<rect x="${shape.x}" y="${shape.y}" width="${shape.size}" height="${shape.size * 0.72}" rx="${randomInt(8, 48, shape.random)}" fill="${shape.color}" opacity="${shape.opacity}" transform="${createShapeRotation(shape)}" />`;
}

function renderGenericTriangle(shape) {
    return `<polygon points="${shape.x},${shape.y + shape.size} ${shape.x + shape.size / 2},${shape.y} ${shape.x + shape.size},${shape.y + shape.size}" fill="${shape.color}" opacity="${shape.opacity}" transform="${createShapeRotation(shape)}" />`;
}

function createShapeRotation({ rotation, x, y, size }) {
    return `rotate(${rotation} ${x + size / 2} ${y + size / 2})`;
}

function randomIntFromRange(range, random, fallback = [1, 1]) {
    const [min, max] = Array.isArray(range) ? range : fallback;
    return randomInt(min, max, random);
}

function createRotation({ motifSettings, random }) {
    return randomIntFromRange(motifSettings.rotationRange, random);
}

function wrapRotate(content, rotation, cx, cy) {
    return `<g transform="rotate(${rotation} ${cx} ${cy})">${content}</g>`;
}

function renderCircle(cx, cy, radius, fill, opacity = 1) {
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" opacity="${opacity}" />`;
}

function createRange(length) {
    return Array.from({ length }, (_, index) => index);
}

function createRangeFrom(start, end, step) {
    return Array.from({ length: Math.max(0, Math.ceil((end - start) / step)) }, (_, index) => start + index * step);
}
