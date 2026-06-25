import {
    createSurfaceTextContext,
    fitArtist,
    fitTitle,
    renderArtistText,
    renderRoundedRect,
    renderTitleText,
    wrapSvgGroup
} from './shared';

export function renderBottomLabel(context) {
    return renderPanelLayout(context, createBottomLabelConfig(context));
}

export function renderTopTitle(context) {
    return renderPanelLayout(context, createTopTitleConfig(context));
}

export function renderDiagonalBand(context) {
    return renderPanelLayout(context, createDiagonalBandConfig(context));
}

export function renderSplitPoster(context) {
    return renderPanelLayout(context, createSplitPosterConfig(context));
}

export function renderFloatingCards(context) {
    return renderPanelLayout(context, createFloatingCardsConfig());
}

function renderPanelLayout(context, config) {
    const panelContext = createSurfaceTextContext(context, getPanelFill(context, config));
    const layout = createPanelTextLayout(panelContext, config);
    const layers = [
        renderPanelBackground(panelContext, config, layout),
        renderTitleText(panelContext, layout.title),
        renderArtistText(panelContext, layout.artist)
    ];

    return wrapPanelLayers(layers, config);
}

function createPanelTextLayout(context, config) {
    const innerWidth = config.box.width - config.box.paddingX * 2;
    const artist = fitArtist(context, innerWidth, config.artistFit);
    const title = fitTitle(context, innerWidth, {
        ...config.titleFit,
        maxHeight: config.titleFit.maxHeight?.(artist)
    });

    return createPanelLayoutParts(config, title, artist);
}

function createPanelLayoutParts(config, titleBlock, artistBlock) {
    const titleTop = config.box.y + config.box.paddingTop;
    const title = createPanelTitlePart(config, titleBlock, titleTop);
    const artistTop = titleTop + title.block.height + config.box.gap;

    return { title, artist: createPanelArtistPart(config, title, artistBlock, artistTop) };
}

function createPanelTitlePart(config, block, top) {
    return {
        block,
        x: config.box.x + config.box.paddingX,
        y: top + block.fontSize,
        ...config.titleText
    };
}

function createPanelArtistPart(config, title, block, top) {
    return {
        block,
        x: title.x + (config.artistOffsetX ?? 0),
        y: top + block.fontSize,
        ...config.artistText
    };
}

function createBottomLabelConfig({ typography, layout }) {
    const box = { x: 46, y: 372, width: 508, height: 166, paddingX: 18, paddingTop: 24, paddingBottom: 20, gap: 14 };

    return createBoxConfig(
        box,
        { maxLines: layout.maxTitleLines, maxFontSize: Math.min(typography.titleSize, 48), minFontSize: 20 },
        { maxLines: 2, maxFontSize: Math.min(typography.artistSize, 22), minFontSize: 11 },
        { titleWeight: 800, artistWeight: 500 }
    );
}

function createTopTitleConfig({ safeArea }) {
    const box = { x: safeArea.x, y: safeArea.y, width: safeArea.width, height: 158, paddingX: 22, paddingTop: 28, paddingBottom: 20, gap: 14 };

    return createBoxConfig(
        box,
        { maxLines: 2, minFontSize: 18 },
        { maxLines: 2, minFontSize: 11 },
        { titleWeight: 850, artistWeight: 600, panelOpacity: 0.68 }
    );
}

function createDiagonalBandConfig({ typography, layout }) {
    const box = { x: 70, y: 286, width: 470, height: 156, paddingX: 0, paddingTop: 0, paddingBottom: 0, gap: 16 };

    return createBoxConfig(
        box,
        {
            maxLines: Math.min(layout.maxTitleLines, 2),
            maxFontSize: Math.min(typography.titleSize, 42),
            minFontSize: 18,
            maxHeight: (artist) => Math.max(44, 156 - 16 - artist.height)
        },
        { maxLines: 2, maxFontSize: Math.min(typography.artistSize, 20), minFontSize: 10 },
        {
            titleWeight: 900,
            artistWeight: 600,
            background: renderDiagonalBandPanel,
            panelFill: (context) => context.scheme.mainDark,
            wrap: (content) => wrapSvgGroup(content, 'rotate(-11 300 300)'),
            artistOffsetX: 2
        }
    );
}

function createSplitPosterConfig({ safeArea }) {
    const box = { x: 330, y: safeArea.y, width: 220, height: safeArea.height, paddingX: 20, paddingTop: 72, paddingBottom: 46, gap: 18 };

    return createBoxConfig(
        box,
        { maxLines: 4, minFontSize: 16 },
        { maxLines: 3, maxFontSize: 18, minFontSize: 10 },
        { titleWeight: 900, artistWeight: 600, background: renderSplitPosterPanel }
    );
}

function createFloatingCardsConfig() {
    const box = { x: 116, y: 176, width: 368, height: 250, paddingX: 28, paddingTop: 46, paddingBottom: 32, gap: 16 };

    return createBoxConfig(
        box,
        { maxLines: 3, minFontSize: 16, lineHeight: 1.02 },
        { maxLines: 2, minFontSize: 10 },
        { titleWeight: 900, artistWeight: 600, background: renderFloatingCardsPanel }
    );
}

function createBoxConfig(box, titleFit, artistFit, options = {}) {
    return {
        box,
        titleFit: { lineHeight: 1.04, maxHeight: (artist) => getTitleMaxHeight(box, artist), ...titleFit },
        artistFit,
        titleText: { weight: options.titleWeight },
        artistText: { weight: options.artistWeight, opacity: options.artistOpacity ?? 0.88 },
        background: options.background ?? createPanelBackground(options.panelOpacity),
        panelFill: options.panelFill,
        wrap: options.wrap,
        artistOffsetX: options.artistOffsetX
    };
}

function getTitleMaxHeight(box, artist) {
    return Math.max(36, box.height - box.paddingTop - box.paddingBottom - box.gap - artist.height);
}

function renderPanelBackground(context, config, layout) {
    return config.background(context, config, layout);
}

function createPanelBackground(opacity = 0.72) {
    return (context, config) => renderRoundedRect(config.box, getPanelFill(context, config), opacity);
}

function getPanelFill(context, config = {}) {
    return config.panelFill?.(context) ?? context.scheme.panel;
}

function wrapPanelLayers(layers, config) {
    const content = layers.filter(Boolean).join('');
    return config.wrap ? config.wrap(content) : content;
}

function renderSplitPosterPanel(context, config) {
    return `<rect x="${config.box.x}" y="0" width="${600 - config.box.x}" height="600" fill="${getPanelFill(context, config)}" opacity="0.8" />`;
}

function renderFloatingCardsPanel(context, config) {
    return [
        `<rect x="80" y="112" width="390" height="250" rx="28" fill="${context.scheme.panel}" opacity="0.62" transform="rotate(-7 300 255)" />`,
        `<rect x="126" y="220" width="390" height="210" rx="24" fill="${context.scheme.mainSoft}" opacity="0.66" transform="rotate(8 320 320)" />`,
        renderRoundedRect(config.box, getPanelFill(context, config), 0.82)
    ].join('');
}

function renderDiagonalBandPanel(context, config, layout) {
    const height = Math.max(140, layout.title.block.height + layout.artist.block.height + config.box.gap + 64);
    return `<rect x="-60" y="240" width="720" height="${height}" fill="${getPanelFill(context, config)}" opacity="0.9" />`;
}
