import { splitText } from '../text';
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

export function renderTypography(context) {
    const renderer = TYPOGRAPHY_RENDERERS[context.layout.id] ?? renderBottomLabel;
    return renderer(context);
}

function renderBottomLabel(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 18, layout.maxTitleLines);

    return [
        `<rect x="46" y="388" width="508" height="150" rx="24" fill="${palette.background}" opacity="0.64" />`,
        renderTextLines({
            lines,
            x: 64,
            y: 435,
            fontSize: typography.titleSize,
            color: palette.text,
            weight: 800
        }),
        renderSingleLineText({
            text: song.artist,
            x: 66,
            y: 510,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 500,
            opacity: 0.88
        })
    ].join('');
}

function renderTopTitle(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 20, layout.maxTitleLines);

    return [
        `<rect x="42" y="42" width="516" height="132" rx="24" fill="${palette.background}" opacity="0.58" />`,
        renderTextLines({
            lines,
            x: 62,
            y: 92,
            fontSize: typography.titleSize,
            color: palette.text,
            weight: 850
        }),
        renderSingleLineText({
            text: song.artist,
            x: 62,
            y: 530,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600
        })
    ].join('');
}

function renderCentered(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 16, layout.maxTitleLines);

    return [
        `<circle cx="300" cy="300" r="178" fill="${palette.background}" opacity="0.58" />`,
        renderTextLines({
            lines,
            x: 300,
            y: 280,
            fontSize: typography.titleSize,
            color: palette.text,
            weight: 900,
            anchor: 'middle'
        }),
        renderSingleLineText({
            text: song.artist,
            x: 300,
            y: 390,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600,
            anchor: 'middle',
            opacity: 0.88
        })
    ].join('');
}

function renderLargeType(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 11, layout.maxTitleLines);

    return [
        renderTextLines({
            lines,
            x: 52,
            y: 160,
            fontSize: Math.max(52, typography.titleSize),
            color: palette.text,
            weight: 950,
            lineHeight: 0.95,
            opacity: 0.94
        }),
        renderSingleLineText({
            text: song.artist,
            x: 54,
            y: 548,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600,
            opacity: 0.82
        })
    ].join('');
}

function renderDiagonalBand(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 16, layout.maxTitleLines);

    return [
        `<g transform="rotate(-11 300 300)">`,
        `<rect x="-60" y="252" width="720" height="150" fill="${palette.primary}" opacity="0.88" />`,
        renderTextLines({
            lines,
            x: 70,
            y: 306,
            fontSize: typography.titleSize,
            color: palette.text,
            weight: 900
        }),
        renderSingleLineText({
            text: song.artist,
            x: 72,
            y: 376,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600,
            opacity: 0.88
        }),
        '</g>'
    ].join('');
}

function renderSplitPoster(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 12, layout.maxTitleLines);

    return [
        `<rect x="330" y="0" width="270" height="600" fill="${palette.background}" opacity="0.76" />`,
        renderTextLines({
            lines,
            x: 356,
            y: 150,
            fontSize: Math.min(typography.titleSize, 48),
            color: palette.text,
            weight: 900
        }),
        renderSingleLineText({
            text: song.artist,
            x: 356,
            y: 494,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600,
            opacity: 0.86
        })
    ].join('');
}

function renderRecordSleeve(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 18, layout.maxTitleLines);

    return [
        renderTextLines({
            lines,
            x: 56,
            y: 78,
            fontSize: Math.min(typography.titleSize, 34),
            color: palette.text,
            weight: 800
        }),
        renderSingleLineText({
            text: song.artist,
            x: 56,
            y: 540,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 500,
            opacity: 0.84
        })
    ].join('');
}

function renderMagazine(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 12, layout.maxTitleLines);

    return [
        `<rect x="42" y="60" width="180" height="24" fill="${palette.accent}" opacity="0.85" />`,
        `<rect x="42" y="96" width="104" height="10" fill="${palette.text}" opacity="0.56" />`,
        renderTextLines({
            lines,
            x: 48,
            y: 250,
            fontSize: Math.max(46, typography.titleSize),
            color: palette.text,
            weight: 950,
            lineHeight: 0.92
        }),
        renderSingleLineText({
            text: song.artist,
            x: 50,
            y: 532,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 700,
            opacity: 0.9
        })
    ].join('');
}

function renderCircleLabel(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 13, layout.maxTitleLines);

    return [
        `<circle cx="300" cy="300" r="132" fill="${palette.background}" stroke="${palette.text}" stroke-width="3" opacity="0.78" />`,
        renderTextLines({
            lines,
            x: 300,
            y: 270,
            fontSize: Math.min(typography.titleSize, 34),
            color: palette.text,
            weight: 800,
            anchor: 'middle'
        }),
        renderSingleLineText({
            text: song.artist,
            x: 300,
            y: 360,
            fontSize: Math.min(typography.artistSize, 18),
            color: palette.text,
            weight: 600,
            anchor: 'middle',
            opacity: 0.86
        })
    ].join('');
}

function renderVerticalTitle(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 14, layout.maxTitleLines);

    return [
        `<g transform="rotate(-90 70 300)">`,
        renderTextLines({
            lines,
            x: 70,
            y: 300,
            fontSize: Math.min(typography.titleSize, 40),
            color: palette.text,
            weight: 900
        }),
        '</g>',
        renderSingleLineText({
            text: song.artist,
            x: 548,
            y: 540,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600,
            anchor: 'end',
            opacity: 0.88
        })
    ].join('');
}

function renderPosterStack(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 14, layout.maxTitleLines);

    return [
        renderSingleLineText({
            text: song.artist,
            x: 56,
            y: 74,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600,
            opacity: 0.78
        }),
        ...lines.map((line, index) =>
            `<text x="56" y="${210 + index * 62}" font-family="Arial, sans-serif" font-size="${Math.min(typography.titleSize, 54)}" font-weight="950" fill="${palette.text}">${line}</text>`
        )
    ].join('');
}

function renderFloatingCards(context) {
    const { song, palette, typography, layout } = context;
    const lines = splitText(song.title, 14, layout.maxTitleLines);

    return [
        `<rect x="90" y="130" width="390" height="250" rx="28" fill="${palette.background}" opacity="0.72" transform="rotate(-7 300 255)" />`,
        `<rect x="126" y="212" width="390" height="210" rx="24" fill="${palette.primary}" opacity="0.74" transform="rotate(8 320 320)" />`,
        renderTextLines({
            lines,
            x: 132,
            y: 214,
            fontSize: Math.min(typography.titleSize, 42),
            color: palette.text,
            weight: 900
        }),
        renderSingleLineText({
            text: song.artist,
            x: 134,
            y: 402,
            fontSize: typography.artistSize,
            color: palette.text,
            weight: 600
        })
    ].join('');
}