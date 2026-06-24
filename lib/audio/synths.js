import * as Tone from 'tone';
import {
    BASS_VOLUME,
    CHORD_VOLUME,
    DRUM_VOLUME,
    MELODY_VOLUME,
    MASTER_VOLUME,
    VOCAL_VOLUME
} from './constants';

const MIX_CHANNELS = [
    ['melodyBus', 'melodyVolume', MELODY_VOLUME],
    ['chordBus', 'chordVolume', CHORD_VOLUME],
    ['bassBus', 'bassVolume', BASS_VOLUME],
    ['drumBus', 'drumVolume', DRUM_VOLUME],
    ['vocalBus', 'vocalVolume', VOCAL_VOLUME]
];

export function createAudioGraph(music) {
    const masterBus = createMasterBus();
    const mixer = createMixer(masterBus, music);
    const effects = createEffects(mixer);
    return mergeAudioGraph(masterBus, mixer, effects, music);
}

function mergeAudioGraph(masterBus, mixer, effects, music) {
    return { masterBus, ...mixer, ...effects, ...createSynths(music, mixer, effects), ...createPercussion(mixer) };
}

function createMasterBus() {
    return new Tone.Volume(MASTER_VOLUME).toDestination();
}

function createMixer(masterBus, music) {
    return Object.fromEntries(MIX_CHANNELS.map((channel) => createBusEntry(channel, masterBus, music)));
}

function createBusEntry([busName, mixName, fallback], masterBus, music) {
    return [busName, new Tone.Volume(getMixVolume(music, mixName, fallback)).connect(masterBus)];
}

function createEffects(mixer) {
    return { ...createMelodyEffects(mixer), ...createChordEffects(mixer), ...createVocalEffects(mixer) };
}

function createMelodyEffects({ melodyBus }) {
    const melodyReverb = createReverb({ decay: 2, wet: 0.18 }, melodyBus);
    const melodyDelay = createDelay({ delayTime: '8n', feedback: 0.25, wet: 0.18 }, melodyReverb);
    return { melodyReverb, melodyDelay };
}

function createChordEffects({ chordBus }) {
    return { chordReverb: createReverb({ decay: 2.5, wet: 0.22 }, chordBus) };
}

function createVocalEffects({ vocalBus }) {
    const chain = createVocalChain();
    connectNodes([...Object.values(chain), vocalBus]);
    return chain;
}

function createVocalChain() {
    return {
        vocalCompressor: createCompressor(),
        vocalEq: createEq(),
        vocalChorus: createChorus(),
        vocalDelay: createDelayNode({ delayTime: '16n', feedback: 0.14, wet: 0.1 })
    };
}

function createSynths(music, mixer, effects) {
    return {
        melodySynth: createMelodySynth(music).connect(effects.melodyDelay),
        chordSynth: createChordSynth().connect(effects.chordReverb),
        bassSynth: createBassSynth().connect(mixer.bassBus),
        vocalSynth: createVocalSynth().connect(effects.vocalCompressor)
    };
}

function createPercussion({ drumBus }) {
    return { kick: createKickSynth().connect(drumBus), hat: createHatSynth().connect(drumBus) };
}

function createReverb(options, destination) {
    return new Tone.Reverb(options).connect(destination);
}

function createDelay(options, destination) {
    return createDelayNode(options).connect(destination);
}

function createDelayNode(options) {
    return new Tone.FeedbackDelay(options);
}

function createCompressor() {
    return new Tone.Compressor({ threshold: -24, ratio: 3, attack: 0.02, release: 0.18 });
}

function createEq() {
    return new Tone.EQ3({ low: -4, mid: 1.5, high: -2 });
}

function createChorus() {
    return new Tone.Chorus({ frequency: 2.2, delayTime: 3.5, depth: 0.35, wet: 0.18 }).start();
}

function connectNodes(nodes) {
    nodes.slice(0, -1).forEach((node, index) => node.connect(nodes[index + 1]));
}

function createMelodySynth(music) {
    return new Tone.Synth(createMelodySynthOptions(music));
}

function createMelodySynthOptions(music) {
    return createSynthOptions(music.synthPreset?.oscillator || 'triangle', createMelodyEnvelope(music), -12);
}

function createMelodyEnvelope(music) {
    return createEnvelope(music.synthPreset?.attack ?? 0.02, 0.15, 0.35, music.synthPreset?.release ?? 0.4);
}

function createChordSynth() {
    return new Tone.PolySynth(Tone.Synth, createChordSynthOptions());
}

function createChordSynthOptions() {
    return createSynthOptions('sine', createEnvelope(0.08, 0.2, 0.4, 0.8), -10);
}

function createBassSynth() {
    return new Tone.MonoSynth(createBassSynthOptions());
}

function createBassSynthOptions() {
    return { ...createSynthOptions('square', createEnvelope(0.01, 0.2, 0.4, 0.3), -8), filter: createBassFilter() };
}

function createBassFilter() {
    return { Q: 2, type: 'lowpass', rolloff: -24 };
}

function createVocalSynth() {
    return new Tone.Synth(createSynthOptions('triangle', createEnvelope(0.04, 0.12, 0.45, 0.3), -10));
}

function createKickSynth() {
    return new Tone.MembraneSynth(createKickOptions());
}

function createKickOptions() {
    return { pitchDecay: 0.05, octaves: 6, oscillator: { type: 'sine' }, envelope: createEnvelope(0.001, 0.3, 0.01, 0.2) };
}

function createHatSynth() {
    return new Tone.NoiseSynth(createHatOptions());
}

function createHatOptions() {
    return { noise: { type: 'white' }, envelope: createHatEnvelope(), volume: -18 };
}

function createHatEnvelope() {
    return { attack: 0.001, decay: 0.05, sustain: 0 };
}

function createSynthOptions(type, envelope, volume) {
    return { oscillator: { type }, envelope, volume };
}

function createEnvelope(attack, decay, sustain, release) {
    return { attack, decay, sustain, release };
}

function getMixVolume(music, name, fallback) {
    return music.mix?.[name] ?? fallback;
}
