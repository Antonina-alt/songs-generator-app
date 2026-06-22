import { pickValue } from './text';

export function generateReview(localeData, random) {
    const { reviews } = localeData;
    return [reviews.openings, reviews.middles, reviews.endings]
        .map((parts) => pickValue(parts, random))
        .join(' ')
        .trim();
}
