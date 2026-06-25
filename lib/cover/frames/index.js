import { createColorScheme, mixColor } from '../colors';

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
    return getFrameRenderer(context.frame.id)(withScheme(context));
}

function getFrameRenderer(frameId) {
    return FRAME_RENDERERS[frameId] ?? renderNoFrame;
}

function withScheme(context) {
    return { ...context, scheme: context.scheme ?? createColorScheme(context) };
}

function renderNoFrame() {
    return '';
}

function renderThinBorder({ width, height, scheme }) {
    return `<rect x="32" y="32" width="${width - 64}" height="${height - 64}" fill="none" stroke="${scheme.text}" stroke-width="3" opacity="0.72" />`;
}

function renderDoubleBorder({ width, height, scheme }) {
    return [renderFrameRect(28, width - 56, height - 56, scheme.text, 4, 0.76), renderFrameRect(44, width - 88, height - 88, scheme.supportSoft, 1.5, 0.7)].join('');
}

function renderThickPosterBorder({ width, height, scheme }) {
    return [renderOuterBorder(width, height, scheme), renderInnerPosterBorder(width, height, scheme)].join('');
}

function renderOffCenterMat({ width, height, scheme }) {
    return `<rect x="54" y="38" width="${width - 128}" height="${height - 104}" fill="none" stroke="${scheme.text}" stroke-width="18" opacity="0.3" />`;
}

function renderPhotoPrint({ width, height, scheme }) {
    return [renderFrameRect(24, width - 48, height - 48, scheme.text, 18, 0.86), renderPhotoCaption(width, height, scheme)].join('');
}

function renderTicketStub({ width, height, scheme }) {
    return [renderFrameRect(30, width - 60, height - 60, scheme.text, 4, 0.78), renderTicketHole(30, scheme), renderTicketHole(width - 30, scheme)].join('');
}

function renderVinylSleeveCutout({ width, height, scheme }) {
    return [renderFrameRect(30, width - 60, height - 60, scheme.text, 4, 0.65), renderSleeveCutout(width, scheme)].join('');
}

function renderFrameRect(offset, width, height, color, strokeWidth, opacity) {
    return `<rect x="${offset}" y="${offset}" width="${width}" height="${height}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
}

function renderOuterBorder(width, height, scheme) {
    return `<rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="${scheme.text}" stroke-width="34" opacity="0.88" />`;
}

function renderInnerPosterBorder(width, height, scheme) {
    const color = mixColor(scheme.background, scheme.text, 0.18);
    return `<rect x="34" y="34" width="${width - 68}" height="${height - 68}" fill="none" stroke="${color}" stroke-width="3" opacity="0.5" />`;
}

function renderPhotoCaption(width, height, scheme) {
    return `<rect x="48" y="${height - 86}" width="${width - 96}" height="34" fill="${scheme.text}" opacity="0.86" />`;
}

function renderTicketHole(cx, scheme) {
    return `<circle cx="${cx}" cy="300" r="20" fill="${scheme.background}" />`;
}

function renderSleeveCutout(width, scheme) {
    return `<circle cx="${width - 30}" cy="300" r="78" fill="${scheme.background}" opacity="0.65" />`;
}
