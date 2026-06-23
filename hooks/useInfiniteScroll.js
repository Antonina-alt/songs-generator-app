'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export function useInfiniteScroll({ canLoad, onLoad }) {
    const { ref, inView } = useInView({ rootMargin: '200px' });
    useEffect(() => loadWhenVisible(inView, canLoad, onLoad), [inView, canLoad, onLoad]);
    return ref;
}

function loadWhenVisible(inView, canLoad, onLoad) {
    if (inView && canLoad) onLoad();
}
