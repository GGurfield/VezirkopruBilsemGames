// js/audio.js
class AudioManager {
    constructor() {
        this.enabled = true;
        // Placeholder simple synthesized sounds using Web Audio API to avoid requiring external assets immediately
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playClick() {
        if (!this.enabled) return;
        this.playTone(600, 'sine', 0.05, 0.1);
    }

    playDrop() {
        if (!this.enabled) return;
        this.playTone(300, 'square', 0.1, 0.2);
    }

    playClear() {
        if (!this.enabled) return;
        this.playTone(800, 'sine', 0.1, 0.3);
        setTimeout(() => this.playTone(1200, 'sine', 0.1, 0.3), 100);
    }

    playGameOver() {
        if (!this.enabled) return;
        this.playTone(200, 'sawtooth', 0.5, 1.0);
        setTimeout(() => this.playTone(150, 'sawtooth', 0.5, 1.5), 300);
    }

    playTone(freq, type, vol, duration) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

window.AudioManager = new AudioManager();
