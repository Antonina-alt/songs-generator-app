import { randomInt } from '@/lib/randomGenerator';
import { getSchemeColor, pickSchemeColor } from '../colors';
import { createRange, randomIntFromRange } from './shared';

export function renderEqualizer(context) {
    const geometry = createEqualizerGeometry(context);
    return createRange(geometry.count).map((index) => renderEqualizerBar(context, geometry, index)).join('');
}

export function renderWaveform(context) {
    const points = createWaveformPoints(context);

    return [
        renderWaveformLine(context, points, 8, 0.14, pickSchemeColor(context.scheme, context.random)),
        renderWaveformLine(context, points, 0, 0.86, pickSchemeColor(context.scheme, context.random))
    ].join('');
}

export function renderDrumCircles({ palette, motifSettings, random }) {
    return createRange(randomIntFromRange(motifSettings.circleCountRange, random))
        .map((index) => renderDrumCircle(palette, motifSettings, random, index))
        .join('');
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
    const barWidth = getBarWidth(geometry);

    return {
        x: 48 + index * (barWidth + geometry.gap),
        y: height - 92 - barHeight,
        width: barWidth,
        height: barHeight,
        color: getSchemeColor(scheme, index)
    };
}

function getBarWidth({ areaWidth, gap, count }) {
    return Math.max(4, Math.min(16, (areaWidth - gap * count) / count));
}

function createWaveformPoints(context) {
    const geometry = createWaveformGeometry(context);
    return createRange(geometry.count).map((index) => createWaveformPoint(context, geometry, index)).join(' ');
}

function createWaveformGeometry({ width, motifSettings, random }) {
    return {
        count: randomIntFromRange(motifSettings.pointCountRange, random),
        amplitude: randomIntFromRange(motifSettings.amplitudeRange, random),
        centerY: randomInt(210, 390, random),
        width
    };
}

function createWaveformPoint({ random }, geometry, index) {
    const x = 42 + index * ((geometry.width - 84) / (geometry.count - 1));
    return `${x.toFixed(1)},${(geometry.centerY + (random() - 0.5) * geometry.amplitude).toFixed(1)}`;
}

function renderWaveformLine({ motifSettings, random }, points, extraWidth, opacity, color) {
    const width = randomIntFromRange(motifSettings.strokeWidthRange, random) + extraWidth;
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" />`;
}

function renderDrumCircle(palette, motifSettings, random, index) {
    const stroke = index % 2 ? palette.secondary : palette.primary;

    return `<circle cx="${randomInt(80, 520, random)}" cy="${randomInt(90, 460, random)}" r="${randomIntFromRange(motifSettings.radiusRange, random)}" fill="none" stroke="${stroke}" stroke-width="${randomInt(4, 14, random)}" opacity="0.42" />`;
}
