import { Chord, Scale } from '@tonaljs/tonal';
import { createRng, pickRandom, randomInt } from './randomGenerator';

const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'];
const modes = ['major', 'minor'];

const progressions = {
    major: [
        ['I', 'V', 'vi', 'IV'],
        ['I', 'vi', 'IV', 'V'],
        ['vi', 'IV', 'I', 'V'],
        ['I', 'IV', 'V', 'I'],
        ['ii', 'V', 'I', 'vi']
    ],
    minor: [
        ['i', 'VI', 'III', 'VII'],
        ['i', 'VII', 'VI', 'VII'],
        ['i', 'iv', 'VII', 'III'],
        ['i', 'VI', 'iv', 'V'],
        ['i', 'III', 'VII', 'VI']
    ]
};

const chordMaps = {
    major: {
        I: 'maj',
        ii: 'm',
        iii: 'm',
        IV: 'maj',
        V: 'maj',
        vi: 'm',
        vii: 'dim'
    },
    minor: {
        i: 'm',
        ii: 'dim',
        III: 'maj',
        iv: 'm',
        V: 'maj',
        VI: 'maj',
        VII: 'maj'
    }
};

const scaleDegrees = {
    major: ['1P', '2M', '3M', '4P', '5P', '6M'],
    minor: ['1P', '2M', '3m', '4P', '5P', '6m', '7m']
};

const grooves = [
    {
        name: 'straight',
        melodyDurations: ['8n', '8n', '4n', '8n', '8n', '4n'],
        drumPattern: [0, 2, 4, 6]
    },
    {
        name: 'syncopated',
        melodyDurations: ['8n', '16n', '16n', '4n', '8n', '8n'],
        drumPattern: [0, 1.5, 3, 4.5, 6]
    },
    {
        name: 'slow-pop',
        melodyDurations: ['4n', '8n', '8n', '2n'],
        drumPattern: [0, 2, 4]
    },
    {
        name: 'dance',
        melodyDurations: ['8n', '8n', '8n', '8n', '4n'],
        drumPattern: [0, 1, 2, 3, 4, 5, 6, 7]
    }
];

const synthPresets = [
    {
        name: 'soft synth',
        oscillator: 'sine',
        attack: 0.02,
        release: 0.4
    },
    {
        name: 'bright lead',
        oscillator: 'triangle',
        attack: 0.01,
        release: 0.25
    },
    {
        name: 'retro square',
        oscillator: 'square',
        attack: 0.03,
        release: 0.3
    },
    {
        name: 'warm pad',
        oscillator: 'sawtooth',
        attack: 0.2,
        release: 0.8
    }
];

export function generateMusic({ region, seed, index, tempo }) {
    const random = createRng('music', region, seed, index);

    const key = pickRandom(keys, random);
    const mode = pickRandom(modes, random);
    const groove = pickRandom(grooves, random);
    const synthPreset = pickRandom(synthPresets, random);
    const progression = pickRandom(progressions[mode], random);

    const chords = createChords({ key, mode, progression });
    const scaleNotes = createScaleNotes({ key, mode });

    return {
        tempo,
        key,
        mode,
        groove: groove.name,
        synthPreset,
        chords,
        melody: createMelody({ scaleNotes, groove, random }),
        bass: createBassLine({ chords }),
        drums: createDrums({ groove }),
        durationSeconds: 12
    };
}

function createChords({ key, mode, progression }) {
    return progression.map((degree) => {
        const root = getChordRoot(key, mode, degree);
        const type = chordMaps[mode][degree];

        return {
            degree,
            symbol: `${root}${type === 'maj' ? '' : type}`,
            root,
            notes: Chord.get(`${root}${type === 'maj' ? '' : type}`).notes
        };
    });
}

function getChordRoot(key, mode, degree) {
    const degreeIndexMap = {
        I: 0,
        i: 0,
        ii: 1,
        III: 2,
        iii: 2,
        IV: 3,
        iv: 3,
        V: 4,
        VI: 5,
        vi: 5,
        VII: 6,
        vii: 6
    };

    const scaleName = `${key} ${mode}`;
    const notes = Scale.get(scaleName).notes;

    return notes[degreeIndexMap[degree]] || key;
}

function createScaleNotes({ key, mode }) {
    const scaleName = `${key} ${mode}`;
    const notes = Scale.get(scaleName).notes;

    if (!notes.length) {
        return mode === 'major'
            ? ['C4', 'D4', 'E4', 'G4', 'A4', 'C5']
            : ['A3', 'C4', 'D4', 'E4', 'G4', 'A4'];
    }

    return notes.flatMap((note) => [`${note}4`, `${note}5`]);
}

function createMelody({ scaleNotes, groove, random }) {
    const melodyLength = randomInt(20, 32, random);

    return Array.from({ length: melodyLength }, (_, index) => {
        const preferStableNote = index % 4 === 0;
        const notePool = preferStableNote
            ? [scaleNotes[0], scaleNotes[2], scaleNotes[4]].filter(Boolean)
            : scaleNotes;

        return {
            note: pickRandom(notePool, random),
            duration: groove.melodyDurations[index % groove.melodyDurations.length],
            velocity: 0.45 + random() * 0.45
        };
    });
}

function createBassLine({ chords }) {
    return chords.flatMap((chord, chordIndex) => {
        const octaveRoot = `${chord.root}2`;

        return [
            {
                note: octaveRoot,
                time: chordIndex * 2,
                duration: '2n',
                velocity: 0.65
            },
            {
                note: octaveRoot,
                time: chordIndex * 2 + 1,
                duration: '4n',
                velocity: 0.45
            }
        ];
    });
}

function createDrums({ groove }) {
    return groove.drumPattern.map((time, index) => ({
        time,
        type: index % 2 === 0 ? 'kick' : 'hat'
    }));
}