import { createColorScheme } from '../colors';
import { renderGenericMotif } from './generic';
import { renderCassette, renderCompactDisc, renderTapeReel, renderVinyl } from './musicObjects';
import { renderCitySkyline, renderMountains, renderStarsOrbits } from './scenes';
import { renderDrumCircles, renderEqualizer, renderWaveform } from './visualizers';

const MOTIF_RENDERERS = {
    vinyl: renderVinyl,
    cassette: renderCassette,
    compact_disc: renderCompactDisc,
    equalizer: renderEqualizer,
    waveform: renderWaveform,
    city_skyline: renderCitySkyline,
    mountains: renderMountains,
    stars_orbits: renderStarsOrbits,
    drum_circles: renderDrumCircles,
    tape_reel: renderTapeReel
};

export function renderMotif(context) {
    const scheme = context.scheme ?? createColorScheme(context);
    const renderer = MOTIF_RENDERERS[context.motif.id] ?? renderGenericMotif;

    return renderer({ ...context, scheme, palette: createMotifPalette(scheme) });
}

function createMotifPalette(scheme) {
    return {
        background: scheme.background,
        primary: scheme.main,
        secondary: scheme.support,
        accent: scheme.highlight,
        muted: scheme.quiet,
        text: scheme.text
    };
}
