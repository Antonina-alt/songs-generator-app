import { createColorScheme, createTextStyle } from '../colors';
import { fitSingleLineText, fitTextBlock } from '../text';
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

const RISKY_TITLE_LIMITS = {
    vertical_title: 16,
    circle_label: 18,
    floating_cards: 22,
    large_type: 24,
    diagonal_band: 28,
    centered: 30,
    magazine: 34
};

export function renderTypography(context) {
    const layoutId = getEffectiveLayoutId(context);
    const scheme = context.scheme ?? createColorScheme(context);
    const textStyle = createTextStyle({ ...context, scheme }, scheme.background);

    return getLayoutRenderer(layoutId)({
        ...context,
        scheme,
        textStyle,
        layout: { ...context.layout, id: layoutId }
    });
}

function getLayoutRenderer(layoutId) {
    return TYPOGRAPHY_RENDERERS[layoutId] ?? renderBottomLabel;
}

function getEffectiveLayoutId(context) {
    if (!isLayoutRisky(context)) return context.layout.id;
    return LAYOUT_FALLBACKS[context.layout.id] ?? 'bottom_label';
}

function isLayoutRisky({ layout, song }) {
    return song.title.length > (RISKY_TITLE_LIMITS[layout.id] ?? 40);
}

function renderBottomLabel(context) {
    return renderPanelLayout(context, createBottomLabelConfig(context));
}

function renderTopTitle(context) {
    return renderPanelLayout(context, createTopTitleConfig(context));
}

function renderDiagonalBand(context) {
    return renderPanelLayout(context, createDiagonalBandConfig(context));
}

function renderSplitPoster(context) {
    return renderPanelLayout(context, createSplitPosterConfig(context));
}

function renderFloatingCards(context) {
    return renderPanelLayout(context, createFloatingCardsConfig(context));
}

function renderRecordSleeve(context) {
    const layout = createSleeveTextLayout(context);
    return renderStackedText(context, layout);
}

function renderCentered(context) {
    const panelContext = createSurfaceTextContext(context, context.scheme.panel);
    const layout = createCenteredTextLayout(panelContext);
    return [`<circle cx="300" cy="300" r="178" fill="${panelContext.textStyle.panelFill}" opacity="0.72" />`, renderStackedText(panelContext, layout)].join('');
}

function renderCircleLabel(context) {
    const panelContext = createSurfaceTextContext(context, context.scheme.panel);
    const layout = createCircleLabelTextLayout(panelContext);
    return [`<circle cx="300" cy="300" r="138" fill="${panelContext.textStyle.panelFill}" stroke="${panelContext.textStyle.title}" stroke-width="3" opacity="0.82" />`, renderStackedText(panelContext, layout)].join('');
}

function renderLargeType(context) {
    return renderStackedText(context, createLargeTypeTextLayout(context));
}

function renderMagazine(context) {
    return [renderMagazineDecor(context), renderStackedText(context, createMagazineTextLayout(context))].join('');
}

function renderVerticalTitle(context) {
    const layout = createVerticalTitleLayout(context);
    return [wrapSvgGroup(renderTitleText(context, layout.title), 'rotate(-90 120 360)'), renderArtistText(context, layout.artist)].join('');
}

function renderPosterStack(context) {
    const layout = createPosterStackTextLayout(context);
    return [renderArtistText(context, layout.artist), renderTitleText(context, layout.title)].join('');
}

function renderPanelLayout(context, config) {
    const panelContext = createPanelContext(context, config);
    const layout = createPanelTextLayout(panelContext, config);
    const layers = [renderPanelBackground(panelContext, config, layout), renderTitleText(panelContext, layout.title), renderArtistText(panelContext, layout.artist)];
    return wrapPanelLayers(layers, config);
}

function createPanelContext(context, config) {
    return createSurfaceTextContext(context, getPanelFill(context, config));
}

function createSurfaceTextContext(context, surface) {
    return { ...context, textStyle: createTextStyle(context, surface) };
}

function createPanelTextLayout(context, config) {
    const artist = fitArtist(context, getInnerWidth(config.box), config.artistFit);
    const title = fitTitle(context, getInnerWidth(config.box), getPanelTitleFit(config, artist));
    return createPanelLayoutParts(config, title, artist);
}

function createPanelLayoutParts(config, titleBlock, artistBlock) {
    const titleTop = config.box.y + config.box.paddingTop;
    const title = createPanelTitlePart(config, titleBlock, titleTop);
    const artistTop = titleTop + title.block.height + config.box.gap;
    return { title, artist: createPanelArtistPart(config, title, artistBlock, artistTop) };
}

function createPanelTitlePart(config, block, top) {
    return {block, x: config.box.x + config.box.paddingX, y: getFirstBaselineByBlockTop(block, top), ...config.titleText};
}

