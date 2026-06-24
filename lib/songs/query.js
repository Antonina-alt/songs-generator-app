import { isValidSeed64 } from '@/lib/randomGenerator';

export function createSongsQueryKey(view, params) {
    return ['songs', view, params];
}

export function isSongsQueryEnabled({ seed }) {
    return isValidSeed64(seed);
}
