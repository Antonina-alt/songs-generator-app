import fs from 'fs';
import path from 'path';
import localeManifest from '@/data/locales/manifest.json';

const localeCache = new Map();

export function loadLocaleData(region) {
    const safeRegion = getSafeRegion(region);
    return getCachedLocaleData(safeRegion);
}

function getCachedLocaleData(region) {
    if (!localeCache.has(region)) localeCache.set(region, readLocaleData(region));
    return localeCache.get(region);
}

function readLocaleData(region) {
    return JSON.parse(fs.readFileSync(createLocalePath(region), 'utf-8'));
}

function getSafeRegion(region) {
    if (localeManifest.regions.includes(region)) return region;
    return localeManifest.defaultRegion;
}

function createLocalePath(region) {
    return path.join(process.cwd(), 'data', 'locales', region, 'music.json');
}
