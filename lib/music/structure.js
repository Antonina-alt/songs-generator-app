import { CHORD_SECONDS, SECTION_CONFIGS } from './constants';

export function createSongStructure(durationSeconds) {
    return fitSectionsToDuration(SECTION_CONFIGS, durationSeconds);
}

export function findSectionAtTime(structure, time) {
    return structure.find((section) => isTimeInsideSection(section, time)) || structure.at(-1);
}

export function getSectionRole(section) {
    return section?.role || section?.name || 'verse';
}

function fitSectionsToDuration(sections, durationSeconds) {
    return createTimedSections(sections).map(boundSection(durationSeconds)).filter(isPlayableSection(durationSeconds));
}

function createTimedSections(sections) {
    return sections.reduce(addTimedSection, { currentTime: 0, items: [] }).items;
}

function addTimedSection(acc, section, index) {
    return { currentTime: acc.currentTime + getSectionDuration(section), items: [...acc.items, createTimedSection(section, index, acc.currentTime)] };
}

function createTimedSection(section, index, startTime) {
    return { ...section, index, startTime, endTime: startTime + getSectionDuration(section) };
}

function getSectionDuration(section) {
    return section.bars * CHORD_SECONDS;
}

function boundSection(durationSeconds) {
    return (section) => createBoundedSection(section, durationSeconds);
}

function isPlayableSection(durationSeconds) {
    return (section) => section.durationSeconds > 0 && section.startTime < durationSeconds;
}

function createBoundedSection(section, durationSeconds) {
    const endTime = Math.min(section.endTime, durationSeconds);
    return { ...section, endTime, durationSeconds: Math.max(0, endTime - section.startTime) };
}

function isTimeInsideSection(section, time) {
    return time >= section.startTime && time < section.endTime;
}
