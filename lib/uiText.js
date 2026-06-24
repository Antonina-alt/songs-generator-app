import uiData from '@/data/locales/ui.json';

export function getUiText(region = uiData.defaultRegion) {
    const rawUiText = getRawUiText(region);
    return createUiText(rawUiText);
}

export function getRegionOptions(uiText) {
    return Object.entries(uiText.regions).map(createRegionOption);
}

function getRawUiText(region) {
    return uiData.texts[region] ?? uiData.texts[uiData.defaultRegion];
}

function createRegionOption([value, label]) {
    return { value, label };
}

function createUiText(rawUiText) {
    return {
        ...rawUiText,
        table: createTableText(rawUiText.table),
        song: createSongText(rawUiText.song)
    };
}

function createTableText(table) {
    return { ...table, pagination: createPaginationText(table.pagination) };
}

function createPaginationText(pagination) {
    return { ...pagination, displayedRows: createDisplayedRowsFormatter(pagination) };
}

function createDisplayedRowsFormatter({ displayedRows }) {
    return (from, to, page) => formatTemplate(displayedRows, { from, to, page });
}

function createSongText(song) {
    return { ...song, coverAlt: createCoverAltFormatter(song) };
}

function createCoverAltFormatter({ coverAlt }) {
    return (title) => formatTemplate(coverAlt, { title });
}

function formatTemplate(template, values) {
    return template.replace(/\{(\w+)}/g, (_, key) => getTemplateValue(values, key));
}

function getTemplateValue(values, key) {
    return String(values[key] ?? `{${key}}`);
}
