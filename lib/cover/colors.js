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
    return { background: palette.background, text: palette.text, colors, ...createNamedColors(colors) };
}

export function getSchemeColor(scheme, index) {
    return scheme.colors[index % scheme.colors.length];
}

export function pickSchemeColor(scheme, random) {
    return getSchemeColor(scheme, Math.floor(random() * scheme.colors.length));
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
