import {
    createAnchoredPart,
    createSafeAreaParts,
    createSurfaceTextContext,
    createTextPart,
    fitArtist,
    fitSingleArtist,
    fitTitle,
    getArtistMaxSize,
    getFirstBaselineByBlockBottom,
    renderArtistText,
    renderMagazineDecor,
    renderStackedText,
    renderTitleText,
    wrapSvgGroup
} from './shared';

export function renderRecordSleeve(context) {
    return renderStackedText(context, createSleeveTextLayout(context));
}

export function renderCentered(context) {
    const panelContext = createSurfaceTextContext(context, context.scheme.panel);
    const layout = createCenteredTextLayout(panelContext);

    return [
        `<circle cx="300" cy="300" r="178" fill="${panelContext.textStyle.panelFill}" opacity="0.72" />`,
        renderStackedText(panelContext, layout)
    ].join('');
}

export function renderCircleLabel(context) {
    const panelContext = createSurfaceTextContext(context, context.scheme.panel);
    const layout = createCircleLabelTextLayout(panelContext);

    return [
        `<circle cx="300" cy="300" r="138" fill="${panelContext.textStyle.panelFill}" stroke="${panelContext.textStyle.title}" stroke-width="3" opacity="0.82" />`,
        renderStackedText(panelContext, layout)
    ].join('');
}

export function renderLargeType(context) {
    return renderStackedText(context, createLargeTypeTextLayout(context));
}

export function renderMagazine(context) {
    return [renderMagazineDecor(context), renderStackedText(context, createMagazineTextLayout(context))].join('');
}

export function renderVerticalTitle(context) {
    const layout = createVerticalTitleLayout(context);
    return [
        wrapSvgGroup(renderTitleText(context, layout.title), 'rotate(-90 120 360)'),
        renderArtistText(context, layout.artist)
    ].join('');
}

export function renderPosterStack(context) {
    const layout = createPosterStackTextLayout(context);
    return [renderArtistText(context, layout.artist), renderTitleText(context, layout.title)].join('');
}

function createSleeveTextLayout(context) {
    const artist = fitArtist(context, context.safeArea.width, { maxLines: 2, minFontSize: 10 });
    const title = fitTitle(context, context.safeArea.width, {
        maxLines: 3,
        lineHeight: 1.02,
        maxHeight: getSleeveTitleHeight(context, artist)
    });

    return {
        title: createTextPart(title, context.safeArea.x, context.safeArea.y + 30, 800),
        artist: createTextPart(artist, context.safeArea.x, getFirstBaselineByBlockBottom(artist, getSleeveArtistBottom(context)), 500, 0.84)
    };
}

function createCenteredTextLayout(context) {
    const title = fitTitle(context, 300, { maxLines: 3 });
    const artist = fitSingleArtist(context, 300, 18, 12);
    return createCenteredParts(title, artist, 300, 275 - title.height / 2, 28);
}

function createCircleLabelTextLayout(context) {
    const artist = fitArtist(context, 210, { maxLines: 2, maxFontSize: 16, minFontSize: 9, lineHeight: 1.05 });
    const title = fitTitle(context, 210, {
        maxLines: 3,
        minFontSize: 14,
        maxHeight: Math.max(36, 276 - 72 - 14 - artist.height)
    });

    return createCircleLabelParts(title, artist);
}

function createLargeTypeTextLayout(context) {
    const title = fitTitle(context, context.safeArea.width, { maxLines: 4, lineHeight: 0.96 });
    const artist = fitSingleArtist(context, context.safeArea.width, getArtistMaxSize(context), 12);
    return createSafeAreaParts(context, title, artist, 150, 24, { titleWeight: 950, artistWeight: 600, artistOpacity: 0.82 });
}

function createMagazineTextLayout(context) {
    const title = fitTitle(context, context.safeArea.width, { maxLines: 4, lineHeight: 0.94 });
    const artist = fitSingleArtist(context, context.safeArea.width, getArtistMaxSize(context), 12);
    return createSafeAreaParts(context, title, artist, 220, 22, { titleWeight: 950, artistWeight: 700, artistOpacity: 0.9 });
}

function createVerticalTitleLayout(context) {
    const artist = fitSingleArtist(context, 240, getArtistMaxSize(context), 12);

    return {
        title: createTextPart(fitTitle(context, 300, { maxLines: 2 }), 120, 360, 900),
        artist: createAnchoredPart(artist, context.safeArea.x + context.safeArea.width, context.safeArea.y + context.safeArea.height - 28, 600, 0.88, 'end')
    };
}

function createPosterStackTextLayout(context) {
    const title = fitTitle(context, context.safeArea.width, { maxLines: 4, lineHeight: 1 });
    const artist = fitSingleArtist(context, context.safeArea.width, getArtistMaxSize(context), 12);

    return {
        title: createTextPart(title, context.safeArea.x, 190, 950),
        artist: createTextPart(artist, context.safeArea.x, context.safeArea.y + 26, 600, 0.78)
    };
}

function createCenteredParts(title, artist, x, titleY, gap) {
    return {
        title: createAnchoredPart(title, x, titleY, 900),
        artist: createAnchoredPart(artist, x, titleY + title.height + gap, 600, 0.88)
    };
}

function createCircleLabelParts(title, artist) {
    const titleY = 300 - (title.height + 14 + artist.height) / 2 + title.fontSize;
    return createCenteredParts(title, artist, 300, titleY, 14);
}

function getSleeveArtistBottom(context) {
    return context.safeArea.y + context.safeArea.height - 22;
}

function getSleeveTitleHeight(context, artist) {
    return Math.max(40, getSleeveArtistBottom(context) - context.safeArea.y - 30 - artist.height - 18);
}
