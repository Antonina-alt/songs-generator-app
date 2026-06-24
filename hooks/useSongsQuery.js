'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchSongs } from '@/lib/songs/api';
import { createSongsQueryKey, isSongsQueryEnabled } from '@/lib/songs/query';

export function useSongsQuery(params) {
    return useQuery(createSongsQueryOptions(params));
}

function createSongsQueryOptions(params) {
    return {
        queryKey: createSongsQueryKey('table', params),
        queryFn: () => fetchSongs(params),
        placeholderData: keepPreviousData,
        enabled: isSongsQueryEnabled(params)
    };
}

