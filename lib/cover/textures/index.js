import { randomInt } from '@/lib/randomGenerator';

const TEXTURE_RENDERERS = {
    grain: renderGrain,
    halftone: renderHalftone,
    noise_dots: renderNoiseDots,
    scanlines: renderScanlines,
    paper_fibers: renderPaperFibers,
    soft_grid: renderSoftGrid,
    light_leaks: renderLightLeaks,
    fold_marks: renderFoldMarks
};

export function renderTexture(context) {
    const renderer = TEXTURE_RENDERERS[context.texture.id] ?? renderGrain;
    return renderer(context);
}

function renderGrain({ width, height, palette, texture, random }) {
    const count = randomIntFromRange(texture.densityRange, random);
    const opacity = randomRange(texture.opacityRange, random);

    return Array.from({ length: count }, () =>
        `<circle cx="${randomInt(0, width, random)}" cy="${randomInt(0, height, random)}" r="${1 + random() * 1.8}" fill="${palette.text}" opacity="${opacity}" />`
    ).join('');
}

function renderHalftone({ width, height, palette, texture, random }) {
    const gap = randomInt(18, 34, random);
    const opacity = randomRange(texture.opacityRange, random);
    const dots = [];

    for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
            const radius = 1 + random() * 5;
            dots.push(`<circle cx="${x}" cy="${y}" r="${radius.toFixed(1)}" fill="${palette.text}" opacity="${opacity}" />`);
        }
    }

    return dots.join('');
}

function renderNoiseDots({ width, height, palette, texture, random }) {
    const count = randomIntFromRange(texture.densityRange, random);
    const opacity = randomRange(texture.opacityRange, random);

    return Array.from({ length: count }, () =>
        `<rect x="${randomInt(0, width, random)}" y="${randomInt(0, height, random)}" width="1" height="1" fill="${palette.text}" opacity="${opacity}" />`
    ).join('');
}

function renderScanlines({ width, height, palette, texture, random }) {
    const gap = randomIntFromRange(texture.gapRange, random);
    const opacity = randomRange(texture.opacityRange, random);
    const lines = [];

    for (let y = 0; y < height; y += gap) {
        lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${palette.text}" stroke-width="1" opacity="${opacity}" />`);
    }

    return lines.join('');
}

function renderPaperFibers({ width, height, palette, texture, random }) {
    const count = randomIntFromRange(texture.densityRange, random);
    const opacity = randomRange(texture.opacityRange, random);

    return Array.from({ length: count }, () => {
        const x = randomInt(0, width, random);
        const y = randomInt(0, height, random);
        const length = randomInt(10, 42, random);

        return `<line x1="${x}" y1="${y}" x2="${x + length}" y2="${y + randomInt(-5, 5, random)}" stroke="${palette.text}" stroke-width="1" opacity="${opacity}" />`;
    }).join('');
}

function renderSoftGrid({ width, height, palette, texture, random }) {
    const gap = randomIntFromRange(texture.gapRange, random);
    const opacity = randomRange(texture.opacityRange, random);
    const lines = [];

    for (let x = 0; x <= width; x += gap) {
        lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${palette.text}" opacity="${opacity}" />`);
    }

    for (let y = 0; y <= height; y += gap) {
        lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${palette.text}" opacity="${opacity}" />`);
    }

    return lines.join('');
}

function renderLightLeaks({ width, height, palette, texture, random }) {
    const count = randomIntFromRange(texture.densityRange, random);
    const opacity = randomRange(texture.opacityRange, random);

    return Array.from({ length: count }, () =>
        `<circle cx="${randomInt(-40, width + 40, random)}" cy="${randomInt(-40, height + 40, random)}" r="${randomInt(80, 220, random)}" fill="${palette.accent}" opacity="${opacity}" />`
    ).join('');
}

function renderFoldMarks({ width, height, palette, texture, random }) {
    const count = randomIntFromRange(texture.densityRange, random);
    const opacity = randomRange(texture.opacityRange, random);

    return Array.from({ length: count }, () => {
        const x = randomInt(70, width - 70, random);
        return `<line x1="${x}" y1="40" x2="${x + randomInt(-20, 20, random)}" y2="${height - 40}" stroke="${palette.text}" stroke-width="1" opacity="${opacity}" />`;
    }).join('');
}

function randomRange(range, random, fallback = [0, 1]) {
    const [min, max] = Array.isArray(range) ? range : fallback;

    return min + (max - min) * random();
}

function randomIntFromRange(range, random, fallback = [1, 1]) {
    const [min, max] = Array.isArray(range) ? range : fallback;

    return randomInt(min, max, random);
}