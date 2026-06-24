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
    const renderer = MOTIF_RENDERERS[context.motif.id];
    const nextContext = {
        ...context,
        scheme: createColorScheme(context)
    };

    if (renderer) return renderer(nextContext);

    return renderGenericMotif(nextContext);
}

function renderVinyl({ palette, scheme, motifSettings, random }) {
    const cx = randomInt(230, 370, random);
    const cy = randomInt(210, 330, random);
    const radius = randomInt(145, 225, random);
    const ringCount = randomIntFromRange(motifSettings.ringCountRange, random);
    const rings = [];

    rings.push(
        `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${scheme.main}" opacity="0.92" />`
    );

    for (let index = 0; index < ringCount; index++) {
        const ringRadius = 42 + index * ((radius - 48) / ringCount);
        const strokeColor = getSchemeColor(scheme, index + 1);

        rings.push(
            `<circle cx="${cx}" cy="${cy}" r="${ringRadius}" fill="none" stroke="${strokeColor}" stroke-width="1.5" opacity="0.22" />`
        );
    }

    rings.push(
        `<circle cx="${cx}" cy="${cy}" r="${randomIntFromRange(motifSettings.centerRadiusRange, random)}" fill="${scheme.support}" opacity="0.94" />`
    );

    rings.push(
        `<circle cx="${cx}" cy="${cy}" r="14" fill="${scheme.background}" />`
    );

    return `<g transform="rotate(${randomIntFromRange(motifSettings.rotationRange, random)} ${cx} ${cy})">${rings.join('')}</g>`;
}

function renderCassette({ palette, motifSettings, random }) {
    const x = 82;
    const y = randomInt(130, 230, random);
    const width = 436;
    const height = 260;
    const labelHeight = randomIntFromRange(motifSettings.labelHeightRange, random);
    const rotation = randomIntFromRange(motifSettings.rotationRange, random);

    return [
        `<g transform="rotate(${rotation} 300 300)">`,
        `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="28" fill="${palette.primary}" opacity="0.92" />`,
        `<rect x="${x + 36}" y="${y + 34}" width="${width - 72}" height="${labelHeight}" rx="14" fill="${palette.text}" opacity="0.86" />`,
        renderCassetteReel(x + 140, y + 164, palette),
        renderCassetteReel(x + 296, y + 164, palette),
        `<rect x="${x + 142}" y="${y + 206}" width="152" height="34" rx="8" fill="${palette.background}" opacity="0.82" />`,
        renderScrews(x, y, width, height, palette),
        '</g>'
    ].join('');
}

function renderCassetteReel(cx, cy, palette) {
    return [
        `<circle cx="${cx}" cy="${cy}" r="54" fill="${palette.background}" opacity="0.92" />`,
        `<circle cx="${cx}" cy="${cy}" r="28" fill="${palette.muted}" />`,
        `<circle cx="${cx}" cy="${cy}" r="8" fill="${palette.text}" opacity="0.7" />`
    ].join('');
}

function renderScrews(x, y, width, height, palette) {
    return [
        [x + 24, y + 24],
        [x + width - 24, y + 24],
        [x + 24, y + height - 24],
        [x + width - 24, y + height - 24]
    ].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="7" fill="${palette.text}" opacity="0.55" />`).join('');
}

function renderCompactDisc({ palette, motifSettings, random }) {
    const cx = 300;
    const cy = randomInt(230, 330, random);
    const radius = randomInt(150, 230, random);
    const shineCount = randomIntFromRange(motifSettings.shineCountRange, random);
    const shines = [];

    for (let index = 0; index < shineCount; index++) {
        const angle = randomInt(0, 360, random);
        shines.push(`<path d="M ${cx} ${cy} L ${cx + radius} ${cy - 18} L ${cx + radius} ${cy + 18} Z" fill="${palette.text}" opacity="0.08" transform="rotate(${angle} ${cx} ${cy})" />`);
    }

    return [
        `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${palette.secondary}" opacity="0.72" />`,
        ...shines,
        `<circle cx="${cx}" cy="${cy}" r="${randomIntFromRange(motifSettings.holeRadiusRange, random)}" fill="${palette.background}" opacity="0.92" />`,
        `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${palette.text}" stroke-width="3" opacity="0.25" />`
    ].join('');
}

