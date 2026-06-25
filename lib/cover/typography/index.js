import { createColorScheme, createTextStyle } from '../colors';
import {
    renderBottomLabel,
    renderDiagonalBand,
    renderFloatingCards,
    renderSplitPoster,
    renderTopTitle
} from './panelLayouts';
import {
    renderCentered,
    renderCircleLabel,
    renderLargeType,
    renderMagazine,
    renderPosterStack,
    renderRecordSleeve,
    renderVerticalTitle
} from './stackedLayouts';

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

    return getLayoutRenderer(layoutId)({
        ...context,
        scheme,
        textStyle: createTextStyle({ ...context, scheme }, scheme.background),
        layout: { ...context.layout, id: layoutId }
    });
}

function getLayoutRenderer(layoutId) {
    return TYPOGRAPHY_RENDERERS[layoutId] ?? renderBottomLabel;
}

function getEffectiveLayoutId({ layout, song }) {
    const limit = RISKY_TITLE_LIMITS[layout.id] ?? 40;
    return song.title.length > limit ? LAYOUT_FALLBACKS[layout.id] ?? 'bottom_label' : layout.id;
}
