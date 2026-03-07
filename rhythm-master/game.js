/**
 * RHYTHM NEBULA - Core Game Engine
 */

class RhythmNebula {
    constructor() {
        console.log("Rhythm Nebula Initializing...");
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error("Canvas not found!");
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score-val');
        this.comboElement = document.getElementById('combo-val');
        this.judgmentDisplay = document.getElementById('judgment-display');

        // Game Settings
        this.laneCount = 4;
        this.keys = ['a', 'f', 'h', 'l']; // New Keyboard Controls
        this.laneWidth = 0;
        this.hitZoneY = 0;
        this.noteSize = 40;
        this.scrollSpeed = 6;

        // Game State
        this.isPlaying = false;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.notes = [];
        this.startTime = 0;
        this.gameDuration = 60000; // 60 seconds game duration
        this.timeLeft = 60;
        this.spawnInterval = null;

        // Colors
        this.colors = ['#00f2ff', '#ff00ea', '#b100ff', '#00f2ff'];

        this.hitFlash = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupEventListeners();

        requestAnimationFrame((t) => this.gameLoop(t));
        console.log("Initialization complete.");
    }

    resize() {
        const parent = this.canvas.parentNode;
        const rect = parent.getBoundingClientRect();
        const height = rect.height > 100 ? rect.height : window.innerHeight - 200;

        this.canvas.width = 600;
        this.canvas.height = height;
        this.laneWidth = this.canvas.width / this.laneCount;
        this.hitZoneY = this.canvas.height - 100;
    }

