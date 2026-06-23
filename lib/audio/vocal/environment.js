import * as Tone from 'tone';

export function canUseVocalRenderer() {
    return typeof window !== 'undefined' && Boolean(window.meSpeak);
}

export function getRawAudioContext() {
    const toneContext = Tone.getContext?.() || Tone.context;
    return toneContext.rawContext || toneContext._context || toneContext;
}

export function getDestinationNode(destination) {
    return destination?.input || destination || getRawAudioContext().destination;
}

export function stopSource(source) {
    tryRun(() => source.stop());
}

export function disposeVoiceNodes(nodes) {
    Object.values(nodes).forEach(disconnectNode);
}

function disconnectNode(node) {
    tryRun(() => node.disconnect());
}

function tryRun(action) {
    try {
        action();
    } catch {}
}