function createPanelArtistPart(config, title, block, top) {
    return {block, x: title.x + (config.artistOffsetX ?? 0), y: getFirstBaselineByBlockTop(block, top), ...config.artistText};
}

function getFirstBaselineByBlockTop(block, top) {
    return top + block.fontSize;
}

function getPanelTitleFit(config, artist) {
    return { ...config.titleFit, maxHeight: config.titleFit.maxHeight?.(artist) };
}

function renderPanelBackground(context, config, layout) {
    if (config.background) return config.background(context, config, layout);
    return renderRoundedRect(config.box, getPanelFill(context, config), 0.72);
}

function wrapPanelLayers(layers, config) {
    const content = layers.filter(Boolean).join('');
    return config.wrap ? config.wrap(content) : content;
}

function renderStackedText(context, layout) {
    return [renderTitleText(context, layout.title), renderArtistText(context, layout.artist)].join('');
}

function renderTitleText(context, part) {
    return renderTextBlock(context, part, {weight: part.weight ?? 900, color: part.color ?? context.textStyle.title});
}

function renderArtistText(context, part) {
    return renderTextBlock(context, part, {weight: part.weight ?? 600, opacity: part.opacity ?? 0.88, color: part.color ?? context.textStyle.artist});
}

function renderTextBlock(context, part, defaults) {
    if (part.block.lines) return renderTextLines(createTextLinesProps(context, part, defaults));
    return renderSingleLineText(createSingleLineProps(context, part, defaults));
}

function createTextLinesProps(context, part, defaults) {
    return { ...createTextProps(context, part, defaults), lines: part.block.lines, lineHeight: part.block.lineHeight };
}

function createSingleLineProps(context, part, defaults) {
    return { ...createTextProps(context, part, defaults), text: part.block.text };
}

function createTextProps(context, part, defaults) {
    return { x: part.x, y: part.y, fontSize: part.block.fontSize, color: context.textStyle.title, letterSpacing: context.typography.letterSpacing, ...defaults, ...part.props };
}

function createBottomLabelConfig({ typography, layout }) {
    const box = { x: 46, y: 372, width: 508, height: 166, paddingX: 18, paddingTop: 24, paddingBottom: 20, gap: 14 };
    return createBoxConfig(box, { maxLines: layout.maxTitleLines, maxFontSize: Math.min(typography.titleSize, 48), minFontSize: 20 }, { maxLines: 2, maxFontSize: Math.min(typography.artistSize, 22), minFontSize: 11 }, { titleWeight: 800, artistWeight: 500 });
}

function createTopTitleConfig({ safeArea }) {
    const box = { x: safeArea.x, y: safeArea.y, width: safeArea.width, height: 158, paddingX: 22, paddingTop: 28, paddingBottom: 20, gap: 14 };
    return createBoxConfig(box, { maxLines: 2, minFontSize: 18 }, { maxLines: 2, minFontSize: 11 }, { titleWeight: 850, artistWeight: 600, panelOpacity: 0.68 });
}

function createDiagonalBandConfig({ typography, layout }) {
    const box = { x: 70, y: 286, width: 470, height: 156, paddingX: 0, paddingTop: 0, paddingBottom: 0, gap: 16 };
    return createBoxConfig(box, createDiagonalTitleFit(typography, layout), createDiagonalArtistFit(typography), createDiagonalRenderOptions());
}

function createSplitPosterConfig({ safeArea }) {
    const box = { x: 330, y: safeArea.y, width: 220, height: safeArea.height, paddingX: 20, paddingTop: 72, paddingBottom: 46, gap: 18 };
    return createBoxConfig(box, { maxLines: 4, minFontSize: 16 }, { maxLines: 3, maxFontSize: 18, minFontSize: 10 }, { titleWeight: 900, artistWeight: 600, background: renderSplitPosterPanel });
}

function createFloatingCardsConfig() {
    const box = { x: 116, y: 176, width: 368, height: 250, paddingX: 28, paddingTop: 46, paddingBottom: 32, gap: 16 };
    return createBoxConfig(box, { maxLines: 3, minFontSize: 16, lineHeight: 1.02 }, { maxLines: 2, minFontSize: 10 }, { titleWeight: 900, artistWeight: 600, background: renderFloatingCardsPanel });
}

function createBoxConfig(box, titleFit, artistFit, options = {}) {
    return { box, titleFit: normalizeTitleFit(box, titleFit), artistFit, ...createTextOptions(options), background: options.background ?? createPanelBackground(options.panelOpacity), panelFill: options.panelFill, wrap: options.wrap, artistOffsetX: options.artistOffsetX };
}

function createTextOptions({ titleWeight, artistWeight, artistOpacity = 0.88 }) {
    return { titleText: { weight: titleWeight }, artistText: { weight: artistWeight, opacity: artistOpacity } };
}

