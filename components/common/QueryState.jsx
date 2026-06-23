'use client';

import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

export function QueryState({ query, errorMessage, children }) {
    if (query.isLoading) return <LoadingState />;
    if (query.isError) return <ErrorState message={errorMessage} />;
    return children;
}
