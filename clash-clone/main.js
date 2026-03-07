/**
 * CLASH ARENA - PROFESSIONAL ENGINE REFACTOR
 * Inspired by high-performance RTS architectures
 */

// --- Configuration & Data ---
const CONFIG = {
    ARENA_WIDTH: 500,
    ARENA_HEIGHT: 800,
    ELIXIR_MAX: 10,
    ELIXIR_REGEN_RATE: 0.8, // Slightly faster regen for excitement
    FIXED_DELTA_TIME: 1 / 60,
    KING_HP: 2400,
    ARCHER_TOWER_HP: 1400,
    TOWER_RANGE: 220,
    TOWER_HIT_SPEED: 800, // ms
};

const UNIT_DATA = {
    WARRIOR: {
        name: 'Warrior', id: 'warrior', cost: 3, hp: 600, damage: 70, hitSpeed: 1100,
        range: 30, speed: 1.2, radius: 15, type: 'melee', target: 'any'
    },
    ARCHER: {
        name: 'Archer', id: 'archer', cost: 2, hp: 250, damage: 45, hitSpeed: 1200,
        range: 160, speed: 1.5, radius: 10, type: 'ranged', target: 'any'
    },
    GIANT: {
        name: 'Giant', id: 'giant', cost: 5, hp: 2000, damage: 120, hitSpeed: 1500,
        range: 40, speed: 0.8, radius: 22, type: 'melee', target: 'buildings'
    },
    KNIGHT: {
        name: 'Knight', id: 'knight', cost: 3, hp: 900, damage: 95, hitSpeed: 1200,
        range: 30, speed: 1.1, radius: 15, type: 'melee', target: 'any'
    },
    MINION: {
        name: 'Minion', id: 'minion', cost: 3, hp: 190, damage: 40, hitSpeed: 1000,
        range: 35, speed: 2.5, radius: 10, type: 'melee', target: 'any'
    },
    VALKYRIE: {
        name: 'Valkyrie', id: 'valkyrie', cost: 4, hp: 800, damage: 110, hitSpeed: 1500,
        range: 35, speed: 1.3, radius: 18, type: 'melee', target: 'any'
    },
    MUSKETEER: {
        name: 'Musketeer', id: 'musketeer', cost: 4, hp: 340, damage: 100, hitSpeed: 1100,
        range: 180, speed: 1.3, radius: 12, type: 'ranged', target: 'any'
    },
    SKELETONS: {
        name: 'Skeletons', id: 'skeletons', cost: 1, hp: 67, damage: 67, hitSpeed: 1000,
        range: 30, speed: 1.8, radius: 8, type: 'melee', target: 'any'
    },
    BOMBER: {
        name: 'Bomber', id: 'bomber', cost: 2, hp: 260, damage: 150, hitSpeed: 1800,
        range: 130, speed: 1.1, radius: 12, type: 'ranged', target: 'any'
    },
    WIZARD: {
        name: 'Wizard', id: 'wizard', cost: 5, hp: 590, damage: 230, hitSpeed: 1400,
        range: 160, speed: 1.2, radius: 14, type: 'ranged', target: 'any'
    },
    PEKKA: {
        name: 'Mini P.E.K.K.A', id: 'pekka', cost: 4, hp: 1100, damage: 600, hitSpeed: 1600,
        range: 30, speed: 1.8, radius: 14, type: 'melee', target: 'any'
    },
    PRINCE: {
        name: 'Prince', id: 'prince', cost: 5, hp: 1600, damage: 320, hitSpeed: 1400,
        range: 40, speed: 1.5, radius: 18, type: 'melee', target: 'any'
    }
};

// --- Core Classes ---

/**
 * Base Entity Class
 */
class Entity {
    constructor(x, y, side) {
        this.x = x;
        this.y = y;
        this.side = side; // 'player' or 'enemy'
        this.id = Math.random().toString(36).substr(2, 9);
        this.isDead = false;
        this.lastHitTime = 0;
    }

    getDistanceTo(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
}

/**
 * Mobile Unit Entity
 */
class Unit extends Entity {
    constructor(x, y, side, data) {
        super(x, y, side);
        Object.assign(this, data);
        this.currentHp = this.hp;
        this.target = null;
        this.state = 'IDLE'; // IDLE, MOVE, ATTACK
    }

