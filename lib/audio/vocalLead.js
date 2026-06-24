import * as Tone from 'tone';

export function createVocalLeadPart(synth, vocal = []) {
    const part = new Tone.Part(playVocalNote(synth), createVocalEvents(vocal));
    part.start(0);
    return part;
}

function createVocalEvents(vocal) {
    return vocal.map((event) => ({
        time: event.time,
        note: event.note,
        duration: event.durationSeconds,
        velocity: Math.min(event.velocity ?? 0.55, 0.5)
    }));
}

function playVocalNote(synth) {
    return (time, event) => {
        synth.triggerAttackRelease(
            event.note,
            event.duration,
            time,
            event.velocity
        );
    };
}