function normalizeTitleFit(box, fit) {
    return { lineHeight: 1.04, maxHeight: (artist) => getTitleMaxHeight(box, artist), ...fit };
}

function createPanelBackground(opacity = 0.72) {
    return (context, config) => renderRoundedRect(config.box, getPanelFill(context, config), opacity);
}

function getPanelFill(context, config = {}) {
    return config.panelFill?.(context) ?? context.scheme.panel;
}

function createDiagonalTitleFit(typography, layout) {
    return { maxLines: Math.min(layout.maxTitleLines, 2), maxFontSize: Math.min(typography.titleSize, 42), minFontSize: 18, maxHeight: (artist) => Math.max(44, 156 - 16 - artist.height) };
}

function createDiagonalArtistFit(typography) {
    return { maxLines: 2, maxFontSize: Math.min(typography.artistSize, 20), minFontSize: 10 };
}

function createDiagonalRenderOptions() {
    return { titleWeight: 900, artistWeight: 600, background: renderDiagonalBandPanel, panelFill: (context) => context.scheme.mainDark, wrap: (content) => wrapSvgGroup(content, 'rotate(-11 300 300)'), artistOffsetX: 2 };
}

function createSleeveTextLayout(context) {
    const artist = fitArtist(context, context.safeArea.width, { maxLines: 2, minFontSize: 10 });
    const title = fitSleeveTitle(context, artist);
    return createSleeveParts(context, title, artist);
}

function fitSleeveTitle(context, artist) {
    return fitTitle(context, context.safeArea.width, { maxLines: 3, lineHeight: 1.02, maxHeight: getSleeveTitleHeight(context, artist) });
}

function createSleeveParts(context, title, artist) {
    return { title: createTextPart(title, context.safeArea.x, context.safeArea.y + 30, 800), artist: createTextPart(artist, context.safeArea.x, getFirstBaselineByBlockBottom(artist, getSleeveArtistBottom(context)), 500, 0.84) };
}

function createCenteredTextLayout(context) {
    const title = fitTitle(context, 300, { maxLines: 3 });
    const artist = fitSingleArtist(context, 300, 18, 12);
    return createCenteredParts(title, artist, 300, 275 - title.height / 2, 28);
}

function createCircleLabelTextLayout(context) {
    const artist = fitArtist(context, 210, { maxLines: 2, maxFontSize: 16, minFontSize: 9, lineHeight: 1.05 });
    const title = fitTitle(context, 210, { maxLines: 3, minFontSize: 14, maxHeight: Math.max(36, 276 - 72 - 14 - artist.height) });
    return createCircleLabelParts(title, artist);
}

function createLargeTypeTextLayout(context) {
    const title = fitTitle(context, context.safeArea.width, { maxLines: 4, lineHeight: 0.96 });
    const artist = fitSingleArtist(context, context.safeArea.width, getArtistMaxSize(context), 12);
    return createLargeTypeParts(context, title, artist);
}

function createMagazineTextLayout(context) {
    const title = fitTitle(context, context.safeArea.width, { maxLines: 4, lineHeight: 0.94 });
    const artist = fitSingleArtist(context, context.safeArea.width, getArtistMaxSize(context), 12);
    return createSafeAreaParts(context, title, artist, 220, 22, { titleWeight: 950, artistWeight: 700, artistOpacity: 0.9 });
}

function createVerticalTitleLayout(context) {
    return { title: createVerticalTitlePart(context), artist: createVerticalArtistPart(context) };
}

function createPosterStackTextLayout(context) {
    const title = fitTitle(context, context.safeArea.width, { maxLines: 4, lineHeight: 1 });
    const artist = fitSingleArtist(context, context.safeArea.width, getArtistMaxSize(context), 12);
    return createPosterStackParts(context, title, artist);
}

function createCenteredParts(title, artist, x, titleY, gap) {
    return { title: createAnchoredPart(title, x, titleY, 900), artist: createAnchoredPart(artist, x, titleY + title.height + gap, 600, 0.88) };
}

function createCircleLabelParts(title, artist) {
    const titleY = 300 - (title.height + 14 + artist.height) / 2 + title.fontSize;
    return createCenteredParts(title, artist, 300, titleY, 14);
}

function createLargeTypeParts(context, title, artist) {
    return createSafeAreaParts(context, title, artist, 150, 24, { titleWeight: 950, artistWeight: 600, artistOpacity: 0.82 });
}

function createSafeAreaParts(context, title, artist, titleY, gap, options) {
    const artistY = Math.min(titleY + title.height + gap, context.safeArea.y + context.safeArea.height - 24);
    return { title: createTextPart(title, context.safeArea.x, titleY, options.titleWeight, options.titleOpacity ?? 0.94), artist: createTextPart(artist, context.safeArea.x, artistY, options.artistWeight, options.artistOpacity) };
}

