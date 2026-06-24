import fs from 'fs';
import path from 'path';
import localeManifest from '@/data/locales/manifest.json';

export function loadLocaleData(region) {
    return JSON.parse(fs.readFileSync(createLocalePath(getSafeRegion(region)), 'utf-8'));
}

function getSafeRegion(region) {
    return getSupportedRegions().includes(region) ? region : getDefaultRegion();
}

function getSupportedRegions() {
    return localeManifest.regions;
}

function getDefaultRegion() {
    return localeManifest.defaultRegion;
}

function createLocalePath(region) {
    return path.join(process.cwd(), 'data', 'locales', region, 'music.json');
}
