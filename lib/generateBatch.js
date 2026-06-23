import { generateSong } from './generateSong';

export function generateBatch(params) {
    return createPageIndexes(params).map((index) => generateSong({ ...params, index }));
}

function createPageIndexes(params) {
    const { size, startIndex } = createPageBounds(params);
    return Array.from({ length: size }, (_, offset) => startIndex + offset);
}

function createPageBounds({ page, pageSize }) {
    const size = Number(pageSize);
    return { size, startIndex: (Number(page) - 1) * size + 1 };
}
