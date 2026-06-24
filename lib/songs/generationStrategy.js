const FAKER_MUSIC_GENERATOR = 'fakerMusic';

export function shouldUseFakerMusic(localeData, sectionName) {
    return localeData?.generators?.[sectionName] === FAKER_MUSIC_GENERATOR;
}

export function getLocaleSection(localeData, sectionName) {
    return localeData?.[sectionName] ?? {};
}
