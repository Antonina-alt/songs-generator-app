'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSongs } from '@/lib/songs/api';

export function useSongsQuery(params) {
    return useQuery({
        queryKey: ['songs', 'table', params],
        queryFn: () => fetchSongs(params),
        keepPreviousData: true
    });
}
