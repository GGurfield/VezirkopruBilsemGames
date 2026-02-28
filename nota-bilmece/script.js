class AudioEngine {
    constructor() {
        this.ctx = null;
        this.notes = {
            'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
            'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
            'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
            'C5': 523.25
        };
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playNote(note, duration = 1.2) {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const freq = this.notes[note];
        if (!freq) return;

        const now = this.ctx.currentTime;

        // --- 1. Audio Nodes ---
        const masterGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Foundation: Triangle for soft attack and body
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Body: Sine for pure fundamental
        const bodyValue = this.ctx.createOscillator();
        bodyValue.type = 'sine';
        bodyValue.frequency.setValueAtTime(freq, now);
        const bodyGain = this.ctx.createGain();

        // Harmonics: To add "twang"
        const harmonic = this.ctx.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(freq * 2, now);
        const harmonicGain = this.ctx.createGain();

        // Hammer: High frequency burst
        const hammer = this.ctx.createOscillator();
        hammer.type = 'sine';
        hammer.frequency.setValueAtTime(freq * 4, now);
        const hammerGain = this.ctx.createGain();

        // --- 2. Envelopes ---
        // Master Gain
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.5, now + 0.01);
        masterGain.gain.exponentialRampToValueAtTime(0.2, now + 0.2);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Filter: Sharp initial attack then quick closing
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + duration);
        filter.Q.setValueAtTime(1, now);

        // Individual gains
        bodyGain.gain.setValueAtTime(0.3, now);

        harmonicGain.gain.setValueAtTime(0.1, now);
        harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        hammerGain.gain.setValueAtTime(0.2, now);
        hammerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        // --- 3. Connections ---
        osc.connect(filter);
        bodyValue.connect(bodyGain);
        bodyGain.connect(filter);
        harmonic.connect(harmonicGain);
        harmonicGain.connect(filter);
        hammer.connect(hammerGain);
        hammerGain.connect(filter);

        filter.connect(masterGain);
        masterGain.connect(this.ctx.destination);

        // --- 4. Start/Stop ---
        osc.start(now);
        bodyValue.start(now);
        harmonic.start(now);
        hammer.start(now);

        osc.stop(now + duration);
        bodyValue.stop(now + duration);
        harmonic.stop(now + duration);
        harmonic.stop(now + duration);
    }
}

class GameController {
    constructor(audioEngine, uiController) {
        this.audio = audioEngine;
        this.ui = uiController;
        this.allNotes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'];
        this.whiteNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
        this.reset();
    }

    reset(keepLevel = false) {
        if (!keepLevel) {
            this.level = 1;
        }
        this.lives = 3;
        this.sequence = [];
        this.playerIndex = 0;
        this.gameState = 'idle'; // idle, intro, playing, listening, over
        this.ui.updateStats(this.level, this.lives);
    }

    async playIntro() {
        this.gameState = 'intro';
        this.ui.setStatus('Notaları Tanıyalım...');

        for (const note of this.allNotes) {
            this.audio.playNote(note);
            this.ui.highlightKey(note, 'playing');
            await new Promise(r => setTimeout(r, 400));
        }

        await new Promise(r => setTimeout(r, 500));
        this.startLevel();
    }

    startLevel() {
        this.gameState = 'playing';
        this.playerIndex = 0;
        this.generateSequence();
        this.ui.setStatus('Dinle...');
        this.playSequence();
    }

    generateSequence() {
        this.sequence = [];
        // Available notes based on level
        const availableNotes = this.level > 10 ? this.allNotes : this.whiteNotes;

        for (let i = 0; i < this.level; i++) {
            const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
            this.sequence.push(randomNote);
        }
    }

    async playSequence() {
        this.gameState = 'playing';
        this.ui.replayBtn.classList.add('hidden'); // Hide during playback
        for (const note of this.sequence) {
            this.audio.playNote(note);
            await new Promise(r => setTimeout(r, 800));
        }
        this.gameState = 'listening';
        this.ui.setStatus('Sıra sende!');
        this.ui.replayBtn.classList.remove('hidden'); // Show when ready
    }

