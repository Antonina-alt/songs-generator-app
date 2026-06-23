'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSongs } from '@/lib/songs/api';
import { isValidSeed64 } from '@/lib/randomGenerator';

export function useSongsQuery(params) {
    const isSeedValid = isValidSeed64(params.seed);
    return useQuery({
        queryKey: ['songs', 'table', params],
        queryFn: () => fetchSongs(params),
        keepPreviousData: true,
        enabled: isSeedValid
    });
}
