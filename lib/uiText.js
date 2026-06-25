import uiData from '@/data/locales/ui.json';

export function getUiText(region = uiData.defaultRegion) {
    const selectedRegion = getSupportedUiRegion(region);
    return createUiText(getRawUiText(selectedRegion), selectedRegion);
}

export function getRegionOptions(uiText) {
    return Object.entries(uiText.regions).map(([value, label]) => ({ value, label }));
}

function getSupportedUiRegion(region) {
    return uiData.texts[region] ? region : uiData.defaultRegion;
}

function getRawUiText(region) {
    return uiData.texts[region];
}

function createUiText(rawUiText, region) {
    return {
        ...rawUiText,
        table: createTableText(rawUiText.table),
        song: createSongText(rawUiText.song, region)
    };
}

function createTableText(table) {
    return { ...table, pagination: createPaginationText(table.pagination) };
}

function createPaginationText(pagination) {
    return {
        ...pagination,
        displayedRows: (from, to, page) => formatTemplate(pagination.displayedRows, { from, to, page })
    };
}

function createSongText(song, region) {
    return {
        ...song,
        likes: createLikesFormatter(song.likes, region),
        coverAlt: (title) => formatTemplate(song.coverAlt, { title })
    };
}

function createLikesFormatter(likesText, region) {
    const pluralRules = new Intl.PluralRules(region);

    return (count) => formatTemplate(getPluralTemplate(likesText, pluralRules.select(count)), { count });
}

function getPluralTemplate(forms, category) {
    if (typeof forms === 'string') return `{count} ${forms}`;
    return forms[category] ?? forms.other ?? '{count}';
}

function formatTemplate(template, values) {
    return template.replace(/\{(\w+)}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
