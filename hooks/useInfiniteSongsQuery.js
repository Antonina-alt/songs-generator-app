'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchSongs } from '@/lib/songs/api';

export function useInfiniteSongsQuery(params) {
    return useInfiniteQuery({
        queryKey: ['songs', 'gallery', params],
        queryFn: ({ pageParam }) => fetchSongs({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.page + 1,
        initialPageParam: 1
    });
}
