'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchSongs } from '@/lib/songs/api';
import { createSongsQueryKey, isSongsQueryEnabled } from '@/lib/songs/query';

export function useInfiniteSongsQuery(params) {
    return useInfiniteQuery(createInfiniteSongsQueryOptions(params));
}

function createInfiniteSongsQueryOptions(params) {
    return {
        queryKey: createSongsQueryKey('gallery', params),
        queryFn: ({ pageParam }) => fetchSongs({ ...params, page: pageParam }),
        getNextPageParam: getNextPageParam,
        initialPageParam: 1,
        enabled: isSongsQueryEnabled(params)
    };
}

function getNextPageParam(lastPage) {
    return lastPage.page + 1;
}