    async replaySequence() {
        if (this.gameState !== 'listening') return;
        this.playerIndex = 0;
        await this.playSequence();
    }

    handleInput(note) {
        if (this.gameState !== 'listening') return;

        this.audio.playNote(note);
        this.ui.highlightKey(note, 'playing');

        if (note === this.sequence[this.playerIndex]) {
            this.playerIndex++;
            if (this.playerIndex === this.sequence.length) {
                this.success();
            }
        } else {
            this.fail();
        }
    }

    success() {
        this.gameState = 'idle';
        this.ui.setStatus('Tebrikler!');
        this.ui.replayBtn.classList.add('hidden');
        this.level++;
        setTimeout(() => {
            this.ui.updateStats(this.level, this.lives);
            this.startLevel();
        }, 1500);
    }

    fail() {
        this.lives--;
        this.ui.updateStats(this.level, this.lives);
        this.ui.replayBtn.classList.add('hidden');

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.ui.setStatus('Yanlış nota! Tekrar dene...');
            this.playerIndex = 0;
            this.gameState = 'playing';
            setTimeout(() => this.playSequence(), 1000);
        }
    }

    gameOver() {
        this.gameState = 'over';
        this.ui.replayBtn.classList.add('hidden');
        this.ui.showModal('Canlar Bitti!', `Seviye ${this.level}'desin. Buradan devam etmek ister misin?`);
        this.ui.restartBtn.textContent = 'Devam Et';
    }
}

class UIController {
    constructor() {
        this.statusText = document.getElementById('status-text');
        this.levelValue = document.querySelector('#level-display span');
        this.livesIcons = document.querySelector('.lives-icons');
        this.startBtn = document.getElementById('start-btn');
        this.replayBtn = document.getElementById('replay-btn');
        this.overlay = document.getElementById('overlay');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.restartBtn = document.getElementById('restart-btn');
        this.keys = document.querySelectorAll('.key');
    }

    setStatus(text) {
        this.statusText.textContent = text;
    }

    updateStats(level, lives) {
        this.levelValue.textContent = level;
        this.livesIcons.textContent = '❤️'.repeat(lives);
    }

    highlightKey(note, type) {
        const keyId = note.replace('#', 's');
        const el = document.getElementById(`key-${keyId}`);
        if (!el) return;

        const isWhite = el.classList.contains('white');
        const className = `${type}-${isWhite ? 'white' : 'black'}`;

        el.classList.add(className);
        setTimeout(() => el.classList.remove(className), 300);
    }

    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.overlay.classList.remove('hidden');
    }

    hideModal() {
        this.overlay.classList.add('hidden');
    }
}

// Initialize
const audio = new AudioEngine();
const ui = new UIController();
const game = new GameController(audio, ui);

ui.startBtn.addEventListener('click', () => {
    audio.init();
    ui.startBtn.classList.add('hidden');
    game.playIntro();
});

ui.replayBtn.addEventListener('click', () => {
    game.replaySequence();
});

ui.restartBtn.addEventListener('click', () => {
    ui.hideModal();
    ui.startBtn.classList.add('hidden');
    game.reset(true); // Keep the level, just reset lives/state
    game.startLevel(); // Start the level immediately
});

ui.keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        game.handleInput(note);

        // Visual feedback for click regardless of game state
        const isWhite = key.classList.contains('white');
        const activeClass = `active-${isWhite ? 'white' : 'black'}`;
        key.classList.add(activeClass);
    });

    key.addEventListener('mouseup', () => {
        const isWhite = key.classList.contains('white');
        const activeClass = `active-${isWhite ? 'white' : 'black'}`;
        key.classList.remove(activeClass);
    });

    key.addEventListener('mouseleave', () => {
        const isWhite = key.classList.contains('white');
        const activeClass = `active-${isWhite ? 'white' : 'black'}`;
        key.classList.remove(activeClass);
    });
});
