import { clampChroma, converter, formatHex, interpolate, wcagContrast } from 'culori';

const toOklch = converter('oklch');

const COLOR_ORDERS = [
    ['primary', 'secondary', 'accent', 'muted'],
    ['secondary', 'accent', 'primary', 'muted'],
    ['accent', 'primary', 'secondary', 'muted'],
    ['muted', 'primary', 'accent', 'secondary'],
    ['primary', 'accent', 'muted', 'secondary'],
    ['secondary', 'primary', 'muted', 'accent']
];

const SCHEME_NAMES = ['main', 'support', 'highlight', 'quiet'];

export function createColorScheme({ palette, variant = 1 }) {
    const colors = createOrderedColors(palette, variant);
    const named = createNamedColors(colors);
    const scheme = createBaseScheme(palette, named);

    return { ...scheme, backgroundGradient: createBackgroundGradient(palette, scheme, variant) };
}

export function createTextStyle(context, surfaceColor) {
    const scheme = context.scheme ?? createColorScheme(context);
    const surface = surfaceColor ?? scheme.panel;
    const title = getReadableColor(surface, context.palette.text, scheme.highlight, scheme.text);
    const artist = getReadableColor(surface, scheme.support, scheme.main, context.palette.text);

    return { title, artist, muted: createMutedText(surface, artist), panelFill: surface, panelText: title };
}

export function getReadableColor(background, ...candidates) {
    return createCandidates(background, candidates)
        .sort((a, b) => getContrast(b, background) - getContrast(a, background))[0];
}

export function getSchemeColor(scheme, index) {
    return scheme.colors[index % scheme.colors.length];
}

export function pickSchemeColor(scheme, random) {
    return getSchemeColor(scheme, Math.floor(random() * scheme.colors.length));
}

export function shiftLightness(color, amount) {
    return adjustLightness(color, amount);
}

export function adjustLightness(color, delta) {
    const next = toOklch(color);
    return toHex({ ...next, l: clamp(next.l + delta, 0.08, 0.96) });
}

export function adjustChroma(color, delta) {
    const next = toOklch(color);
    return toHex({ ...next, c: Math.max(0, next.c + delta) });
}

export function rotateHue(color, degrees) {
    const next = toOklch(color);
    return toHex({ ...next, h: normalizeHue((next.h ?? 0) + degrees) });
}

export function mixColor(from, to, amount) {
    return toHex(interpolate([from, to], 'oklch')(amount));
}

export function createGradient(colors, count = 5) {
    const scale = interpolate(colors, 'oklch');
    return createGradientSamples(count).map((value) => toHex(scale(value)));
}

export function getReadableText(background, ...candidates) {
    return getReadableColor(background, ...candidates);
}

function createBaseScheme(palette, named) {
    return {
        background: palette.background,
        text: getReadableColor(palette.background, palette.text, named.main),
        colors: Object.values(named),
        ...named,
        ...createDerivedScheme(palette, named)
    };
}

function createDerivedScheme(palette, named) {
    return {
        panel: mixColor(palette.background, getLuminanceFallback(palette.background), 0.1),
        mainSoft: mixColor(named.main, palette.background, 0.32),
        supportSoft: mixColor(named.support, palette.background, 0.28),
        highlightSoft: mixColor(named.highlight, palette.background, 0.24),
        mainDark: adjustLightness(named.main, -0.18),
        supportDark: adjustLightness(named.support, -0.14),
        highlightDark: adjustLightness(named.highlight, -0.16)
    };
}

function createBackgroundGradient(palette, scheme, variant) {
    const hueShift = 8 + variant * 7;
    const colors = [adjustLightness(palette.background, 0.02), scheme.mainSoft, rotateHue(scheme.highlightSoft, hueShift)];
    return createGradient(colors, 5);
}

function createMutedText(background, color) {
    return getContrast(color, background) >= 3 ? color : getReadableColor(background, color);
}

function createCandidates(background, candidates) {
    return [...candidates.filter(Boolean), getLuminanceFallback(background)];
}

function createOrderedColors(palette, variant) {
    return getColorOrder(variant).map((key) => palette[key]);
}

function createNamedColors(colors) {
    return Object.fromEntries(SCHEME_NAMES.map((name, index) => [name, colors[index]]));
}

function getColorOrder(variant) {
    return COLOR_ORDERS[getOrderIndex(variant)];
}

function getOrderIndex(variant) {
    return Math.abs((variant - 1) % COLOR_ORDERS.length);
}

function getLuminanceFallback(color) {
    return toOklch(color).l > 0.58 ? '#111111' : '#ffffff';
}

function getContrast(color, background) {
    return wcagContrast(color, background) || 0;
}

function createGradientSamples(count) {
    if (count <= 1) return [0];
    return Array.from({ length: count }, (_, index) => index / (count - 1));
}

function toHex(color) {
    return formatHex(clampChroma(color, 'oklch'));
}

function normalizeHue(hue) {
    return ((hue % 360) + 360) % 360;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
