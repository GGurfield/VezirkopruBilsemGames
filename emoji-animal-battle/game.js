const BIOMES = {
    FOREST: {
        name: "Forest",
        emoji: "🌲",
        weakTo: "FIRE",
        color: "#2ecc71",
        background: "linear-gradient(135deg, #1e392a, #2ecc71)"
    },
    FIRE: {
        name: "Fire",
        emoji: "🔥",
        weakTo: "OCEAN",
        color: "#e74c3c",
        background: "linear-gradient(135deg, #4d1c1c, #e74c3c)"
    },
    OCEAN: {
        name: "Ocean",
        emoji: "🌊",
        weakTo: "ICE",
        color: "#3498db",
        background: "linear-gradient(135deg, #1c3d5a, #3498db)"
    },
    ICE: {
        name: "Ice",
        emoji: "❄️",
        weakTo: "SAVANNAH",
        color: "#ecf0f1",
        background: "linear-gradient(135deg, #2c3e50, #ecf0f1)"
    },
    SAVANNAH: {
        name: "Savannah",
        emoji: "🌾",
        weakTo: "FOREST",
        color: "#f1c40f",
        background: "linear-gradient(135deg, #3d3b1c, #f1c40f)"
    },
    MOUNTAIN: {
        name: "Mountain",
        emoji: "🏔️",
        weakTo: "OCEAN",
        color: "#95a5a6",
        background: "linear-gradient(135deg, #2c3e50, #95a5a6)"
    },
    DESERT: {
        name: "Desert",
        emoji: "🌵",
        weakTo: "ICE",
        color: "#e67e22",
        background: "linear-gradient(135deg, #a04000, #e67e22)"
    },
    SWAMP: {
        name: "Swamp",
        emoji: "🐊",
        weakTo: "FIRE",
        color: "#16a085",
        background: "linear-gradient(135deg, #0b5345, #16a085)"
    },
    SKY: {
        name: "Sky",
        emoji: "☁️",
        weakTo: "MOUNTAIN",
        color: "#8e44ad",
        background: "linear-gradient(135deg, #4b0082, #8e44ad)"
    }
};