    update(dt, entities) {
        if (this.currentHp <= 0) {
            this.isDead = true;
            return;
        }

        // 1. Find Target
        this.findTarget(entities);

        // 2. State Logic
        if (!this.target) {
            this.state = 'IDLE';
            // Default movement towards king tower
            const objective = this.side === 'player' ? { x: 250, y: 80 } : { x: 250, y: 720 };
            this.moveTowards(objective.x, objective.y);
        } else {
            const dist = this.getDistanceTo(this.target);
            if (dist > this.range) {
                this.state = 'MOVE';
                this.moveTowards(this.target.x, this.target.y);
            } else {
                this.state = 'ATTACK';
                this.attackTarget();
            }
        }
    }

    findTarget(entities) {
        const opponentSide = this.side === 'player' ? 'enemy' : 'player';
        let closest = null;
        let minDist = Infinity;

        entities.forEach(entity => {
            if (entity.side !== opponentSide || entity.isDead) return;
            if (this.target === 'buildings' && !(entity instanceof Tower)) return;

            const d = this.getDistanceTo(entity);
            if (d < minDist) {
                minDist = d;
                closest = entity;
            }
        });

        this.target = closest;
    }

    moveTowards(tx, ty) {
        const angle = Math.atan2(ty - this.y, tx - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    attackTarget() {
        const now = Date.now();
        if (now - this.lastHitTime > this.hitSpeed) {
            if (this.type === 'ranged') {
                window.gameInstance.projectiles.push(new Projectile(this.x, this.y, this.target, this.damage));
                // Muzzle Flash
                for (let i = 0; i < 3; i++) {
                    window.gameInstance.particles.push({
                        x: this.x, y: this.y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10,
                        life: 0.8, color: '#fcd34d' // Gold flash
                    });
                }
            } else {
                this.target.applyDamage(this.damage);
            }
            this.lastHitTime = now;
            window.gameInstance.sounds.playHit(this.name);
        }
    }

    applyDamage(amount) {
        this.currentHp -= amount;
        // Spark Impact
        for (let i = 0; i < 8; i++) {
            window.gameInstance.particles.push({
                x: this.x, y: this.y,
                vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
                life: 1.0, color: i % 2 === 0 ? '#fff' : '#f87171'
            });
        }
    }
}

/**
 * Stationary Tower Entity
 */
class Tower extends Entity {
    constructor(x, y, side, type) {
        super(x, y, side);
        this.type = type; // 'king' or 'archer'
        this.hp = type === 'king' ? CONFIG.KING_HP : CONFIG.ARCHER_TOWER_HP;
        this.maxHp = this.hp;
        this.range = CONFIG.TOWER_RANGE;
        this.hitSpeed = CONFIG.TOWER_HIT_SPEED;
    }

    update(dt, entities) {
        if (this.hp <= 0) {
            this.isDead = true;
            return;
        }

        // Defensive firing
        const now = Date.now();
        if (now - this.lastHitTime > this.hitSpeed) {
            const opponentSide = this.side === 'player' ? 'enemy' : 'player';
            const target = entities.find(e => e.side === opponentSide && !e.isDead && this.getDistanceTo(e) < this.range);

            if (target) {
                window.gameInstance.projectiles.push(new Projectile(this.x, this.y, target, 30));
                this.lastHitTime = now;
            }
        }
    }

    applyDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            window.gameInstance.shake = 20;
            window.gameInstance.sounds.playHit('Giant'); // Heavy thud
        }
    }
}

/**
 * Projectile Class
 */
class Projectile {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 7;
        this.isDead = false;
    }

    update() {
        if (!this.target || this.target.isDead) {
            this.isDead = true;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 15) {
            this.target.applyDamage(this.damage);
            this.isDead = true;
        } else {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Audio Manager
 */
class SoundEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    playSpawn() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.2);
    }
    playHit(type) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = (type === 'Archer' || type === 'Musketeer') ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(type === 'Archer' ? 800 : 150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.1);
    }
}

