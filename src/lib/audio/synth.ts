import * as Tone from "tone";

export type SynthNodes = {
    oscillatorA: Tone.Oscillator;
    oscillatorB: Tone.Oscillator;
    crossFade: Tone.CrossFade;
    noise: Tone.Noise;
    gain: Tone.Gain;
};

export function createSynth(): SynthNodes {
    const oscillatorA = new Tone.Oscillator({ type: "sawtooth" });
    const oscillatorB = new Tone.Oscillator({ type: "sine" });
    const crossFade = new Tone.CrossFade(0);
    const noise = new Tone.Noise({ type: "white" });
    const gain = new Tone.Gain(0.5);

    oscillatorA.connect(crossFade.a);
    oscillatorB.connect(crossFade.b);
    crossFade.connect(gain);
    noise.connect(gain);
    gain.toDestination();

    oscillatorA.start();
    oscillatorB.start();
    noise.start();

    return {
        oscillatorA,
        oscillatorB,
        crossFade,
        noise,
        gain,
    };
}

export function disposeSynth(nodes: SynthNodes) {
    nodes.oscillatorA.stop();
    nodes.oscillatorB.stop();
    nodes.noise.stop();

    nodes.oscillatorA.dispose();
    nodes.oscillatorB.dispose();
    nodes.crossFade.dispose();
    nodes.noise.dispose();
    nodes.gain.dispose();
}