const ANIMALS = [
    // FOREST
    { id: "bee", name: "Bee", emoji: "🐝", biome: "FOREST", hp: 60, atk: 45, def: 20, spd: 90 },
    { id: "owl", name: "Owl", emoji: "🦉", biome: "FOREST", hp: 80, atk: 55, def: 35, spd: 70 },
    { id: "deer", name: "Deer", emoji: "🦌", biome: "FOREST", hp: 100, atk: 40, def: 45, spd: 65 },
    { id: "fox", name: "Fox", emoji: "🦊", biome: "FOREST", hp: 85, atk: 60, def: 30, spd: 80 },

    // FIRE
    { id: "dragon", name: "Dragon", emoji: "🐉", biome: "FIRE", hp: 120, atk: 85, def: 60, spd: 40 },
    { id: "phoenix", name: "Phoenix", emoji: "🐦‍🔥", biome: "FIRE", hp: 90, atk: 75, def: 40, spd: 85 },
    { id: "fire-lion", name: "Magma Lion", emoji: "🦁", biome: "FIRE", hp: 110, atk: 70, def: 55, spd: 50 },
    { id: "salamander", name: "Salamander", emoji: "🦎", biome: "FIRE", hp: 75, atk: 65, def: 35, spd: 75 },

    // OCEAN
    { id: "shark", name: "Shark", emoji: "🦈", biome: "OCEAN", hp: 115, atk: 80, def: 50, spd: 60 },
    { id: "octopus", name: "Octopus", emoji: "🐙", biome: "OCEAN", hp: 95, atk: 65, def: 45, spd: 55 },
    { id: "dolphin", name: "Dolphin", emoji: "🐬", biome: "OCEAN", hp: 90, atk: 55, def: 40, spd: 95 },
    { id: "whale", name: "Whale", emoji: "🐳", biome: "OCEAN", hp: 150, atk: 50, def: 80, spd: 30 },

    // ICE
    { id: "penguin", name: "Penguin", emoji: "🐧", biome: "ICE", hp: 85, atk: 45, def: 55, spd: 65 },
    { id: "polar-bear", name: "Polar Bear", emoji: "🐻‍❄️", biome: "ICE", hp: 130, atk: 70, def: 70, spd: 45 },
    { id: "snow-wolf", name: "Snow Wolf", emoji: "🐺", biome: "ICE", hp: 95, atk: 65, def: 40, spd: 85 },
    { id: "ice-cube", name: "Ice Golem", emoji: "🧊", biome: "ICE", hp: 140, atk: 40, def: 90, spd: 20 },

    // SAVANNAH
    { id: "lion", name: "Lion", emoji: "🦁", biome: "SAVANNAH", hp: 110, atk: 75, def: 55, spd: 60 },
    { id: "elephant", name: "Elephant", emoji: "🐘", biome: "SAVANNAH", hp: 160, atk: 60, def: 85, spd: 25 },
    { id: "zebra", name: "Zebra", emoji: "🦓", biome: "SAVANNAH", hp: 95, atk: 45, def: 40, spd: 80 },
    { id: "giraffe", name: "Giraffe", emoji: "🦒", biome: "SAVANNAH", hp: 105, atk: 50, def: 50, spd: 55 },

    // MOUNTAIN
    { id: "eagle", name: "Eagle", emoji: "🦅", biome: "MOUNTAIN", hp: 85, atk: 70, def: 35, spd: 90 },
    { id: "goat", name: "Goat", emoji: "🐐", biome: "MOUNTAIN", hp: 100, atk: 55, def: 50, spd: 65 },
    { id: "yeti", name: "Yeti", emoji: "👹", biome: "MOUNTAIN", hp: 140, atk: 75, def: 65, spd: 35 },
    { id: "condor", name: "Condor", emoji: "🦅", biome: "MOUNTAIN", hp: 90, atk: 60, def: 40, spd: 80 },

    // DESERT
    { id: "scorpion", name: "Scorpion", emoji: "🦂", biome: "DESERT", hp: 70, atk: 65, def: 45, spd: 75 },
    { id: "camel", name: "Camel", emoji: "🐪", biome: "DESERT", hp: 120, atk: 50, def: 60, spd: 40 },
    { id: "snake", name: "Cobra", emoji: "🐍", biome: "DESERT", hp: 80, atk: 75, def: 30, spd: 85 },
    { id: "fennec", name: "Fennec Fox", emoji: "🦊", biome: "DESERT", hp: 65, atk: 55, def: 25, spd: 95 },

    // SWAMP
    { id: "crocodile", name: "Crocodile", emoji: "🐊", biome: "SWAMP", hp: 130, atk: 80, def: 70, spd: 30 },
    { id: "frog", name: "Poison Frog", emoji: "🐸", biome: "SWAMP", hp: 60, atk: 70, def: 20, spd: 90 },
    { id: "hippo", name: "Hippo", emoji: "🦛", biome: "SWAMP", hp: 150, atk: 65, def: 75, spd: 25 },
    { id: "mosquito", name: "Mosquito", emoji: "🦟", biome: "SWAMP", hp: 30, atk: 90, def: 10, spd: 120 },

    // SKY
    { id: "hawk", name: "Hawk", emoji: "🦅", biome: "SKY", hp: 80, atk: 75, def: 30, spd: 100 },
    { id: "pegasus", name: "Pegasus", emoji: "🦄", biome: "SKY", hp: 100, atk: 65, def: 45, spd: 90 },
    { id: "cloud-spirit", name: "Cloud Spirit", emoji: "☁️", biome: "SKY", hp: 70, atk: 80, def: 20, spd: 110 },
    { id: "thunder-bird", name: "Thunder Bird", emoji: "⚡", biome: "SKY", hp: 90, atk: 85, def: 40, spd: 85 }
];

class Game {
    constructor() {
        this.currentPlayer = 1;
        this.p1Team = [];
        this.p2Team = [];
        this.gameState = 'SETUP'; // SETUP, BATTLE, FINISHED
        this.selectedBiome = 'ALL';
        this.arenaBiome = 'FOREST';

        this.initElements();
        this.initEventListeners();
        this.renderAnimalList();
    }

