'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchSongs } from '@/lib/songs/api';
import { isValidSeed64 } from '@/lib/randomGenerator';

export function useInfiniteSongsQuery(params) {
    const isSeedValid = isValidSeed64(params.seed);
    return useInfiniteQuery({
        queryKey: ['songs', 'gallery', params],
        queryFn: ({ pageParam }) => fetchSongs({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.page + 1,
        initialPageParam: 1,
        enabled: isSeedValid
    });
}
