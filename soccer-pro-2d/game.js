// Soccer Pro 2D - Premium Arcade Experience
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = false;
let p1Score = 0;
let aiScore = 0;
const winningScore = 5;

// Pitch settings
const pitch = {
    w: 1200,
    h: 800,
    margin: 100,
    goalSize: 200
};

// Physics
const friction = 0.985;
const bounce = 0.7;

// Tournament Settings
let difficulty = 'amateur';
let matchTime = 120; // Default 2 mins
let timeLeft = 0;
let timerInterval = null;
let goldenGoal = false;

// Statistics
let stats = {
    shots: 0,
    possessionTime: { p1: 0, ai: 0 },
    maxKickForce: 0,
    collisions: 0
};
let possessionHolder = null;
let particles = [];
let shakeAmount = 0;
let flashOpacity = 0;
let crowd = [];
let mouse = { x: 0, y: 0, down: false };

// Sound Engine
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let ambientSource = null;

function playSound(freq, type, duration, volume = 0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + duration);
    env.gain.setValueAtTime(volume, audioCtx.currentTime);
    env.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    osc.connect(env);
    env.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// UI Toggles
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.parentElement;
        group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.diff) difficulty = btn.dataset.diff;
        if (btn.dataset.time) matchTime = parseInt(btn.dataset.time);
    });
});

function applyDifficulty() {
    const multi = { amateur: 0.6, pro: 1.0, world: 1.4 }[difficulty];
    ai.speed = 1.0 * multi;
    ai.maxSpeed = 8 * multi;
    ai.kickForce = 18 * multi;
}

function startTimer() {
    if (matchTime === 0) {
        document.getElementById('match-timer').textContent = '∞';
        return;
    }
    timeLeft = matchTime;
    updateTimerHUD();
    timerInterval = setInterval(() => {
        if (gameRunning) {
            timeLeft--;
            updateTimerHUD();
            if (timeLeft <= 0) {
                if (p1Score === aiScore) {
                    goldenGoal = true;
                    showStatus('ALTIN GOL!');
                } else {
                    endGame(p1Score > aiScore ? 'KAZANDIN!' : 'YAPAY ZEKA KAZANDI!');
                }
            }
        }
    }, 1000);
}

function updateTimerHUD() {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('match-timer').textContent = `${mins}:${secs}`;
}

function updateStats() {
    if (possessionHolder) stats.possessionTime[possessionHolder]++;
    const total = stats.possessionTime.p1 + stats.possessionTime.ai;
    const p1Perc = total > 0 ? Math.round((stats.possessionTime.p1 / total) * 100) : 50;
    document.getElementById('stat-shots').textContent = stats.shots;
    document.getElementById('stat-poss').textContent = `${p1Perc}%`;
    document.getElementById('stat-kick').textContent = Math.round(stats.maxKickForce);
}

function startAmbient() {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    ambientSource = audioCtx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.02;

    ambientSource.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    ambientSource.start();
}