    initElements() {
        this.animalListEl = document.getElementById('animal-list');
        this.selectedTeamEl = document.getElementById('selected-team');
        this.readyBtn = document.getElementById('ready-btn');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.setupScreen = document.getElementById('setup-screen');
        this.arenaScreen = document.getElementById('arena-screen');
        this.arenaBg = document.getElementById('arena-background');
        this.overlay = document.getElementById('overlay');
        this.overlayMsg = document.getElementById('overlay-msg');
        this.overlayBtn = document.getElementById('overlay-btn');
        this.battleLog = document.querySelector('.log-content');
        this.startBattleBtn = document.getElementById('start-battle-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.p1Render = document.getElementById('p1-render');
        this.p2Render = document.getElementById('p2-render');
    }

    initEventListeners() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                e.target.classList.add('active');
                this.selectedBiome = e.target.dataset.biome;
                this.renderAnimalList();
            });
        });

        this.readyBtn.addEventListener('click', () => this.handleReady());
        this.overlayBtn.addEventListener('click', () => this.handleOverlayContinue());
        this.startBattleBtn.addEventListener('click', () => this.startBattle());
        this.restartBtn.addEventListener('click', () => location.reload());
    }

    renderAnimalList() {
        this.animalListEl.innerHTML = '';
        const filtered = this.selectedBiome === 'ALL'
            ? ANIMALS
            : ANIMALS.filter(a => a.biome === this.selectedBiome);

        filtered.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'animal-card';
            const power = animal.hp + animal.atk + animal.def + animal.spd;
            card.innerHTML = `
                <span class="emoji">${animal.emoji}</span>
                <div class="name">${animal.name}</div>
                <div class="stats">HP: ${animal.hp} ATK: ${animal.atk}</div>
                <div class="stats" style="color: ${BIOMES[animal.biome].color}">${BIOMES[animal.biome].name}</div>
            `;
            card.onclick = () => this.addToTeam(animal);
            this.animalListEl.appendChild(card);
        });
    }

    addToTeam(animal) {
        const team = this.currentPlayer === 1 ? this.p1Team : this.p2Team;
        if (team.length >= 3) return;

        // Don't allow same animal twice for simplicity
        if (team.some(a => a.id === animal.id)) return;

        team.push({ ...animal, currentHp: animal.hp, baseAtk: animal.atk });
        this.updateTeamUI();
    }

    removeFromTeam(index) {
        const team = this.currentPlayer === 1 ? this.p1Team : this.p2Team;
        team.splice(index, 1);
        this.updateTeamUI();
    }

    updateTeamUI() {
        const team = this.currentPlayer === 1 ? this.p1Team : this.p2Team;
        const slots = this.selectedTeamEl.querySelectorAll('.slot');

        slots.forEach((slot, i) => {
            if (team[i]) {
                slot.innerHTML = team[i].emoji;
                slot.classList.add('filled');
                slot.onclick = () => this.removeFromTeam(i);
            } else {
                slot.innerHTML = '';
                slot.classList.remove('filled');
                slot.onclick = null;
            }
        });

        this.readyBtn.disabled = team.length === 0;
    }

    handleReady() {
        if (this.currentPlayer === 1) {
            this.showOverlay("2. Oyuncu Hazırlansın!", "SIRADAKİ");
            this.currentPlayer = 2;
            this.turnIndicator.innerText = "2. Oyuncu: Hayvanlarını Seç";
            this.updateTeamUI();
        } else {
            this.showOverlay("Arena Hazırlanıyor...", "SAVAŞA GİT");
            this.gameState = 'BATTLE';
        }
    }

    showOverlay(msg, btnTxt) {
        this.overlayMsg.innerText = msg;
        this.overlayBtn.innerText = btnTxt;
        this.overlay.classList.remove('hidden');
    }

    handleOverlayContinue() {
        this.overlay.classList.add('hidden');
        if (this.gameState === 'BATTLE') {
            this.setupScreen.classList.add('hidden');
            this.arenaScreen.classList.remove('hidden');
            this.initArena();
        }
    }

    initArena() {
        // Random biome selection
        const biomeKeys = Object.keys(BIOMES);
        this.arenaBiome = biomeKeys[Math.floor(Math.random() * biomeKeys.length)];
        this.arenaBg.style.background = BIOMES[this.arenaBiome].background;

        this.log(`Arena Biyomu: ${BIOMES[this.arenaBiome].name} ${BIOMES[this.arenaBiome].emoji}`);

        // Apply balancing buffs
        [...this.p1Team, ...this.p2Team].forEach(animal => {
            if (animal.biome === this.arenaBiome) {
                const totalStats = animal.hp + animal.baseAtk + animal.def + animal.spd;
                let buff = 0.2; // Default 20%

                if (totalStats >= 330) {
                    buff = 0.1; // Strong animals get 10%
                    this.log(`${animal.emoji} güçlü olduğundan %10 home-field buff aldı.`);
                } else if (totalStats < 240) {
                    buff = 0.3; // Weak animals get 30%
                    this.log(`${animal.emoji} zayıf olduğundan %30 home-field buff aldı!`);
                } else {
                    this.log(`${animal.emoji} %20 home-field buff aldı.`);
                }

                animal.atk = Math.floor(animal.baseAtk * (1 + buff));
            } else {
                animal.atk = animal.baseAtk;
            }
        });

        this.renderArenaTeams();
    }

    renderArenaTeams() {
        this.renderTeam(this.p1Render, this.p1Team);
        this.renderTeam(this.p2Render, this.p2Team);
    }

    renderTeam(container, team) {
        container.innerHTML = '';
        team.forEach(animal => {
            const el = document.createElement('div');
            el.className = `battle-animal ${animal.currentHp <= 0 ? 'defeated' : ''}`;
            el.id = `animal-${animal.id}`;

            const hpPercent = (animal.currentHp / animal.hp) * 100;
            const hpColor = hpPercent > 50 ? '#2ecc71' : hpPercent > 25 ? '#f1c40f' : '#e74c3c';

            el.innerHTML = `
                <span>${animal.emoji}</span>
                <div class="hp-bar-container">
                    <div class="hp-bar-fill" style="width: ${hpPercent}%; background: ${hpColor}"></div>
                </div>
            `;
            container.appendChild(el);
        });
    }

    async startBattle() {
        this.startBattleBtn.classList.add('hidden');
        this.log("Savaş Başladı!");

        while (this.checkWinner() === null) {
            // Get all active animals
            const attackers = [...this.p1Team, ...this.p2Team]
                .filter(a => a.currentHp > 0)
                .sort((a, b) => b.spd - a.spd);

            for (const attacker of attackers) {
                if (attacker.currentHp <= 0) continue;
                if (this.checkWinner() !== null) break;

                const isP1 = this.p1Team.includes(attacker);
                const targetTeam = isP1 ? this.p2Team : this.p1Team;
                const targets = targetTeam.filter(a => a.currentHp > 0);

                if (targets.length === 0) break;

                // Simple AI: attack first available target
                const target = targets[0];
                await this.performAttack(attacker, target, isP1);
            }
        }

        const winner = this.checkWinner();
        this.log(`Oyun Bitti! Kazanan: ${winner}. Oyuncu! 🎉`);
        this.restartBtn.classList.remove('hidden');
    }

    async performAttack(attacker, target, isP1) {
        const attackerEl = document.getElementById(`animal-${attacker.id}`);
        const targetEl = document.getElementById(`animal-${target.id}`);

        attackerEl.classList.add('attacker');
        await this.wait(300);

        // Damage Calculation
        let multiplier = 1.0;

        // Elemental Weakness
        if (BIOMES[target.biome].weakTo === attacker.biome) {
            multiplier += 0.5;
            this.log(`KRİTİK! ${attacker.emoji} ${target.emoji}'ya karşı üstün!`);
        }

        const dmg = Math.max(5, Math.floor((attacker.atk * multiplier) - (target.def * 0.3)));
        target.currentHp -= dmg;

        this.log(`${attacker.emoji} -> ${target.emoji}: ${dmg} HASAR!`);

        targetEl.classList.add('defender');
        await this.wait(300);
        targetEl.classList.remove('defender');
        attackerEl.classList.remove('attacker');

        if (target.currentHp <= 0) {
            target.currentHp = 0;
            targetEl.classList.add('defeated');
            this.log(`${target.emoji} saf dışı kaldı!`);
        }

        this.renderArenaTeams();
        await this.wait(500);
    }

    checkWinner() {
        const p1Alive = this.p1Team.some(a => a.currentHp > 0);
        const p2Alive = this.p2Team.some(a => a.currentHp > 0);

        if (!p1Alive) return 2;
        if (!p2Alive) return 1;
        return null;
    }

    log(msg) {
        const div = document.createElement('div');
        div.innerText = `> ${msg}`;
        this.battleLog.appendChild(div);
        this.battleLog.scrollTop = this.battleLog.scrollHeight;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

new Game();
