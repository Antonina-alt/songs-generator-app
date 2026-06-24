import {  fitSingleLineText, fitTextBlock } from '../text';
import { renderSingleLineText, renderTextLines } from '../svgText';

const TYPOGRAPHY_RENDERERS = {
    bottom_label: renderBottomLabel,
    top_title: renderTopTitle,
    centered: renderCentered,
    large_type: renderLargeType,
    diagonal_band: renderDiagonalBand,
    split_poster: renderSplitPoster,
    record_sleeve: renderRecordSleeve,
    magazine: renderMagazine,
    circle_label: renderCircleLabel,
    vertical_title: renderVerticalTitle,
    poster_stack: renderPosterStack,
    floating_cards: renderFloatingCards
};

const LAYOUT_FALLBACKS = {
    diagonal_band: 'split_poster',
    circle_label: 'bottom_label',
    vertical_title: 'top_title',
    floating_cards: 'bottom_label',
    large_type: 'poster_stack'
};

const TITLE_MAX_SIZE_BY_LAYOUT = {
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

const TITLE_MIN_SIZE_BY_LAYOUT = {
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

export function renderTypography(context) {
    const layoutId = getEffectiveLayoutId(context);
    const renderer = TYPOGRAPHY_RENDERERS[layoutId] ?? renderBottomLabel;

    return renderer({
        ...context,
        layout: { ...context.layout, id: layoutId }
    });
}

function getEffectiveLayoutId(context) {
    const titleLength = context.song.title.length;
    const layoutId = context.layout.id;

    if (isLayoutTooRisky(layoutId, titleLength)) {
        return LAYOUT_FALLBACKS[layoutId] ?? 'bottom_label';
    }

    return layoutId;
}

function isLayoutTooRisky(layoutId, titleLength) {
    const limits = {
        vertical_title: 16,
        circle_label: 18,
        floating_cards: 22,
        large_type: 24,
        diagonal_band: 28,
        centered: 30,
        magazine: 34
    };

    return titleLength > (limits[layoutId] ?? 40);
}

function renderBottomLabel(context) {
    const { palette, typography, layout } = context;

    const panel = {
        x: 46,
        y: 372,
        width: 508,
        height: 166,
        paddingX: 18,
        paddingTop: 24,
        paddingBottom: 20,
        gap: 14
    };

    const contentWidth = getInnerWidth(panel);

    const artist = fitArtistBlock(context, contentWidth, {
        maxLines: 2,
        maxFontSize: Math.min(typography.artistSize, 22),
        minFontSize: 11
    });

    const title = fitTitleBlock(context, contentWidth, {
        maxLines: layout.maxTitleLines,
        maxFontSize: Math.min(typography.titleSize, 48),
        minFontSize: 20,
        lineHeight: 1.04,
        maxHeight: getTitleMaxHeight(panel, artist)
    });

    const titleX = panel.x + panel.paddingX;
    const titleY = panel.y + panel.paddingTop;
    const artistY = titleY + title.height + panel.gap;

    return [
        `<rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" rx="24" fill="${palette.background}" opacity="0.72" />`,
        renderTextLines({
            lines: title.lines,
            x: titleX,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 800,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderArtistBlock({
            artist,
            x: titleX,
            y: artistY,
            palette,
            typography,
            weight: 500,
            opacity: 0.88
        })
    ].join('');
}

function renderTopTitle(context) {
    const { palette, typography, layout, safeArea } = context;

    const panel = {
        x: safeArea.x,
        y: safeArea.y,
        width: safeArea.width,
        height: 158,
        paddingX: 22,
        paddingTop: 28,
        paddingBottom: 20,
        gap: 14
    };

    const contentWidth = getInnerWidth(panel);

    const artist = fitArtistBlock(context, contentWidth, {
        maxLines: 2,
        maxFontSize: getArtistMaxSize(context),
        minFontSize: 11
    });

    const title = fitTitleBlock(context, contentWidth, {
        maxLines: Math.min(layout.maxTitleLines, 2),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: 18,
        lineHeight: 1.04,
        maxHeight: getTitleMaxHeight(panel, artist)
    });

    const titleX = panel.x + panel.paddingX;
    const titleY = panel.y + panel.paddingTop;
    const artistY = titleY + title.height + panel.gap;

    return [
        `<rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" rx="24" fill="${palette.background}" opacity="0.68" />`,
        renderTextLines({
            lines: title.lines,
            x: titleX,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 850,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderArtistBlock({
            artist,
            x: titleX,
            y: artistY,
            palette,
            typography,
            weight: 600,
            opacity: 0.84
        })
    ].join('');
}

function renderCentered(context) {
    const { song, palette, typography, layout } = context;

    const title = fitTextBlock({
        text: song.title,
        width: 300,
        maxLines: Math.min(layout.maxTitleLines, 3),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: getTitleMinSize(context),
        letterSpacing: typography.letterSpacing
    });

    const artist = fitSingleLineText({
        text: song.artist,
        width: 300,
        maxFontSize: Math.min(typography.artistSize, 18),
        minFontSize: 12,
        letterSpacing: typography.letterSpacing
    });

    const titleY = 275 - title.height / 2;
    const artistY = titleY + title.height + 28;

    return [
        `<circle cx="300" cy="300" r="178" fill="${palette.background}" opacity="0.64" />`,
        renderTextLines({
            lines: title.lines,
            x: 300,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 900,
            anchor: 'middle',
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderSingleLineText({
            text: artist.text,
            x: 300,
            y: artistY,
            fontSize: artist.fontSize,
            color: palette.text,
            weight: 600,
            anchor: 'middle',
            opacity: 0.88,
            letterSpacing: typography.letterSpacing
        })
    ].join('');
}

function renderLargeType(context) {
    const { song, palette, typography, layout, safeArea } = context;

    const title = fitTextBlock({
        text: song.title,
        width: safeArea.width,
        maxLines: Math.min(layout.maxTitleLines, 4),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: getTitleMinSize(context),
        letterSpacing: typography.letterSpacing,
        lineHeight: 0.96
    });

    const artist = fitSingleLineText({
        text: song.artist,
        width: safeArea.width,
        maxFontSize: getArtistMaxSize(context),
        minFontSize: 12,
        letterSpacing: typography.letterSpacing
    });

    const titleY = 150;
    const artistY = Math.min(titleY + title.height + 24, safeArea.y + safeArea.height - 30);

    return [
        renderTextLines({
            lines: title.lines,
            x: safeArea.x,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 950,
            lineHeight: title.lineHeight,
            opacity: 0.94,
            letterSpacing: typography.letterSpacing
        }),
        renderSingleLineText({
            text: artist.text,
            x: safeArea.x,
            y: artistY,
            fontSize: artist.fontSize,
            color: palette.text,
            weight: 600,
            opacity: 0.82,
            letterSpacing: typography.letterSpacing
        })
    ].join('');
}

function renderDiagonalBand(context) {
    const { palette, typography, layout } = context;

    const band = {
        x: -60,
        y: 240,
        width: 720,
        contentX: 70,
        titleY: 286,
        contentWidth: 470,
        paddingY: 32,
        gap: 16
    };

    const artist = fitArtistBlock(context, band.contentWidth, {
        maxLines: 2,
        maxFontSize: Math.min(typography.artistSize, 20),
        minFontSize: 10
    });

    const title = fitTitleBlock(context, band.contentWidth, {
        maxLines: Math.min(layout.maxTitleLines, 2),
        maxFontSize: Math.min(typography.titleSize, 42),
        minFontSize: 18,
        lineHeight: 1.04,
        maxHeight: Math.max(44, 156 - band.gap - artist.height)
    });

    const bandHeight = Math.max(140, title.height + artist.height + band.gap + band.paddingY * 2);
    const artistY = band.titleY + title.height + band.gap;

    return [
        `<g transform="rotate(-11 300 300)">`,
        `<rect x="${band.x}" y="${band.y}" width="${band.width}" height="${bandHeight}" fill="${palette.primary}" opacity="0.88" />`,
        renderTextLines({
            lines: title.lines,
            x: band.contentX,
            y: band.titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 900,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderArtistBlock({
            artist,
            x: band.contentX + 2,
            y: artistY,
            palette,
            typography,
            weight: 600,
            opacity: 0.88
        }),
        `</g>`
    ].join('');
}

function renderSplitPoster(context) {
    const { palette, typography, layout, safeArea } = context;

    const panel = {
        x: 330,
        y: safeArea.y,
        width: 220,
        height: safeArea.height,
        paddingX: 20,
        paddingTop: 72,
        paddingBottom: 46,
        gap: 18
    };

    const contentWidth = getInnerWidth(panel);

    const artist = fitArtistBlock(context, contentWidth, {
        maxLines: 3,
        maxFontSize: Math.min(getArtistMaxSize(context), 18),
        minFontSize: 10
    });

    const title = fitTitleBlock(context, contentWidth, {
        maxLines: Math.min(layout.maxTitleLines, 4),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: 16,
        lineHeight: 1.04,
        maxHeight: getTitleMaxHeight(panel, artist)
    });

    const titleX = panel.x + panel.paddingX;
    const titleY = panel.y + panel.paddingTop;
    const artistY = titleY + title.height + panel.gap;

    return [
        `<rect x="${panel.x}" y="0" width="${600 - panel.x}" height="600" fill="${palette.background}" opacity="0.76" />`,
        renderTextLines({
            lines: title.lines,
            x: titleX,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 900,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderArtistBlock({
            artist,
            x: titleX,
            y: artistY,
            palette,
            typography,
            weight: 600,
            opacity: 0.86
        })
    ].join('');
}

function renderRecordSleeve(context) {
    const { palette, typography, layout, safeArea } = context;

    const gap = 18;
    const titleY = safeArea.y + 30;
    const artistBottomY = safeArea.y + safeArea.height - 22;

    const artist = fitArtistBlock(context, safeArea.width, {
        maxLines: 2,
        maxFontSize: getArtistMaxSize(context),
        minFontSize: 10
    });

    const title = fitTitleBlock(context, safeArea.width, {
        maxLines: Math.min(layout.maxTitleLines, 3),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: getTitleMinSize(context),
        lineHeight: 1.02,
        maxHeight: Math.max(40, artistBottomY - titleY - artist.height - gap)
    });

    const titleX = safeArea.x;
    const artistY = getFirstBaselineByBlockBottom(artist, artistBottomY);

    return [
        renderTextLines({
            lines: title.lines,
            x: titleX,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 800,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderArtistBlock({
            artist,
            x: titleX,
            y: artistY,
            palette,
            typography,
            weight: 500,
            opacity: 0.84
        })
    ].join('');
}

function renderMagazine(context) {
    const { song, palette, typography, layout, safeArea } = context;

    const title = fitTextBlock({
        text: song.title,
        width: safeArea.width,
        maxLines: Math.min(layout.maxTitleLines, 4),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: getTitleMinSize(context),
        letterSpacing: typography.letterSpacing,
        lineHeight: 0.94
    });

    const artist = fitSingleLineText({
        text: song.artist,
        width: safeArea.width,
        maxFontSize: getArtistMaxSize(context),
        minFontSize: 12,
        letterSpacing: typography.letterSpacing
    });

    const titleY = 220;
    const artistY = Math.min(titleY + title.height + 22, safeArea.y + safeArea.height - 24);

    return [
        `<rect x="${safeArea.x}" y="60" width="180" height="24" fill="${palette.accent}" opacity="0.85" />`,
        `<rect x="${safeArea.x}" y="96" width="104" height="10" fill="${palette.text}" opacity="0.56" />`,
        renderTextLines({
            lines: title.lines,
            x: safeArea.x,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 950,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderSingleLineText({
            text: artist.text,
            x: safeArea.x,
            y: artistY,
            fontSize: artist.fontSize,
            color: palette.text,
            weight: 700,
            opacity: 0.9,
            letterSpacing: typography.letterSpacing
        })
    ].join('');
}

function renderCircleLabel(context) {
    const { palette, typography, layout } = context;

    const label = {
        cx: 300,
        cy: 300,
        radius: 138,
        textWidth: 210,
        paddingY: 36,
        gap: 14
    };

    const artist = fitArtistBlock(context, label.textWidth, {
        maxLines: 2,
        maxFontSize: Math.min(typography.artistSize, 16),
        minFontSize: 9,
        lineHeight: 1.05
    });

    const title = fitTitleBlock(context, label.textWidth, {
        maxLines: Math.min(layout.maxTitleLines, 3),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: 14,
        lineHeight: 1.04,
        maxHeight: Math.max(36, label.radius * 2 - label.paddingY * 2 - label.gap - artist.height)
    });

    const contentHeight = title.height + label.gap + artist.height;
    const titleY = label.cy - contentHeight / 2 + title.fontSize;
    const artistY = titleY + title.height + label.gap;

    return [
        `<circle cx="${label.cx}" cy="${label.cy}" r="${label.radius}" fill="${palette.background}" stroke="${palette.text}" stroke-width="3" opacity="0.78" />`,
        renderTextLines({
            lines: title.lines,
            x: label.cx,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 800,
            anchor: 'middle',
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderArtistBlock({
            artist,
            x: label.cx,
            y: artistY,
            palette,
            typography,
            weight: 600,
            anchor: 'middle',
            opacity: 0.86
        })
    ].join('');
}

function renderVerticalTitle(context) {
    const { song, palette, typography, layout, safeArea } = context;

    const title = fitTextBlock({
        text: song.title,
        width: 300,
        maxLines: Math.min(layout.maxTitleLines, 2),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: getTitleMinSize(context),
        letterSpacing: typography.letterSpacing
    });

    const artist = fitSingleLineText({
        text: song.artist,
        width: 240,
        maxFontSize: getArtistMaxSize(context),
        minFontSize: 12,
        letterSpacing: typography.letterSpacing
    });

    return [
        `<g transform="rotate(-90 120 360)">`,
        renderTextLines({
            lines: title.lines,
            x: 120,
            y: 360,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 900,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        '</g>',
        renderSingleLineText({
            text: artist.text,
            x: safeArea.x + safeArea.width,
            y: safeArea.y + safeArea.height - 28,
            fontSize: artist.fontSize,
            color: palette.text,
            weight: 600,
            anchor: 'end',
            opacity: 0.88,
            letterSpacing: typography.letterSpacing
        })
    ].join('');
}

function renderPosterStack(context) {
    const { song, palette, typography, layout, safeArea } = context;

    const title = fitTextBlock({
        text: song.title,
        width: safeArea.width,
        maxLines: Math.min(layout.maxTitleLines, 4),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: getTitleMinSize(context),
        letterSpacing: typography.letterSpacing,
        lineHeight: 1
    });

    const artist = fitSingleLineText({
        text: song.artist,
        width: safeArea.width,
        maxFontSize: getArtistMaxSize(context),
        minFontSize: 12,
        letterSpacing: typography.letterSpacing
    });

    return [
        renderSingleLineText({
            text: artist.text,
            x: safeArea.x,
            y: safeArea.y + 26,
            fontSize: artist.fontSize,
            color: palette.text,
            weight: 600,
            opacity: 0.78,
            letterSpacing: typography.letterSpacing
        }),
        renderTextLines({
            lines: title.lines,
            x: safeArea.x,
            y: 190,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 950,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        })
    ].join('');
}

function renderFloatingCards(context) {
    const { palette, typography, layout } = context;

    const card = {
        x: 116,
        y: 176,
        width: 368,
        height: 250,
        paddingX: 28,
        paddingTop: 46,
        paddingBottom: 32,
        gap: 16
    };

    const contentWidth = getInnerWidth(card);

    const artist = fitArtistBlock(context, contentWidth, {
        maxLines: 2,
        maxFontSize: getArtistMaxSize(context),
        minFontSize: 10
    });

    const title = fitTitleBlock(context, contentWidth, {
        maxLines: Math.min(layout.maxTitleLines, 3),
        maxFontSize: getTitleMaxSize(context),
        minFontSize: 16,
        lineHeight: 1.02,
        maxHeight: getTitleMaxHeight(card, artist)
    });

    const titleX = card.x + card.paddingX;
    const titleY = card.y + card.paddingTop;
    const artistY = titleY + title.height + card.gap;

    return [
        `<rect x="80" y="112" width="390" height="250" rx="28" fill="${palette.background}" opacity="0.62" transform="rotate(-7 300 255)" />`,
        `<rect x="126" y="220" width="390" height="210" rx="24" fill="${palette.primary}" opacity="0.58" transform="rotate(8 320 320)" />`,
        `<rect x="${card.x}" y="${card.y}" width="${card.width}" height="${card.height}" rx="26" fill="${palette.background}" opacity="0.78" />`,
        renderTextLines({
            lines: title.lines,
            x: titleX,
            y: titleY,
            fontSize: title.fontSize,
            color: palette.text,
            weight: 900,
            lineHeight: title.lineHeight,
            letterSpacing: typography.letterSpacing
        }),
        renderArtistBlock({
            artist,
            x: titleX,
            y: artistY,
            palette,
            typography,
            weight: 600,
            opacity: 0.88
        })
    ].join('');
}

function getTitleMaxSize(context) {
    const limit = TITLE_MAX_SIZE_BY_LAYOUT[context.layout.id] ?? 42;
    return Math.min(context.typography.titleSize, limit);
}

function getTitleMinSize(context) {
    return TITLE_MIN_SIZE_BY_LAYOUT[context.layout.id] ?? 18;
}

function getArtistMaxSize(context) {
    return Math.min(context.typography.artistSize, 22);
}

function fitArtistBlock(context, width, options = {}) {
    return fitTextBlock({
        text: context.song.artist,
        width,
        maxLines: options.maxLines ?? 2,
        maxFontSize: options.maxFontSize ?? getArtistMaxSize(context),
        minFontSize: options.minFontSize ?? 11,
        letterSpacing: context.typography.letterSpacing,
        lineHeight: 1.08
    });
}

function renderArtistBlock({ artist, x, y, palette, typography, anchor = 'start', weight = 600, opacity = 0.88 }) {
    return renderTextLines({
        lines: artist.lines,
        x,
        y,
        fontSize: artist.fontSize,
        color: palette.text,
        weight,
        anchor,
        opacity,
        lineHeight: artist.lineHeight,
        letterSpacing: typography.letterSpacing
    });
}

function fitTitleBlock(context, width, options = {}) {
    const { song, typography } = context;

    return fitTextBlock({
        text: song.title,
        width,
        maxLines: options.maxLines ?? context.layout.maxTitleLines,
        maxFontSize: options.maxFontSize ?? getTitleMaxSize(context),
        minFontSize: options.minFontSize ?? getTitleMinSize(context),
        letterSpacing: typography.letterSpacing,
        lineHeight: options.lineHeight ?? 1.04,
        maxHeight: options.maxHeight
    });
}

function getInnerWidth(box) {
    return box.width - box.paddingX * 2;
}

function getTitleMaxHeight(box, artist) {
    return Math.max(36, box.height - box.paddingTop - box.paddingBottom - box.gap - artist.height);
}

function getFirstBaselineByBlockBottom(block, bottomY) {
    return bottomY - block.height + block.fontSize;
}