// Classes
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.life = 1.0;
        this.color = color;
        this.size = Math.random() * 5 + 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
    }
    draw() {
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

class CrowdMember {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        this.size = Math.random() * 4 + 2;
        this.offset = Math.random() * Math.PI * 2;
    }
    update() {
        let bounce = (shakeAmount > 0) ? 10 : 2;
        this.y = this.baseY + Math.sin(Date.now() / 200 + this.offset) * bounce;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Player {
    constructor(x, y, color, side) {
        this.x = x;
        this.y = y;
        this.radius = 28;
        this.color = color;
        this.side = side;
        this.vx = 0;
        this.vy = 0;
        this.speed = 1.0;
        this.maxSpeed = 8;
        this.kickForce = 18;
    }

    draw() {
        ctx.save();
        ctx.shadowBlur = 25;
        ctx.shadowColor = this.color;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, this.color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    update() {
        this.vx *= 0.92;
        this.vy *= 0.92;
        this.x += this.vx;
        this.y += this.vy;
        this.x = Math.max(this.radius, Math.min(pitch.w - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(pitch.h - this.radius, this.y));
    }
}

class Ball {
    constructor(x, y) {
        this.reset(x, y);
        this.radius = 16;
        this.history = [];
    }
    reset(x, y) {
        this.x = x; this.y = y;
        this.vx = 0; this.vy = 0;
        this.history = [];
    }
    draw() {
        ctx.beginPath();
        for (let i = 0; i < this.history.length; i++) {
            const p = this.history[i];
            const size = this.radius * (1 - i / this.history.length);
            ctx.lineTo(p.x, p.y);
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(255,255,255,0.05)`;
        ctx.fill();
        ctx.save();
        ctx.shadowBlur = 20; ctx.shadowColor = '#fff';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
    }
    update() {
        this.history.unshift({ x: this.x, y: this.y });
        if (this.history.length > 20) this.history.pop();
        this.vx *= friction; this.vy *= friction;
        this.x += this.vx; this.y += this.vy;
        if (this.x - this.radius < 0 || this.x + this.radius > pitch.w) {
            const inGoalY = (this.y > (pitch.h - pitch.goalSize) / 2 && this.y < (pitch.h + pitch.goalSize) / 2);
            if (inGoalY) {
                if (this.x < pitch.w / 2) score('ai'); else score('p1');
            } else {
                this.vx *= -bounce;
                this.x = (this.x < pitch.w / 2) ? this.radius : pitch.w - this.radius;
                createExplosion(this.x, this.y, '#fff', 5);
                playSound(150, 'sine', 0.1);
            }
        }
        if (this.y - this.radius < 0 || this.y + this.radius > pitch.h) {
            this.vy *= -bounce;
            this.y = (this.y < pitch.h / 2) ? this.radius : pitch.h - this.radius;
            createExplosion(this.x, this.y, '#fff', 5);
            playSound(150, 'sine', 0.1);
        }
    }
}

// Instances
const player = new Player(200, pitch.h / 2, '#00d4ff', 'left');
const ai = new Player(pitch.w - 200, pitch.h / 2, '#ff2d55', 'right');
const ball = new Ball(pitch.w / 2, pitch.h / 2);

// Setup
function initCrowd() {
    crowd = [];
    for (let i = 0; i < pitch.w; i += 15) {
        crowd.push(new CrowdMember(i, -15));
        crowd.push(new CrowdMember(i, -30));
        crowd.push(new CrowdMember(i, pitch.h + 15));
        crowd.push(new CrowdMember(i, pitch.h + 30));
    }
}

function createExplosion(x, y, color, count) {
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color));
}

// Input
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Space' && audioCtx.state === 'suspended') audioCtx.resume();
});
window.addEventListener('keyup', e => keys[e.code] = false);

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
});

canvas.addEventListener('mousedown', () => {
    mouse.down = true;
    if (audioCtx.state === 'suspended') audioCtx.resume();
});
window.addEventListener('mouseup', () => mouse.down = false);

function handleInput() {
    // Mouse movement
    const dx = mouse.x - player.x;
    const dy = mouse.y - player.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
        // Move towards mouse
        const angle = Math.atan2(dy, dx);
        player.vx += Math.cos(angle) * player.speed * 1.5;
        player.vy += Math.sin(angle) * player.speed * 1.5;
    }

    const speed = Math.hypot(player.vx, player.vy);
    if (speed > player.maxSpeed) {
        player.vx = (player.vx / speed) * player.maxSpeed;
        player.vy = (player.vy / speed) * player.maxSpeed;
    }

    // Kick (Mouse Click or Space)
    if (mouse.down || keys['Space']) {
        const bdx = ball.x - player.x, bdy = ball.y - player.y, bdist = Math.hypot(bdx, bdy);
        if (bdist < player.radius + ball.radius + 20) {
            const angle = Math.atan2(bdy, bdx);
            ball.vx = Math.cos(angle) * player.kickForce;
            ball.vy = Math.sin(angle) * player.kickForce;
            createExplosion(ball.x, ball.y, player.color, 12);
            playSound(440, 'triangle', 0.2);

            // Stats
            stats.shots++;
            if (player.kickForce > stats.maxKickForce) stats.maxKickForce = player.kickForce;

            // Reset mouse click state to prevent continuous kicking if mouse held down
            // or just let it be for "charged" feeling. Let's make it single shot.
            mouse.down = false;
        }
    }
}

function handleAI() {
    const multi = { amateur: 0.6, pro: 1.0, world: 1.4 }[difficulty];

    // Strategic Target
    let targetX, targetY;

    if (ball.x > pitch.w * 0.5) {
        // Offensive: Predict ball position if difficulty is high
        if (difficulty === 'world') {
            targetX = ball.x + ball.vx * 12;
            targetY = ball.y + ball.vy * 12;
        } else {
            targetX = ball.x;
            targetY = ball.y;
        }
    } else {
        // Defensive: Guard the goal area
        targetX = pitch.w - 150;
        targetY = (ball.y + pitch.h / 2) / 2;
    }

    const dx = targetX - ai.x, dy = targetY - ai.y, dist = Math.hypot(dx, dy);
    if (dist > 5) {
        ai.vx += (dx / dist) * ai.speed * 1.1;
        ai.vy += (dy / dist) * ai.speed * 1.1;
    }

    // Attempt to kick
    const bdx = ball.x - ai.x, bdy = ball.y - ai.y, bdist = Math.hypot(bdx, bdy);
    if (bdist < ai.radius + ball.radius + 15) {
        let kickTargetY = pitch.h / 2;
        if (difficulty === 'world') kickTargetY += (Math.random() - 0.5) * 80;

        const angle = Math.atan2(kickTargetY - ai.y, 0 - ai.x);
        ball.vx = Math.cos(angle) * ai.kickForce;
        ball.vy = Math.sin(angle) * ai.kickForce;
        createExplosion(ball.x, ball.y, ai.color, 15);
        playSound(440, 'triangle', 0.2);
    }
}

function resetPositions() {
    player.x = 200;
    player.y = pitch.h / 2;
    player.vx = 0;
    player.vy = 0;

    ai.x = pitch.w - 200;
    ai.y = pitch.h / 2;
    ai.vx = 0;
    ai.vy = 0;

    ball.reset(pitch.w / 2, pitch.h / 2);
}

function playGoalSound() {
    // Procedural crowd cheer
    const duration = 1.5;
    const oscCount = 10;
    for (let i = 0; i < oscCount; i++) {
        const freq = 100 + Math.random() * 300;
        playSound(freq, 'sawtooth', duration, 0.05);
    }
}

function checkCollisions() {
    [player, ai].forEach(p => {
        const dx = ball.x - p.x, dy = ball.y - p.y, dist = Math.hypot(dx, dy);
        if (dist < p.radius + ball.radius) {
            const angle = Math.atan2(dy, dx), overlap = p.radius + ball.radius - dist;
            ball.x += Math.cos(angle) * overlap; ball.y += Math.sin(angle) * overlap;
            ball.vx += p.vx * 0.6; ball.vy += p.vy * 0.6;
            createExplosion(ball.x, ball.y, '#fff', 3);
            playSound(200, 'sine', 0.05);
        }
    });
}

function drawPitch() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const strips = 12;
    for (let i = 0; i < strips; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent';
        ctx.fillRect(i * (pitch.w / strips), 0, pitch.w / strips, pitch.h);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, pitch.w, pitch.h);
    ctx.beginPath(); ctx.moveTo(pitch.w / 2, 0); ctx.lineTo(pitch.w / 2, pitch.h); ctx.stroke();
    ctx.beginPath(); ctx.arc(pitch.w / 2, pitch.h / 2, 120, 0, Math.PI * 2); ctx.stroke();
    // Goals
    ctx.lineWidth = 15; ctx.lineCap = 'round';
    ctx.strokeStyle = player.color; ctx.beginPath(); ctx.moveTo(0, (pitch.h - pitch.goalSize) / 2); ctx.lineTo(0, (pitch.h + pitch.goalSize) / 2); ctx.stroke();
    ctx.strokeStyle = ai.color; ctx.beginPath(); ctx.moveTo(pitch.w, (pitch.h - pitch.goalSize) / 2); ctx.lineTo(pitch.w, (pitch.h + pitch.goalSize) / 2); ctx.stroke();
}

function score(team) {
    if (team === 'p1') p1Score++; else aiScore++;
    const scoreEl = document.getElementById(team === 'p1' ? 'p1-score' : 'ai-score');
    scoreEl.textContent = team === 'p1' ? p1Score : aiScore;
    scoreEl.classList.add('pulse');
    setTimeout(() => scoreEl.classList.remove('pulse'), 400);

    shakeAmount = 25; flashOpacity = 0.5;
    createExplosion(ball.x, ball.y, team === 'p1' ? player.color : ai.color, 60);
    playSound(team === 'p1' ? 600 : 300, 'square', 0.5);
    playGoalSound();
    showStatus(team === 'p1' ? 'GOOOOL!' : 'YAPAY ZEKA GOL ATTI!');

    if (goldenGoal) {
        endGame(team === 'p1' ? 'KAZANDIN!' : 'YAPAY ZEKA KAZANDI!');
        return;
    }

    if (matchTime === 0 && (p1Score >= winningScore || aiScore >= winningScore)) {
        endGame(team === 'p1' ? 'KAZANDIN!' : 'YAPAY ZEKA KAZANDI!');
    } else {
        resetPositions();
    }
}

function showStatus(text) {
    const msg = document.getElementById('message-container');
    document.getElementById('status-text').textContent = text;
    msg.classList.remove('hidden');
    gameRunning = false;
    setTimeout(() => {
        msg.classList.add('hidden');
        // Only resume if nobody has won yet
        if (p1Score < winningScore && aiScore < winningScore && !goldenGoal) {
            gameRunning = true;
        }
        // If golden goal was active, we should have ended already, but this is a safety.
    }, 2000);
}

function endGame(text) {
    gameRunning = false;
    clearInterval(timerInterval);
    updateStats();
    document.getElementById('message-container').classList.add('hidden');
    document.getElementById('winner-text').textContent = text;
    document.getElementById('win-screen').classList.remove('hidden');
    playSound(800, 'sawtooth', 0.8);

    if (text.includes('KAZANDIN')) {
        // Fireworks celebration
        let count = 0;
        const interval = setInterval(() => {
            if (count++ > 10) clearInterval(interval);
            createExplosion(Math.random() * pitch.w, Math.random() * pitch.h, `hsl(${Math.random() * 360}, 100%, 50%)`, 30);
            playSound(200 + Math.random() * 400, 'sine', 0.2);
        }, 300);
    }
}

function loop() {
    if (gameRunning) {
        handleInput(); handleAI(); checkCollisions();
        player.update(); ai.update(); ball.update();
        particles.forEach((p, i) => { p.update(); if (p.life <= 0) particles.splice(i, 1); });
        crowd.forEach(m => m.update());

        // Track possession
        const distP1 = Math.hypot(ball.x - player.x, ball.y - player.y);
        const distAI = Math.hypot(ball.x - ai.x, ball.y - ai.y);
        if (distP1 < 100) possessionHolder = 'p1';
        else if (distAI < 100) possessionHolder = 'ai';
        updateStats();

        if (shakeAmount > 0) shakeAmount *= 0.9;
        if (flashOpacity > 0) flashOpacity -= 0.02;
    }
    ctx.save();
    if (shakeAmount > 0.1) ctx.translate((Math.random() - 0.5) * shakeAmount, (Math.random() - 0.5) * shakeAmount);
    drawPitch(); crowd.forEach(m => m.draw()); player.draw(); ai.draw(); ball.draw(); particles.forEach(p => p.draw());
    ctx.restore();
    if (flashOpacity > 0.01) { ctx.fillStyle = `rgba(255,255,255,${flashOpacity})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    requestAnimationFrame(loop);
}

// UI
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    canvas.width = pitch.w; canvas.height = pitch.h;
    initCrowd();
    applyDifficulty();
    startTimer();
    gameRunning = true;
    audioCtx.resume();
    startAmbient();
    loop();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    p1Score = 0; aiScore = 0;
    stats = { shots: 0, possessionTime: { p1: 0, ai: 0 }, maxKickForce: 0, collisions: 0 };
    goldenGoal = false;
    document.getElementById('p1-score').textContent = '0';
    document.getElementById('ai-score').textContent = '0';
    document.getElementById('win-screen').classList.add('hidden');
    resetPositions();
    startTimer();
    gameRunning = true;
});

document.querySelectorAll('.color-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.color-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        player.color = opt.dataset.color;
        document.querySelector('.team.p1').style.color = player.color;
    });
});