function renderEqualizer({ width, height, scheme, motifSettings, random }) {
    const count = randomIntFromRange(motifSettings.barCountRange, random);
    const gap = 4;
    const areaWidth = width - 96;
    const barWidth = Math.max(4, Math.min(16, (areaWidth - gap * count) / count));
    const bars = [];

    for (let index = 0; index < count; index++) {
        const barHeight = randomIntFromRange(motifSettings.barHeightRange, random);
        const x = 48 + index * (barWidth + gap);
        const y = height - 92 - barHeight;
        const color = getSchemeColor(scheme, index);

        bars.push(
            `<rect x="${x.toFixed(1)}" y="${y}" width="${barWidth.toFixed(1)}" height="${barHeight}" rx="3" fill="${color}" opacity="0.68" />`
        );
    }

    return bars.join('');
}

function renderWaveform({ width, height, scheme, motifSettings, random }) {
    const count = randomIntFromRange(motifSettings.pointCountRange, random);
    const amplitude = randomIntFromRange(motifSettings.amplitudeRange, random);
    const centerY = randomInt(210, 390, random);
    const strokeColor = pickSchemeColor(scheme, random);
    const glowColor = pickSchemeColor(scheme, random);
    const points = [];

    for (let index = 0; index < count; index++) {
        const x = 42 + index * ((width - 84) / (count - 1));
        const y = centerY + (random() - 0.5) * amplitude;
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return [
        `<polyline points="${points.join(' ')}" fill="none" stroke="${glowColor}" stroke-width="${randomIntFromRange(motifSettings.strokeWidthRange, random) + 8}" stroke-linecap="round" stroke-linejoin="round" opacity="0.14" />`,
        `<polyline points="${points.join(' ')}" fill="none" stroke="${strokeColor}" stroke-width="${randomIntFromRange(motifSettings.strokeWidthRange, random)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.86" />`
    ].join('');
}

function renderCitySkyline({ width, height, palette, motifSettings, random }) {
    const count = randomIntFromRange(motifSettings.buildingCountRange, random);
    const horizon = randomIntFromRange(motifSettings.horizonRange, random);
    const buildingWidth = width / count;
    const buildings = [];

    for (let index = 0; index < count; index++) {
        const x = index * buildingWidth;
        const h = randomInt(70, horizon - 70, random);
        const y = horizon - h;

        buildings.push(`<rect x="${x}" y="${y}" width="${buildingWidth + 1}" height="${h}" fill="${palette.primary}" opacity="0.78" />`);
        buildings.push(renderWindows({ x, y, buildingWidth, h, palette, random }));
    }

    return `${buildings.join('')}<rect x="0" y="${horizon}" width="${width}" height="${height - horizon}" fill="${palette.muted}" opacity="0.86" />`;
}

function renderWindows({ x, y, buildingWidth, h, palette, random }) {
    const windows = [];

    for (let wy = y + 16; wy < y + h - 12; wy += 22) {
        for (let wx = x + 10; wx < x + buildingWidth - 8; wx += 18) {
            if (random() > 0.62) {
                windows.push(`<rect x="${wx}" y="${wy}" width="6" height="9" fill="${palette.accent}" opacity="0.72" />`);
            }
        }
    }

    return windows.join('');
}

function renderMountains({ width, height, palette, motifSettings, random }) {
    const layers = [];
    const layerCount = randomIntFromRange(motifSettings.layerCountRange, random);

    layers.push(`<circle cx="${randomInt(120, 480, random)}" cy="${randomInt(120, 260, random)}" r="${randomIntFromRange(motifSettings.sunRadiusRange, random)}" fill="${palette.secondary}" opacity="0.84" />`);

    for (let layer = 0; layer < layerCount; layer++) {
        layers.push(renderMountainLayer({ width, height, palette, motifSettings, random, layer }));
    }

    return layers.join('');
}

function renderMountainLayer({ width, height, palette, motifSettings, random, layer }) {
    const peakCount = randomIntFromRange(motifSettings.peakCountRange, random);
    const baseY = height - 80 + layer * 10;
    const topMin = 160 + layer * 30;
    const points = [`0,${baseY}`];

    for (let index = 0; index < peakCount; index++) {
        const x = index * (width / (peakCount - 1));
        const y = randomInt(topMin, baseY - 80, random);
        points.push(`${x.toFixed(1)},${y}`);
    }

    points.push(`${width},${baseY}`);

    const colors = [palette.primary, palette.muted, palette.secondary];
    return `<polygon points="${points.join(' ')}" fill="${colors[layer % colors.length]}" opacity="${0.42 + layer * 0.08}" />`;
}

function renderStarsOrbits({ width, height, palette, motifSettings, random }) {
    const stars = [];
    const starCount = randomIntFromRange(motifSettings.starCountRange, random);
    const orbitCount = randomIntFromRange(motifSettings.orbitCountRange, random);

    for (let index = 0; index < starCount; index++) {
        stars.push(`<circle cx="${randomInt(0, width, random)}" cy="${randomInt(0, height, random)}" r="${randomInt(1, 3, random)}" fill="${palette.text}" opacity="${0.35 + random() * 0.55}" />`);
    }

    for (let index = 0; index < orbitCount; index++) {
        stars.push(`<ellipse cx="300" cy="300" rx="${randomInt(80, 250, random)}" ry="${randomInt(30, 130, random)}" fill="none" stroke="${palette.accent}" stroke-width="2" opacity="0.3" transform="rotate(${randomInt(0, 180, random)} 300 300)" />`);
    }

    return stars.join('');
}

function renderDrumCircles({ palette, motifSettings, random }) {
    const count = randomIntFromRange(motifSettings.circleCountRange, random);
    const circles = [];

    for (let index = 0; index < count; index++) {
        circles.push(`<circle cx="${randomInt(80, 520, random)}" cy="${randomInt(90, 460, random)}" r="${randomIntFromRange(motifSettings.radiusRange, random)}" fill="none" stroke="${index % 2 ? palette.secondary : palette.primary}" stroke-width="${randomInt(4, 14, random)}" opacity="0.42" />`);
    }

    return circles.join('');
}

function renderTapeReel({ palette, motifSettings, random }) {
    const count = randomIntFromRange(motifSettings.reelCountRange, random);
    const reels = [];

    for (let index = 0; index < count; index++) {
        const cx = 130 + index * (340 / Math.max(1, count - 1));
        const cy = randomInt(220, 350, random);
        const radius = randomIntFromRange(motifSettings.radiusRange, random);
        reels.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${palette.primary}" opacity="0.42" />`);
        reels.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.55}" fill="${palette.background}" opacity="0.72" />`);
        reels.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.15}" fill="${palette.text}" opacity="0.75" />`);
    }

    return reels.join('');
}

function randomIntFromRange(range, random, fallback = [1, 1]) {
    const [min, max] = Array.isArray(range) ? range : fallback;

    return randomInt(min, max, random);
}

function renderGenericMotif({ width, height, scheme, random }) {
    const shapes = Array.from({ length: randomInt(8, 18, random) }, () =>
        renderGenericShape({ width, height, scheme, random })
    );

    return shapes.join('');
}

function renderGenericShape({ width, height, scheme, random }) {
    const type = randomInt(0, 2, random);
    const color = pickSchemeColor(scheme, random);
    const x = randomInt(40, width - 120, random);
    const y = randomInt(70, height - 160, random);
    const size = randomInt(42, 160, random);
    const rotation = randomInt(-28, 28, random);
    const opacity = (0.22 + random() * 0.42).toFixed(3);

    if (type === 0) {
        return `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${color}" opacity="${opacity}" />`;
    }

    if (type === 1) {
        return `<rect x="${x}" y="${y}" width="${size}" height="${size * 0.72}" rx="${randomInt(8, 48, random)}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})" />`;
    }

    return `<polygon points="${x},${y + size} ${x + size / 2},${y} ${x + size},${y + size}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})" />`;
}