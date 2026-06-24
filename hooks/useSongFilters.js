'use client';

import { useCallback, useState } from 'react';
import { DEFAULT_LIKES, DEFAULT_REGION, DEFAULT_SEED } from '@/lib/songs/constants';

export function useSongFilters() {
    const [filters, setFilters] = useState(createInitialFilters);
    const updateFilter = useCallback((name, value) => updateFilterState(setFilters, name, value), []);

    return { filters, updateFilter };
}

function updateFilterState(setFilters, name, value) {
    setFilters((filters) => ({ ...filters, [name]: value }));
}

function createInitialFilters() {
    return { region: DEFAULT_REGION, seed: DEFAULT_SEED, likes: DEFAULT_LIKES };
}
