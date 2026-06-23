import * as Tone from 'tone';
import { clamp } from '../../utils/math';
import { disposeVoiceNodes, getDestinationNode, getRawAudioContext, stopSource } from './environment';

export function fitEventsToVoiceBuffers(events, buffers) {
    return events.map((event, index) => fitEventToVoiceBuffer(event, buffers[index], events[index + 1]));
}

export function scheduleVoiceBuffers(destination, events, buffers) {
    const activeSources = new Set();
    const humSynth = createHumSynth(destination);
    const eventIds = createScheduledEvents({ destination, events, buffers, activeSources, humSynth });
    return createScheduleDisposer({ eventIds, activeSources, humSynth });
}

function fitEventToVoiceBuffer(event, buffer, nextEvent) {
    if (!buffer) return event;
    return { ...event, durationSeconds: getFittedDuration(event, buffer, nextEvent) };
}

function getFittedDuration(event, buffer, nextEvent) {
    return limitByNextEvent(getNaturalDuration(event, buffer), event, nextEvent);
}

function getNaturalDuration(event, buffer) {
    const playbackRate = Math.max(event.rateEnd ?? 1, 0.01);
    return Math.max(event.durationSeconds, Math.min(buffer.duration / playbackRate + 0.05, getMaxPlayableDuration(event)));
}

function limitByNextEvent(duration, event, nextEvent) {
    if (!nextEvent) return duration;
    return Math.min(duration, Math.max(0.2, nextEvent.time - event.time - 0.03));
}

function getMaxPlayableDuration(event) {
    return clamp(0.5 + String(event.text || '').length * 0.065, 0.7, 1.45);
}

function createHumSynth(destination) {
    return new Tone.Synth(createHumOptions()).connect(destination);
}

function createHumOptions() {
    return { oscillator: { type: 'triangle' }, envelope: createHumEnvelope(), volume: -18 };
}

function createHumEnvelope() {
    return { attack: 0.04, decay: 0.12, sustain: 0.45, release: 0.18 };
}

function createScheduledEvents(context) {
    return context.events.map((event, index) => scheduleVoiceEvent(context, event, index));
}

function scheduleVoiceEvent(context, event, index) {
    return Tone.Transport.schedule((time) => playScheduledEvent(context, event, index, time), event.time);
}

function playScheduledEvent(context, event, index, time) {
    triggerHum(context.humSynth, event, time);
    trackNodes(context.activeSources, playVoiceBuffer(context.destination, context.buffers[index], event, time));
}

function triggerHum(humSynth, event, time) {
    humSynth.triggerAttackRelease(Tone.Frequency(event.midi, 'midi'), event.durationSeconds, time, event.velocity * 0.35);
}

function trackNodes(activeSources, nodes) {
    activeSources.add(nodes);
    nodes.source.onended = () => disposeTrackedNodes(activeSources, nodes);
}

function disposeTrackedNodes(activeSources, nodes) {
    disposeVoiceNodes(nodes);
    activeSources.delete(nodes);
}

function createScheduleDisposer({ eventIds, activeSources, humSynth }) {
    return { dispose: () => disposeSchedule({ eventIds, activeSources, humSynth }) };
}

function disposeSchedule({ eventIds, activeSources, humSynth }) {
    eventIds.forEach((id) => Tone.Transport.clear(id));
    activeSources.forEach(disposeActiveSource);
    humSynth.dispose();
    activeSources.clear();
}

function disposeActiveSource(nodes) {
    stopSource(nodes.source);
    disposeVoiceNodes(nodes);
}

function playVoiceBuffer(destination, buffer, event, time) {
    const nodes = createVoiceNodes(buffer);
    configureVoiceNodes(nodes, event, time);
    connectVoiceNodes(destination, nodes);
    startVoiceNodes(nodes, event, time);
    return nodes;
}

function createVoiceNodes(buffer) {
    return { ...createSpeechNodes(buffer), ...createCarrierNodes(), ...createVibratoNodes() };
}

function createSpeechNodes(buffer) {
    const audioContext = getRawAudioContext();
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    return { source, filter: audioContext.createBiquadFilter(), gain: audioContext.createGain() };
}

