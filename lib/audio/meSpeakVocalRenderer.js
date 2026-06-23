import { createVocalEvents } from './vocal/events';
import { canUseVocalRenderer } from './vocal/environment';
import { loadMespeakVoice, getVoiceBuffer } from './vocal/mespeakLoader';
import { fitEventsToVoiceBuffers, scheduleVoiceBuffers } from './vocal/scheduler';

export async function createMeSpeakVocalSchedule(destination, music, lyrics = []) {
    if (!canUseVocalRenderer()) return createEmptyVocalSchedule();

    const events = createVocalEvents(music, lyrics);
    if (!events.length) return createEmptyVocalSchedule();

    await loadMespeakVoice(music?.region);
    return createVocalSchedule(destination, music, events);
}

async function createVocalSchedule(destination, music, events) {
    const buffers = await Promise.all(events.map((event) => getVoiceBuffer(event, music)));
    return scheduleVoiceBuffers(destination, fitEventsToVoiceBuffers(events, buffers), buffers);
}

function createEmptyVocalSchedule() {
    return { dispose() {} };
}
