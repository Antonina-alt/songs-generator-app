import coverPresets from '@/data/covers/presets.json';
import { randomInt } from '@/lib/randomGenerator';
import { pickRandomValue, pickWeighted, randomFromRange, randomIntFromRange } from './random';

export function generateCoverMeta(random) {
    const motif = pickWeighted(coverPresets.motifs, random);
    const layout = pickCompatibleLayout(motif, random);

    return {
        canvas: coverPresets.canvas,
        palette: pickWeighted(coverPresets.palettes, random),
        background: pickWeighted(coverPresets.backgrounds, random),
        motif,
        layout,
        texture: pickWeighted(coverPresets.textures, random),
        frame: pickWeighted(coverPresets.frames, random),
        typography: createTypographyMeta(random),
        effect: pickWeighted(coverPresets.effects, random),
        shapeSet: pickWeighted(coverPresets.shapeSets, random),
        rough: createRoughMeta(random),
        motifSettings: coverPresets.motifSettings[motif.id],
        variant: randomInt(1, 6, random)
    };
}

function pickCompatibleLayout(motif, random) {
    const compatibleLayouts = coverPresets.layouts.filter((layout) =>
        motif.compatibleLayouts.includes(layout.id)
    );

    return pickWeighted(compatibleLayouts, random);
}

function createTypographyMeta(random) {
    const typography = pickWeighted(coverPresets.typography, random);

    return {
        ...typography,
        titleSize: randomIntFromRange(typography.titleScaleRange, random),
        artistSize: randomIntFromRange(typography.artistScaleRange, random),
        letterSpacing: randomFromRange(typography.letterSpacingRange, random)
    };
}

function createRoughMeta(random) {
    const options = coverPresets.roughOptions;

    return {
        fillStyle: pickRandomValue(options.fillStyles, random),
        roughness: randomFromRange(options.roughnessRange, random),
        bowing: randomFromRange(options.bowingRange, random),
        hachureGap: randomFromRange(options.hachureGapRange, random),
        strokeWidth: randomIntFromRange(options.strokeWidthRange, random)
    };
}