function createVerticalTitlePart(context) {
    return createTextPart(fitTitle(context, 300, { maxLines: 2 }), 120, 360, 900);
}

function createVerticalArtistPart(context) {
    const artist = fitSingleArtist(context, 240, getArtistMaxSize(context), 12);
    return createAnchoredPart(artist, context.safeArea.x + context.safeArea.width, context.safeArea.y + context.safeArea.height - 28, 600, 0.88, 'end');
}

function createPosterStackParts(context, title, artist) {
    return { title: createTextPart(title, context.safeArea.x, 190, 950), artist: createTextPart(artist, context.safeArea.x, context.safeArea.y + 26, 600, 0.78) };
}

function createTextPart(block, x, y, weight, opacity) {
    return { block, x, y, weight, opacity };
}

function createAnchoredPart(block, x, y, weight, opacity, anchor = 'middle') {
    return { ...createTextPart(block, x, y, weight, opacity), props: { anchor } };
}

function fitTitle(context, width, options = {}) {
    return fitTextBlock(createTitleFitParams(context, width, options));
}

function createTitleFitParams(context, width, options) {
    return { text: context.song.title, width, maxLines: getTitleLines(context, options), maxFontSize: options.maxFontSize ?? getTitleMaxSize(context), minFontSize: options.minFontSize ?? getTitleMinSize(context), letterSpacing: context.typography.letterSpacing, lineHeight: options.lineHeight ?? 1.04, maxHeight: options.maxHeight };
}

function fitArtist(context, width, options = {}) {
    return fitTextBlock(createArtistFitParams(context, width, options));
}

function createArtistFitParams(context, width, options) {
    return { text: context.song.artist, width, maxLines: options.maxLines ?? 2, maxFontSize: options.maxFontSize ?? getArtistMaxSize(context), minFontSize: options.minFontSize ?? 11, letterSpacing: context.typography.letterSpacing, lineHeight: options.lineHeight ?? 1.08 };
}

function fitSingleArtist(context, width, maxFontSize, minFontSize) {
    return fitSingleLineText({ text: context.song.artist, width, maxFontSize, minFontSize, letterSpacing: context.typography.letterSpacing });
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

function getArtistMaxSize(context) {
    return Math.min(context.typography.artistSize, 22);
}

function getInnerWidth(box) {
    return box.width - box.paddingX * 2;
}

function getTitleMaxHeight(box, artist) {
    return Math.max(36, box.height - box.paddingTop - box.paddingBottom - box.gap - artist.height);
}

function getSleeveArtistBottom(context) {
    return context.safeArea.y + context.safeArea.height - 22;
}

function getSleeveTitleHeight(context, artist) {
    return Math.max(40, getSleeveArtistBottom(context) - context.safeArea.y - 30 - artist.height - 18);
}

function getFirstBaselineByBlockBottom(block, bottomY) {
    return bottomY - block.height + block.fontSize;
}

function renderRoundedRect(box, color, opacity) {
    return `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="24" fill="${color}" opacity="${opacity}" />`;
}

function renderSplitPosterPanel(context, config) {
    return `<rect x="${config.box.x}" y="0" width="${600 - config.box.x}" height="600" fill="${getPanelFill(context, config)}" opacity="0.8" />`;
}

function renderFloatingCardsPanel(context, config) {
    return [renderFloatingCardShadow(context), renderFloatingCardAccent(context), renderRoundedRect(config.box, getPanelFill(context, config), 0.82)].join('');
}

function renderFloatingCardShadow(context) {
    return `<rect x="80" y="112" width="390" height="250" rx="28" fill="${context.scheme.panel}" opacity="0.62" transform="rotate(-7 300 255)" />`;
}

function renderFloatingCardAccent(context) {
    return `<rect x="126" y="220" width="390" height="210" rx="24" fill="${context.scheme.mainSoft}" opacity="0.66" transform="rotate(8 320 320)" />`;
}

function renderDiagonalBandPanel(context, config, layout) {
    const height = Math.max(140, layout.title.block.height + layout.artist.block.height + config.box.gap + 64);
    return `<rect x="-60" y="240" width="720" height="${height}" fill="${getPanelFill(context, config)}" opacity="0.9" />`;
}

function renderMagazineDecor({ safeArea, palette }) {
    return [`<rect x="${safeArea.x}" y="60" width="180" height="24" fill="${palette.accent}" opacity="0.85" />`, `<rect x="${safeArea.x}" y="96" width="104" height="10" fill="${palette.text}" opacity="0.56" />`].join('');
}

function wrapSvgGroup(content, transform) {
    return [`<g transform="${transform}">`, content, '</g>'].join('');
}
