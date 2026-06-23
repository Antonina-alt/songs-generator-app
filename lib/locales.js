import fs from 'fs';
import path from 'path';
import { DEFAULT_REGION } from './songs/constants';

export const supportedRegions = ['en-US', 'ru-RU'];

export function loadLocaleData(region) {
    return JSON.parse(fs.readFileSync(createLocalePath(getSafeRegion(region)), 'utf-8'));
}

function getSafeRegion(region) {
    return supportedRegions.includes(region) ? region : DEFAULT_REGION;
}

function createLocalePath(region) {
    return path.join(process.cwd(), 'data', 'locales', region, 'music.json');
}
