export function createSongPreviewId(song) {
    return createScopedSongKey(song);
}

export function createSongQueryKey(scope, params) {
    return [scope, params.region, params.seed, params.likes].join(':');
}

export function createPagedSongQueryKey(scope, params) {
    return [createSongQueryKey(scope, params), params.page].join(':');
}

function createScopedSongKey({ region, seed, page, index }) {
    return [region, seed, page, index].join(':');
}
