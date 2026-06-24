import coverPresets from '@/data/covers/presets.json';
import { randomInt } from '@/lib/randomGenerator';
import { pickWeighted, randomFromRange, randomIntFromRange } from './random';

export function generateCoverMeta(random) {
    const motif = pickWeighted(coverPresets.motifs, random);
    const layout = pickCompatibleLayout(motif, random);
    return createCoverMetaResponse({ motif, layout, random });
}

function createCoverMetaResponse({ motif, layout, random }) {
    return { ...createPresetMeta(random), motif, layout, typography: createTypographyMeta(random), motifSettings: coverPresets.motifSettings[motif.id], variant: randomInt(1, 6, random) };
}

function createPresetMeta(random) {
    return {
        canvas: coverPresets.canvas,
        palette: pickWeighted(coverPresets.palettes, random),
        background: pickWeighted(coverPresets.backgrounds, random),
        texture: pickWeighted(coverPresets.textures, random),
        frame: pickWeighted(coverPresets.frames, random)
    };
}

function pickCompatibleLayout(motif, random) {
    const compatibleLayouts = coverPresets.layouts.filter((layout) => motif.compatibleLayouts.includes(layout.id));
    return pickWeighted(compatibleLayouts, random);
}

function createTypographyMeta(random) {
    const typography = pickWeighted(coverPresets.typography, random);
    return createTypographyResponse(typography, random);
}

function createTypographyResponse(typography, random) {
    return {
        ...typography,
        titleSize: randomIntFromRange(typography.titleScaleRange, random),
        artistSize: randomIntFromRange(typography.artistScaleRange, random),
        letterSpacing: randomFromRange(typography.letterSpacingRange, random)
    };
}
