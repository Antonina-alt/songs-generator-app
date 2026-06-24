const FRAME_RENDERERS = {
    none: renderNoFrame,
    thin_border: renderThinBorder,
    double_border: renderDoubleBorder,
    thick_poster_border: renderThickPosterBorder,
    off_center_mat: renderOffCenterMat,
    photo_print: renderPhotoPrint,
    ticket_stub: renderTicketStub,
    vinyl_sleeve_cutout: renderVinylSleeveCutout
};

export function renderFrame(context) {
    const renderer = FRAME_RENDERERS[context.frame.id] ?? renderNoFrame;
    return renderer(context);
}

function renderNoFrame() {
    return '';
}

function renderThinBorder({ width, height, palette }) {
    return `<rect x="32" y="32" width="${width - 64}" height="${height - 64}" fill="none" stroke="${palette.text}" stroke-width="3" opacity="0.72" />`;
}

function renderDoubleBorder({ width, height, palette }) {
    return [
        `<rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="${palette.text}" stroke-width="4" opacity="0.76" />`,
        `<rect x="44" y="44" width="${width - 88}" height="${height - 88}" fill="none" stroke="${palette.text}" stroke-width="1.5" opacity="0.46" />`
    ].join('');
}

function renderThickPosterBorder({ width, height, palette }) {
    return [
        `<rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="${palette.text}" stroke-width="34" opacity="0.88" />`,
        `<rect x="34" y="34" width="${width - 68}" height="${height - 68}" fill="none" stroke="${palette.background}" stroke-width="3" opacity="0.4" />`
    ].join('');
}

function renderOffCenterMat({ width, height, palette }) {
    return `<rect x="54" y="38" width="${width - 128}" height="${height - 104}" fill="none" stroke="${palette.text}" stroke-width="18" opacity="0.28" />`;
}

function renderPhotoPrint({ width, height, palette }) {
    return [
        `<rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="${palette.text}" stroke-width="18" opacity="0.86" />`,
        `<rect x="48" y="${height - 86}" width="${width - 96}" height="34" fill="${palette.text}" opacity="0.86" />`
    ].join('');
}

function renderTicketStub({ width, height, palette }) {
    return [
        `<rect x="30" y="30" width="${width - 60}" height="${height - 60}" fill="none" stroke="${palette.text}" stroke-width="4" opacity="0.78" />`,
        `<circle cx="30" cy="300" r="20" fill="${palette.background}" />`,
        `<circle cx="${width - 30}" cy="300" r="20" fill="${palette.background}" />`
    ].join('');
}

function renderVinylSleeveCutout({ width, height, palette }) {
    return [
        `<rect x="30" y="30" width="${width - 60}" height="${height - 60}" fill="none" stroke="${palette.text}" stroke-width="4" opacity="0.65" />`,
        `<circle cx="${width - 30}" cy="300" r="78" fill="${palette.background}" opacity="0.65" />`
    ].join('');
}