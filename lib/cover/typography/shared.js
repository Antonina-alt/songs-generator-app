import { createTextStyle } from '../colors';
import { fitSingleLineText, fitTextBlock } from '../text';
import { renderSingleLineText, renderTextLines } from '../svgText';

const LAYOUT_TITLE_MAX = {
    bottom_label: 48,
    top_title: 42,
    centered: 34,
    large_type: 48,
    diagonal_band: 42,
    split_poster: 38,
    record_sleeve: 32,
    magazine: 46,
    circle_label: 28,
    vertical_title: 30,
    poster_stack: 42,
    floating_cards: 36
};

const LAYOUT_TITLE_MIN = {
    bottom_label: 22,
    top_title: 20,
    centered: 18,
    large_type: 24,
    diagonal_band: 20,
    split_poster: 18,
    record_sleeve: 16,
    magazine: 22,
    circle_label: 16,
    vertical_title: 16,
    poster_stack: 22,
    floating_cards: 18
};

export function createSurfaceTextContext(context, surface) {
    return { ...context, textStyle: createTextStyle(context, surface) };
}

export function renderStackedText(context, layout) {
    return [renderTitleText(context, layout.title), renderArtistText(context, layout.artist)].join('');
}

export function renderTitleText(context, part) {
    return renderTextBlock(context, part, {
        weight: part.weight ?? 900,
        color: part.color ?? context.textStyle.title
    });
}

export function renderArtistText(context, part) {
    return renderTextBlock(context, part, {
        weight: part.weight ?? 600,
        opacity: part.opacity ?? 0.88,
        color: part.color ?? context.textStyle.artist
    });
}

export function fitTitle(context, width, options = {}) {
    return fitTextBlock({
        text: context.song.title,
        width,
        maxLines: getTitleLines(context, options),
        maxFontSize: options.maxFontSize ?? getTitleMaxSize(context),
        minFontSize: options.minFontSize ?? getTitleMinSize(context),
        letterSpacing: context.typography.letterSpacing,
        lineHeight: options.lineHeight ?? 1.04,
        maxHeight: options.maxHeight
    });
}

export function fitArtist(context, width, options = {}) {
    return fitTextBlock({
        text: context.song.artist,
        width,
        maxLines: options.maxLines ?? 2,
        maxFontSize: options.maxFontSize ?? getArtistMaxSize(context),
        minFontSize: options.minFontSize ?? 11,
        letterSpacing: context.typography.letterSpacing,
        lineHeight: options.lineHeight ?? 1.08
    });
}

export function fitSingleArtist(context, width, maxFontSize, minFontSize) {
    return fitSingleLineText({
        text: context.song.artist,
        width,
        maxFontSize,
        minFontSize,
        letterSpacing: context.typography.letterSpacing
    });
}

export function createTextPart(block, x, y, weight, opacity) {
    return { block, x, y, weight, opacity };
}

export function createAnchoredPart(block, x, y, weight, opacity, anchor = 'middle') {
    return { ...createTextPart(block, x, y, weight, opacity), props: { anchor } };
}

export function createSafeAreaParts(context, title, artist, titleY, gap, options) {
    const artistY = Math.min(titleY + title.height + gap, context.safeArea.y + context.safeArea.height - 24);

    return {
        title: createTextPart(title, context.safeArea.x, titleY, options.titleWeight, options.titleOpacity ?? 0.94),
        artist: createTextPart(artist, context.safeArea.x, artistY, options.artistWeight, options.artistOpacity)
    };
}

export function getArtistMaxSize(context) {
    return Math.min(context.typography.artistSize, 22);
}

export function getFirstBaselineByBlockBottom(block, bottomY) {
    return bottomY - block.height + block.fontSize;
}

export function renderRoundedRect(box, color, opacity) {
    return `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="24" fill="${color}" opacity="${opacity}" />`;
}

export function renderMagazineDecor({ safeArea, palette }) {
    return [
        `<rect x="${safeArea.x}" y="60" width="180" height="24" fill="${palette.accent}" opacity="0.85" />`,
        `<rect x="${safeArea.x}" y="96" width="104" height="10" fill="${palette.text}" opacity="0.56" />`
    ].join('');
}

export function wrapSvgGroup(content, transform) {
    return [`<g transform="${transform}">`, content, '</g>'].join('');
}

function renderTextBlock(context, part, defaults) {
    if (part.block.lines) {
        return renderTextLines({ ...createTextProps(context, part, defaults), lines: part.block.lines, lineHeight: part.block.lineHeight });
    }

    return renderSingleLineText({ ...createTextProps(context, part, defaults), text: part.block.text });
}

function createTextProps(context, part, defaults) {
    return {
        x: part.x,
        y: part.y,
        fontSize: part.block.fontSize,
        color: context.textStyle.title,
        letterSpacing: context.typography.letterSpacing,
        ...defaults,
        ...part.props
    };
}

function getTitleLines(context, options) {
    return Math.min(options.maxLines ?? context.layout.maxTitleLines, context.layout.maxTitleLines);
}

function getTitleMaxSize(context) {
    return Math.min(context.typography.titleSize, LAYOUT_TITLE_MAX[context.layout.id] ?? 42);
}

function getTitleMinSize(context) {
    return LAYOUT_TITLE_MIN[context.layout.id] ?? 18;
}