function createCarrierNodes() {
    const audioContext = getRawAudioContext();
    return { carrier: audioContext.createOscillator(), carrierFilter: audioContext.createBiquadFilter(), carrierGain: audioContext.createGain() };
}

function createVibratoNodes() {
    const audioContext = getRawAudioContext();
    return { vibrato: audioContext.createOscillator(), vibratoDepth: audioContext.createGain(), carrierVibratoDepth: audioContext.createGain() };
}

function configureVoiceNodes(nodes, event, time) {
    configureSpeechNodes(nodes, event, time);
    configureCarrierNodes(nodes, event, time);
    configureVibratoNodes(nodes, time);
}

function configureSpeechNodes({ source, filter, gain }, event, time) {
    configurePlaybackRate(source, event, time);
    configureFilter(filter, 'lowpass', 3800, 0.5, time);
    configureGainEnvelope(gain.gain, getGain(event), time, event.durationSeconds, 0.035, 0.09);
}

function configurePlaybackRate(source, event, time) {
    source.playbackRate.setValueAtTime(event.rateStart, time);
    source.playbackRate.linearRampToValueAtTime(event.rateEnd, time + event.durationSeconds * 0.75);
}

function configureCarrierNodes({ carrier, carrierFilter, carrierGain }, event, time) {
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(Tone.Frequency(event.midi, 'midi').toFrequency(), time);
    configureFilter(carrierFilter, 'lowpass', 1800, 0.8, time);
    configureGainEnvelope(carrierGain.gain, getCarrierGain(event), time, event.durationSeconds, 0.05, 0.12);
}

function configureVibratoNodes({ vibrato, vibratoDepth, carrierVibratoDepth }, time) {
    vibrato.frequency.setValueAtTime(5.2, time);
    configureRamp(vibratoDepth.gain, 0.01, time, 0.14);
    configureRamp(carrierVibratoDepth.gain, 10, time, 0.14);
}

function configureFilter(filter, type, frequency, q, time) {
    filter.type = type;
    filter.frequency.setValueAtTime(frequency, time);
    filter.Q.setValueAtTime(q, time);
}

function configureGainEnvelope(param, value, time, duration, attack, release) {
    param.setValueAtTime(0.0001, time);
    param.exponentialRampToValueAtTime(value, time + attack);
    param.setValueAtTime(value, Math.max(time + attack, time + duration - release));
    param.exponentialRampToValueAtTime(0.0001, time + duration);
}

function configureRamp(param, value, time, attack) {
    param.setValueAtTime(0.0001, time);
    param.linearRampToValueAtTime(value, time + attack);
}

function connectVoiceNodes(destination, nodes) {
    connectSpeechPath(destination, nodes);
    connectCarrierPath(destination, nodes);
    connectVibrato(nodes);
}

function connectSpeechPath(destination, { source, filter, gain }) {
    source.connect(filter);
    filter.connect(gain);
    gain.connect(getDestinationNode(destination));
}

function connectCarrierPath(destination, { carrier, carrierFilter, carrierGain }) {
    carrier.connect(carrierFilter);
    carrierFilter.connect(carrierGain);
    carrierGain.connect(getDestinationNode(destination));
}

function connectVibrato({ vibrato, vibratoDepth, source, carrierVibratoDepth, carrier }) {
    vibrato.connect(vibratoDepth);
    vibratoDepth.connect(source.playbackRate);
    vibrato.connect(carrierVibratoDepth);
    carrierVibratoDepth.connect(carrier.detune);
}

function startVoiceNodes({ source, carrier, vibrato }, event, time) {
    startTimedNode(vibrato, time + 0.05, time + event.durationSeconds);
    startTimedNode(carrier, time, time + event.durationSeconds);
    startTimedNode(source, time, time + event.durationSeconds);
}

function startTimedNode(node, startTime, stopTime) {
    node.start(startTime);
    node.stop(stopTime);
}

function getCarrierGain(event) {
    return clamp(0.055 + event.velocity * 0.12, 0.08, 0.18);
}

function getGain(event) {
    return clamp(0.3 + event.velocity * 0.3, 0.24, 0.62);
}