/**
 * Main Game Orchestrator
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sounds = new SoundEngine();

        this.entities = [];
        this.projectiles = [];
        this.particles = [];
        this.shake = 0;
        this.elixir = 5;
        this.time = 0;

        this.deck = []; // Chosen at start
        this.selectedCards = [];

        this.isRunning = false;
        this.init();
    }

    init() {
        this.resize();
        this.setupTowers();
        this.bindEvents();
        this.initCollection();
    }

    initCollection() {
        const container = document.getElementById('unit-collection');
        container.innerHTML = '';
        Object.keys(UNIT_DATA).forEach(key => {
            const unit = UNIT_DATA[key];
            const portrait = this.generatePortrait(unit.id, unit.name);
            const card = document.createElement('div');
            card.className = 'coll-card';
            card.innerHTML = `
                <div class="cost">${unit.cost}</div>
                <img src="${portrait}" class="unit-portrait">
                <div class="name">${unit.name}</div>
            `;
            card.onclick = () => this.toggleCardSelection(key, card);
            container.appendChild(card);
        });
    }

    toggleCardSelection(key, el) {
        const idx = this.selectedCards.indexOf(key);
        if (idx > -1) {
            this.selectedCards.splice(idx, 1);
            el.classList.remove('selected');
        } else if (this.selectedCards.length < 8) {
            this.selectedCards.push(key);
            el.classList.add('selected');
        }

        const btn = document.getElementById('start-btn');
        if (this.selectedCards.length === 8) {
            btn.classList.remove('disabled');
            btn.disabled = false;
            btn.innerText = 'BATTLE BEGINS!';
        } else {
            btn.classList.add('disabled');
            btn.disabled = true;
            btn.innerText = `SELECT ${8 - this.selectedCards.length} MORE`;
        }
    }

    setupTowers() {
        // Player
        this.entities.push(new Tower(100, 650, 'player', 'archer'));
        this.entities.push(new Tower(400, 650, 'player', 'archer'));
        this.entities.push(new Tower(250, 720, 'player', 'king'));
        // Enemy
        this.entities.push(new Tower(100, 150, 'enemy', 'archer'));
        this.entities.push(new Tower(400, 150, 'enemy', 'archer'));
        this.entities.push(new Tower(250, 80, 'enemy', 'king'));
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    resize() {
        this.canvas.width = CONFIG.ARENA_WIDTH;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        document.getElementById('start-btn').onclick = () => this.start();
    }

    generatePortrait(id, name) {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 100; pCanvas.height = 120;
        const pCtx = pCanvas.getContext('2d');

        // Backdrop
        const g = pCtx.createLinearGradient(0, 0, 0, 120);
        g.addColorStop(0, '#1e293b'); g.addColorStop(1, '#0f172a');
        pCtx.fillStyle = g;
        pCtx.fillRect(0, 0, 100, 120);

        // Character Body (Zoomed in)
        pCtx.save();
        pCtx.translate(50, 70);
        pCtx.scale(2.5, 2.5); // Zoomed face

        const teamColor = '#3b82f6'; // Collection uses friendly blue

        if (id === 'giant') {
            pCtx.fillStyle = '#d97706'; pCtx.fillRect(-10, -10, 20, 20);
            this.drawFace(pCtx, 0, -5, 8, teamColor);
        } else if (id === 'archer') {
            pCtx.fillStyle = '#3b82f6'; pCtx.beginPath(); pCtx.moveTo(0, -10); pCtx.lineTo(10, 10); pCtx.lineTo(-10, 10); pCtx.fill();
            this.drawFace(pCtx, 0, -2, 6, '#f9a8d4');
        } else if (id === 'warrior') {
            pCtx.fillStyle = '#64748b'; pCtx.beginPath(); pCtx.arc(0, 5, 10, 0, Math.PI * 2); pCtx.fill();
            this.drawFace(pCtx, 0, -2, 7, '#fcd34d');
        } else if (id === 'minion') {
            pCtx.fillStyle = '#4c1d95'; pCtx.beginPath(); pCtx.arc(0, 0, 8, 0, Math.PI * 2); pCtx.fill();
            pCtx.fillStyle = '#ef4444'; pCtx.beginPath(); pCtx.arc(-4, -4, 2, 0, Math.PI * 2); pCtx.arc(4, -4, 2, 0, Math.PI * 2); pCtx.fill();
        } else if (id === 'valkyrie') {
            pCtx.fillStyle = '#78350f'; pCtx.beginPath(); pCtx.arc(0, 10, 12, 0, Math.PI * 2); pCtx.fill();
            this.drawFace(pCtx, 0, -2, 8, '#f97316');
        } else if (id === 'musketeer') {
            pCtx.fillStyle = '#475569'; pCtx.fillRect(-10, 0, 20, 15);
            this.drawFace(pCtx, 0, -4, 7, '#9333ea');
        } else if (id === 'skeletons') {
            pCtx.fillStyle = '#f1f5f9'; pCtx.beginPath(); pCtx.arc(0, 0, 8, 0, Math.PI * 2); pCtx.fill();
            pCtx.fillStyle = '#000'; pCtx.fillRect(-3, -2, 2, 2); pCtx.fillRect(1, -2, 2, 2);
        } else if (id === 'bomber') {
            pCtx.fillStyle = '#f1f5f9'; pCtx.beginPath(); pCtx.arc(0, 5, 9, 0, Math.PI * 2); pCtx.fill();
            pCtx.fillStyle = '#27272a'; pCtx.beginPath(); pCtx.arc(0, -5, 5, 0, Math.PI * 2); pCtx.fill();
        } else if (id === 'wizard') {
            pCtx.fillStyle = '#1e3a8a'; pCtx.beginPath(); pCtx.arc(0, 10, 12, 0, Math.PI * 2); pCtx.fill();
            this.drawFace(pCtx, 0, -3, 7, '#3b82f6');
        } else if (id === 'pekka') {
            pCtx.fillStyle = '#1e293b'; pCtx.fillRect(-12, -12, 24, 24);
            pCtx.fillStyle = '#9333ea'; pCtx.beginPath(); pCtx.arc(0, 0, 4, 0, Math.PI * 2); pCtx.fill();
            pCtx.fillStyle = '#f8fafc'; pCtx.beginPath(); pCtx.moveTo(-8, -12); pCtx.lineTo(-12, -18); pCtx.moveTo(8, -12); pCtx.lineTo(12, -18); pCtx.stroke();
        } else if (id === 'prince') {
            pCtx.fillStyle = '#e2e8f0'; pCtx.beginPath(); pCtx.arc(0, 5, 11, 0, Math.PI * 2); pCtx.fill();
            this.drawFace(pCtx, 0, -2, 7, '#fbbf24');
        } else {
            pCtx.fillStyle = teamColor; pCtx.beginPath(); pCtx.arc(0, 0, 8, 0, Math.PI * 2); pCtx.fill();
            this.drawFace(pCtx, 0, 0, 7, teamColor);
        }
        pCtx.restore();

        return pCanvas.toDataURL();
    }

    drawFace(ctx, x, y, r, hairColor) {
        ctx.fillStyle = '#fef3c7'; // Skin
        ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, Math.PI * 2); ctx.fill();
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.1, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.3, y - r * 0.1, 1.5, 0, Math.PI * 2); ctx.fill();
        // Hair
        ctx.fillStyle = hairColor;
        ctx.beginPath(); ctx.arc(x, y - r * 0.5, r * 0.7, Math.PI, 0); ctx.fill();
    }

    // ... updated updateUI below ...

    updateUI() {
        const handEl = document.getElementById('card-hand');
        handEl.innerHTML = '';
        this.hand.forEach((key, i) => {
            const unit = UNIT_DATA[key];
            const portrait = this.generatePortrait(unit.id, unit.name);
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="cost">${unit.cost}</div>
                <img src="${portrait}" class="unit-portrait">
                <div class="name">${unit.name}</div>
            `;
            card.onclick = () => this.spawnUnit(key, i);
            handEl.appendChild(card);
        });

        const nextEl = document.getElementById('next-card');
        const nextUnit = UNIT_DATA[this.nextCard];
        const nextPortrait = this.generatePortrait(nextUnit.id, nextUnit.name);
        nextEl.innerHTML = `
            <div class="cost">${nextUnit.cost}</div>
            <img src="${nextPortrait}" style="width:100%; height:100%; object-fit:cover; border-radius:4px">
        `;
    }

    start() {
        if (this.selectedCards.length < 8) return;
        this.deck = [...this.selectedCards];
        this.shuffle(this.deck);
        this.hand = this.deck.splice(0, 4);
        this.nextCard = this.deck.splice(0, 1)[0];

        document.getElementById('menu-overlay').classList.remove('active');
        this.isRunning = true;
        this.lastTime = performance.now();
        setInterval(() => this.spawnEnemy(), 5000);
        this.updateUI();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    spawnUnit(key, index) {
        const data = UNIT_DATA[key];
        if (this.elixir >= data.cost) {
            this.elixir -= data.cost;
            this.sounds.playSpawn();

            this.entities.push(new Unit(100 + Math.random() * 300, 550 + Math.random() * 100, 'player', data));

            // Rotate Deck
            const played = this.hand.splice(index, 1)[0];
            this.deck.push(played);
            this.hand.push(this.nextCard);
            this.nextCard = this.deck.splice(0, 1)[0];
            this.updateUI();
        }
    }

    spawnEnemy() {
        if (!this.isRunning) return;
        const keys = Object.keys(UNIT_DATA);
        const type = keys[Math.floor(Math.random() * keys.length)];
        this.entities.push(new Unit(100 + Math.random() * 300, 100 + Math.random() * 50, 'enemy', UNIT_DATA[type]));
    }

    createImpact(x, y, color) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 1, color
            });
        }
    }

    update(dt) {
        if (!this.isRunning) return;
        this.time += dt; // For animation

        if (this.shake > 0) this.shake *= 0.9; else this.shake = 0;

        // Elixir
        this.elixir = Math.min(CONFIG.ELIXIR_MAX, this.elixir + CONFIG.ELIXIR_REGEN_RATE * dt);
        document.getElementById('elixir-fill').style.width = `${(this.elixir / 10) * 100}%`;
        document.getElementById('elixir-count').innerText = Math.floor(this.elixir);

        // Update Entities
        this.entities.forEach(e => e.update(dt, this.entities));
        this.entities = this.entities.filter(e => !e.isDead);

        // Update Systems
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => !p.isDead);

        this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.05; });
        this.particles = this.particles.filter(p => p.life > 0);

        // Win Loss
        const enemyKing = this.entities.find(e => e.side === 'enemy' && e.type === 'king');
        const playerKing = this.entities.find(e => e.side === 'player' && e.type === 'king');
        if (!enemyKing) this.endGame('VICTORY!');
        if (!playerKing) this.endGame('DEFEAT...');
    }

    render() {
        this.ctx.save();
        if (this.shake > 1) this.ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawArena();
        this.entities.forEach(e => this.drawEntity(e));
        this.projectiles.forEach(p => p.draw(this.ctx));
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, 4, 4);
        });
        this.ctx.restore();
    }

    drawArena() {
        const squareSize = 32;
        // Checkerboard grass with mini-highlights
        for (let y = 0; y < this.canvas.height; y += squareSize) {
            for (let x = 0; x < this.canvas.width; x += squareSize) {
                const isDark = ((x / squareSize) + (y / squareSize)) % 2 === 0;
                this.ctx.fillStyle = isDark ? '#3d592a' : '#476731';
                this.ctx.fillRect(x, y, squareSize, squareSize);

                // Subtle texture dots
                if (Math.random() > 0.8) {
                    this.ctx.fillStyle = isDark ? '#364f25' : '#415e2d';
                    this.ctx.fillRect(x + 5, y + 5, 2, 2);
                }
            }
        }

        // River (Elixir Valley Style)
        const rY = 400 - 40;
        const riverH = 80;

        // River Shadow/Bank
        this.ctx.fillStyle = '#2d1b33'; // Dark purple bank
        this.ctx.fillRect(0, rY - 5, this.canvas.width, riverH + 10);

        // Glowing Liquid Elixir (Animated-like glow)
        this.ctx.save();
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#e879f9';
        const g = this.ctx.createLinearGradient(0, rY, 0, rY + riverH);
        g.addColorStop(0, '#c026d3');
        g.addColorStop(0.5, '#f472b6');
        g.addColorStop(1, '#c026d3');
        this.ctx.fillStyle = g;
        this.ctx.fillRect(0, rY + 12, this.canvas.width, riverH - 24);

        // Flow lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const flowX = (this.time * 50 + i * 150) % this.canvas.width;
            this.ctx.beginPath();
            this.ctx.moveTo(flowX, rY + 20 + i * 10);
            this.ctx.lineTo(flowX + 40, rY + 20 + i * 10);
            this.ctx.stroke();
        }
        this.ctx.restore();

        // Bank Details (Cracked rocks)
        this.ctx.strokeStyle = '#4c1d95';
        this.ctx.lineWidth = 2;
        for (let x = 0; x < this.canvas.width; x += 60) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, rY + 5); this.ctx.lineTo(x + 20, rY + 15);
            this.ctx.stroke();
        }

        // Bridges (Detailed wood/stone)
        this.drawBridge(70, rY - 15, 60, riverH + 30);
        this.drawBridge(370, rY - 15, 60, riverH + 30);
    }

    drawBridge(x, y, w, h) {
        // Stone Base
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillRect(x, y, w, h);

        // Wood Planks
        this.ctx.fillStyle = '#451a03';
        for (let py = y + 5; py < y + h; py += 15) {
            this.ctx.fillRect(x + 2, py, w - 4, 10);
            // Nail dots
            this.ctx.fillStyle = '#1e1b4b';
            this.ctx.fillRect(x + 5, py + 3, 2, 2);
            this.ctx.fillRect(x + w - 7, py + 3, 2, 2);
            this.ctx.fillStyle = '#451a03';
        }
    }

    drawEntity(e) {
        const team = e.side === 'player' ? '#3b82f6' : '#ef4444';
        const isEnemy = e.side === 'enemy';

        // 1. 3D Drop Shadow (Skewed)
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0,0,0,0.25)';
        this.ctx.translate(e.x, e.y);
        this.ctx.transform(1, 0, 0.5, 0.5, 5, 5); // Skew it!
        if (e instanceof Tower) {
            const s = e.type === 'king' ? 70 : 55;
            this.ctx.fillRect(-s / 2, -s / 2, s, s);
        } else {
            this.ctx.beginPath(); this.ctx.arc(0, 0, e.radius, 0, Math.PI * 2); this.ctx.fill();
        }
        this.ctx.restore();

        // 2. Main Entity Body
        this.ctx.save();
        this.ctx.translate(e.x, e.y);
        if (e instanceof Tower) {
            this.drawRealisticTower(e, team);
        } else {
            this.drawRealisticUnit(e, team);
        }
        this.ctx.restore();

        // 3. UI Layer (Level badges, HP)
        this.drawRealisticUI(e);
    }

    drawRealisticTower(t, team) {
        const size = t.type === 'king' ? 66 : 52;

        // Base Stone Pillar
        const g = this.ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
        g.addColorStop(0, '#cbd5e1'); g.addColorStop(0.5, '#f8fafc'); g.addColorStop(1, '#94a3b8');
        this.ctx.fillStyle = g;
        this.ctx.fillRect(-size / 2, -size / 2, size, size);

        // Wooden Platform Top
        this.ctx.fillStyle = '#78350f';
        this.ctx.fillRect(-size / 2 - 4, -size / 2 - 10, size + 8, 14);

        // Red/Blue Cloth
        this.ctx.fillStyle = team;
        this.ctx.fillRect(-size / 2 + 10, size / 2 - 2, size - 20, 12);

        // Figures
        this.ctx.fillStyle = '#fef3c7'; // Skin
        this.ctx.beginPath();
        if (t.type === 'king') {
            this.ctx.arc(0, -size / 2 - 15, 14, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#facc15'; // Crown
            this.ctx.beginPath();
            this.ctx.moveTo(-10, -size / 2 - 25); this.ctx.lineTo(0, -size / 2 - 35); this.ctx.lineTo(10, -size / 2 - 25);
            this.ctx.closePath(); this.ctx.fill();
        } else {
            this.ctx.arc(0, -size / 2 - 12, 10, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = team; // Archer hat
            this.ctx.fillRect(-8, -size / 2 - 22, 16, 6);
        }
    }

    drawRealisticUnit(u, team) {
        this.ctx.save();
        const lightX = this.canvas.width / 2;
        const lightY = this.canvas.height / 2;
        const distToLight = Math.sqrt(Math.pow(u.x - lightX, 2) + Math.pow(u.y - lightY, 2));

        // Dynamic highlight based on light source
        const angleToLight = Math.atan2(lightY - u.y, lightX - u.x);
        const hX = Math.cos(angleToLight) * (u.radius / 2);
        const hY = Math.sin(angleToLight) * (u.radius / 2);

        const bodyG = this.ctx.createRadialGradient(hX, hY, 2, 0, 0, u.radius);
        bodyG.addColorStop(0, '#fff');
        bodyG.addColorStop(0.3, team);
        bodyG.addColorStop(1, '#000');
        this.ctx.fillStyle = bodyG;

        this.ctx.beginPath();
        if (u.id === 'giant') {
            this.ctx.roundRect(-22, -22, 44, 44, 8); this.ctx.fill();
            this.drawFace(0, -10, 15, team);
        } else if (u.id === 'archer') {
            this.ctx.moveTo(0, -18); this.ctx.lineTo(15, 15); this.ctx.lineTo(-15, 15); this.ctx.closePath(); this.ctx.fill();
            this.drawFace(0, -5, 10, '#f9a8d4');
        } else if (u.id === 'skeletons') {
            this.ctx.fillStyle = '#f1f5f9';
            this.ctx.arc(0, 0, 8, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(-3, -2, 2, 2); this.ctx.fillRect(1, -2, 2, 2);
        } else {
            this.ctx.arc(0, 0, u.radius, 0, Math.PI * 2); this.ctx.fill();
            this.drawFace(0, 0, u.radius * 0.8, team);
        }
        this.ctx.restore();
    }

    drawFace(x, y, r, hairColor) {
        this.ctx.fillStyle = '#fef3c7'; // Skin
        this.ctx.beginPath(); this.ctx.arc(x, y, r * 0.8, 0, Math.PI * 2); this.ctx.fill();
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath(); this.ctx.arc(x - r * 0.3, y - r * 0.1, 2, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.beginPath(); this.ctx.arc(x + r * 0.3, y - r * 0.1, 2, 0, Math.PI * 2); this.ctx.fill();
        // Hair
        this.ctx.fillStyle = hairColor;
        this.ctx.beginPath(); this.ctx.arc(x, y - r * 0.5, r * 0.7, Math.PI, 0); this.ctx.fill();
    }

    drawRealisticUI(e) {
        const hpPerc = (e instanceof Tower) ? e.hp / e.maxHp : e.currentHp / e.hp;
        const barW = 50;
        const yBase = e instanceof Tower ? (e.type === 'king' ? 90 : 70) : 40;

        // 1. Level Shield Badge
        const badgeColor = e.side === 'player' ? '#3b82f6' : '#ef4444';
        this.ctx.fillStyle = badgeColor;
        this.ctx.beginPath();
        this.drawShield(e.x - barW / 2 - 8, e.y - yBase, 16, 18);
        this.ctx.fill();
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("7", e.x - barW / 2, e.y - yBase + 12);

        // 2. Pro HP Bar
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(e.x - barW / 2 + 5, e.y - yBase + 2, barW, 8);

        const hpG = this.ctx.createLinearGradient(0, e.y - yBase, 0, e.y - yBase + 10);
        hpG.addColorStop(0, '#4ade80');
        hpG.addColorStop(1, '#16a34a');
        this.ctx.fillStyle = hpG;
        this.ctx.fillRect(e.x - barW / 2 + 5, e.y - yBase + 2, barW * hpPerc, 8);

        // 3. Tower HP Text
        if (e instanceof Tower) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Rajdhani, Arial';
            this.ctx.textAlign = 'left';
            this.ctx.shadowBlur = 4; this.ctx.shadowColor = 'black';
            this.ctx.fillText(Math.floor(e.hp), e.x + barW / 2 + 10, e.y - yBase + 10);
            this.ctx.shadowBlur = 0;
        }
    }

    drawShield(x, y, w, h) {
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + w, y);
        this.ctx.lineTo(x + w, y + h * 0.7);
        this.ctx.quadraticCurveTo(x + w / 2, y + h, x, y + h * 0.7);
        this.ctx.closePath();
    }

    gameLoop(t) {
        const dt = (t - this.lastTime) / 1000;
        this.lastTime = t;

        this.update(dt);
        this.render();

        if (this.isRunning) requestAnimationFrame((t) => this.gameLoop(t));
    }

    endGame(msg) {
        this.isRunning = false;
        const o = document.getElementById('menu-overlay');
        o.querySelector('h1').innerText = msg;
        o.classList.add('active');
    }
}

window.onload = () => {
    window.gameInstance = new Game();
};
