import { isValidSeed64 } from '@/lib/seed';

export function createSongsQueryKey(view, params) {
    return ['songs', view, params];
}

export function isSongsQueryEnabled({ seed }) {
    return isValidSeed64(seed);
}
