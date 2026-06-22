'use client';

import { useEffect } from 'react';

export function useInfiniteScroll({ loaderRef, canLoad, onLoad }) {
    useEffect(() => {
        const node = loaderRef.current;
        if (!node) return;
        return observeLoader(node, canLoad, onLoad);
    }, [loaderRef, canLoad, onLoad]);
}

function observeLoader(node, canLoad, onLoad) {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && canLoad) onLoad();
    });
    observer.observe(node);
    return () => observer.disconnect();
}
