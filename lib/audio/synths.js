import * as Tone from 'tone';

export function createAudioGraph(music) {
    const effects = createEffects();
    return {
        ...effects,
        ...createSynths(music, effects),
        ...createPercussion()
    };
}

function createReverb() {
    return new Tone.Reverb({ decay: 2.5, wet: 0.25 }).toDestination();
}

function createDelay(reverb) {
    return new Tone.FeedbackDelay(createDelayOptions()).connect(reverb);
}

function createDelayOptions() {
    return { delayTime: '8n', feedback: 0.25, wet: 0.18 };
}

function createSynths(music, effects) {
    return {
        melodySynth: createMelodySynth(music).connect(effects.delay),
        chordSynth: createChordSynth().connect(effects.reverb),
        bassSynth: createBassSynth().toDestination(),
        vocalBus: createVocalBus(effects)
    };
}

function createPercussion() {
    return { kick: createKickSynth(), hat: createHatSynth() };
}

function createMelodySynth(music) {
    return new Tone.Synth(createMelodySynthOptions(music));
}

function createMelodySynthOptions(music) {
    return {
        oscillator: { type: music.synthPreset?.oscillator || 'triangle' },
        envelope: createMelodyEnvelope(music),
        volume: -12
    };
}

function createMelodyEnvelope(music) {
    return {
        attack: music.synthPreset?.attack ?? 0.02,
        decay: 0.15,
        sustain: 0.35,
        release: music.synthPreset?.release ?? 0.4
    };
}

function createChordSynth() {
    return new Tone.PolySynth(Tone.Synth, createChordSynthOptions());
}

function createChordSynthOptions() {
    return {
        oscillator: { type: 'sine' },
        envelope: createChordEnvelope(),
        volume: -10
    };
}

function createChordEnvelope() {
    return { attack: 0.08, decay: 0.2, sustain: 0.4, release: 0.8 };
}

function createBassSynth() {
    return new Tone.MonoSynth(createBassSynthOptions());
}

function createBassSynthOptions() {
    return {
        oscillator: { type: 'square' },
        filter: createBassFilter(),
        envelope: createBassEnvelope(),
        volume: -8
    };
}

function createBassFilter() {
    return { Q: 2, type: 'lowpass', rolloff: -24 };
}

function createBassEnvelope() {
    return { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 };
}

function createKickSynth() {
    return new Tone.MembraneSynth(createKickOptions()).toDestination();
}

function createKickOptions() {
    return {
        pitchDecay: 0.05,
        octaves: 6,
        oscillator: { type: 'sine' },
        envelope: createKickEnvelope()
    };
}

function createKickEnvelope() {
    return { attack: 0.001, decay: 0.3, sustain: 0.01, release: 0.2 };
}

function createHatSynth() {
    return new Tone.NoiseSynth(createHatOptions()).toDestination();
}

function createHatOptions() {
    return { noise: { type: 'white' }, envelope: createHatEnvelope() };
}

function createHatEnvelope() {
    return { attack: 0.001, decay: 0.05, sustain: 0 };
}

function createEffects() {
    const reverb = createReverb();
    const delay = createDelay(reverb);
    const vocalEffects = createVocalEffects(reverb);

    return { reverb, delay, vocalEffects };
}

function createVocalEffects(reverb) {
    const compressor = new Tone.Compressor({
        threshold: -24,
        ratio: 3,
        attack: 0.02,
        release: 0.18
    });

    const eq = new Tone.EQ3({
        low: -4,
        mid: 1.5,
        high: -2
    });

    const chorus = new Tone.Chorus({
        frequency: 2.2,
        delayTime: 3.5,
        depth: 0.35,
        wet: 0.18
    }).start();

    const delay = new Tone.FeedbackDelay({
        delayTime: '16n',
        feedback: 0.14,
        wet: 0.1
    });

    compressor.connect(eq);
    eq.connect(chorus);
    chorus.connect(delay);
    delay.connect(reverb);

    return compressor;
}

function createVocalBus(effects) {
    return new Tone.Gain(0.85).connect(effects.vocalEffects);
}
