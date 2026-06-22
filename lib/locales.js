import fs from 'fs';
import path from 'path';

export const supportedRegions = ['en-US', 'ru-RU'];

export function loadLocaleData(region) {
    const safeRegion = supportedRegions.includes(region) ? region : 'en-US';

    const filePath = path.join(
        process.cwd(),
        'data',
        'locales',
        safeRegion,
        'music.json'
    );

    const raw = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(raw);
}