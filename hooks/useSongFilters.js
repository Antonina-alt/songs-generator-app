'use client';

import { useCallback, useRef, useState } from 'react';
import { DEFAULT_LIKES, DEFAULT_REGION, DEFAULT_SEED } from '@/lib/songs/constants';

export function useSongFilters() {
    const [filters, setFilters] = useState(createInitialFilters);
    const galleryRef = useRef(null);

    const updateFilter = useCallback((name, value) => {
        setFilters((filters) => ({ ...filters, [name]: value }));

        galleryRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    return { filters, galleryRef, updateFilter };
}

function createInitialFilters() {
    return {
        region: DEFAULT_REGION,
        seed: DEFAULT_SEED,
        likes: DEFAULT_LIKES,
    };
}