import { SONGS_PAGE_SIZE } from './constants';

export function createSongsQueryParams({ region, seed, likes, page }) {
    return new URLSearchParams({
        region,
        seed,
        likes: String(likes),
        page: String(page),
        pageSize: String(SONGS_PAGE_SIZE)
    });
}

export async function fetchSongs(params) {
    const queryParams = createSongsQueryParams(params);
    const response = await fetch(`/api/songs?${queryParams}`);
    return parseSongsResponse(response);
}

async function parseSongsResponse(response) {
    if (!response.ok) {
        throw new Error('songs.loadFailed');
    }
    return response.json();
}