    setupEventListeners() {
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');

        const beginGame = (e) => {
            e.preventDefault();
            this.startGame();
        };

        if (startBtn) startBtn.addEventListener('click', beginGame);
        if (restartBtn) restartBtn.addEventListener('click', beginGame);

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;
            const keyIndex = this.keys.indexOf(e.key.toLowerCase());
            if (keyIndex !== -1) {
                this.handleInput(keyIndex);
                this.highlightLane(keyIndex);
            }
        });
    }

    startGame() {
        console.log("Starting game...");
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        this.resetGame();
        this.isPlaying = true;
        this.startTime = performance.now();

        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.generateSimpleBeatmap();
    }

    resetGame() {
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.notes = [];
        this.timeLeft = Math.floor(this.gameDuration / 1000);
        this.updateHUD();
    }

    generateSimpleBeatmap() {
        this.spawnInterval = setInterval(() => {
            if (this.isPlaying) {
                const lanes = [0, 1, 2, 3];
                const count = Math.random() > 0.8 ? 2 : 1;

                for (let i = 0; i < count; i++) {
                    const laneIdx = Math.floor(Math.random() * lanes.length);
                    const lane = lanes.splice(laneIdx, 1)[0];
                    this.notes.push({
                        lane,
                        y: -50,
                        status: 'active'
                    });
                }
            } else {
                clearInterval(this.spawnInterval);
            }
        }, 450);
    }

    handleInput(laneIndex) {
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            if (note.lane === laneIndex && note.status === 'active') {
                const distance = Math.abs(note.y - this.hitZoneY);
                if (distance < 100) {
                    this.processHit(distance, i);
                    return;
                }
            }
        }
    }

    processHit(distance, index) {
        let judgment = '';
        let points = 0;
        const note = this.notes[index];
        note.status = 'hit';

        if (distance < 25) {
            judgment = 'PERFECT';
            points = 1000;
            this.combo++;
        } else if (distance < 60) {
            judgment = 'GREAT';
            points = 500;
            this.combo++;
        } else if (distance < 100) {
            judgment = 'GOOD';
            points = 200;
            this.combo++;
        }

        this.score += points * (1 + Math.floor(this.combo / 10) * 0.1);
        this.maxCombo = Math.max(this.combo, this.maxCombo);
        this.showJudgment(judgment);
        this.updateHUD();
    }

    showJudgment(text) {
        if (!this.judgmentDisplay) return;
        this.judgmentDisplay.innerText = text;
        this.judgmentDisplay.style.color = text === 'PERFECT' ? '#00f2ff' : (text === 'MISS' ? '#ff3333' : '#ffffff');
        this.judgmentDisplay.style.animation = 'none';
        void this.judgmentDisplay.offsetWidth;
        this.judgmentDisplay.style.animation = 'judgmentPop 0.3s ease-out forwards';
    }

    highlightLane(index) {
        this.hitFlash = { lane: index, alpha: 0.3 };
    }

    updateHUD() {
        if (this.scoreElement) this.scoreElement.innerText = Math.floor(this.score).toString().padStart(7, '0');
        if (this.comboElement) this.comboElement.innerText = this.combo;
    }

    gameLoop(timestamp) {
        if (this.isPlaying) {
            this.update(timestamp);
            this.draw();
        }
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(timestamp) {
        // Check Timer
        const elapsed = timestamp - this.startTime;
        this.timeLeft = Math.max(0, Math.floor((this.gameDuration - elapsed) / 1000));

        if (elapsed >= this.gameDuration) {
            this.endGame();
            return;
        }

        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            if (note.status === 'active') {
                note.y += this.scrollSpeed;
                if (note.y > this.canvas.height + 50) {
                    note.status = 'miss';
                    this.combo = 0;
                    this.showJudgment('MISS');
                    this.updateHUD();
                }
            } else if (note.status === 'hit' || note.status === 'miss') {
                this.notes.splice(i, 1);
            }
        }

        if (this.hitFlash && this.hitFlash.alpha > 0) {
            this.hitFlash.alpha -= 0.05;
        }
    }

    endGame() {
        console.log("Game Ended");
        this.isPlaying = false;
        clearInterval(this.spawnInterval);

        const gameOverScreen = document.getElementById('game-over-screen');
        const finalScoreVal = document.getElementById('final-score');
        const maxComboVal = document.getElementById('max-combo');

        if (finalScoreVal) finalScoreVal.innerText = Math.floor(this.score);
        if (maxComboVal) maxComboVal.innerText = this.maxCombo;
        if (gameOverScreen) gameOverScreen.classList.remove('hidden');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Timer display (Simple)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.font = '20px Outfit';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`KALAN SÜRE: ${this.timeLeft}s`, this.canvas.width / 2, 30);

        // Draw Lanes
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 1; i < this.laneCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.laneWidth, 0);
            this.ctx.lineTo(i * this.laneWidth, this.canvas.height);
            this.ctx.stroke();
        }

        // Hit Zone Flash
        if (this.hitFlash && this.hitFlash.alpha > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.hitFlash.alpha})`;
            this.ctx.fillRect(this.hitFlash.lane * this.laneWidth, 0, this.laneWidth, this.canvas.height);
        }

        // Draw hit Zone
        this.ctx.strokeStyle = 'rgba(242, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.hitZoneY);
        this.ctx.lineTo(this.canvas.width, this.hitZoneY);
        this.ctx.stroke();

        for (let i = 0; i < this.laneCount; i++) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.05)';
            this.ctx.beginPath();
            this.ctx.arc(i * this.laneWidth + this.laneWidth / 2, this.hitZoneY, this.noteSize / 2 + 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = this.colors[i];
            this.ctx.stroke();
        }

        for (const note of this.notes) {
            if (note.status === 'active') {
                const x = note.lane * this.laneWidth + this.laneWidth / 2;
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = this.colors[note.lane];
                this.ctx.fillStyle = this.colors[note.lane];
                this.ctx.beginPath();
                this.ctx.arc(x, note.y, this.noteSize / 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        }
    }
}

function initGame() {
    if (!window.game) {
        window.game = new RhythmNebula();
    }
}

if (document.readyState === 'complete') {
    initGame();
} else {
    window.addEventListener('load', initGame);
}
